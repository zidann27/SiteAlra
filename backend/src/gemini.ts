export type ChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type ChatContext = {
  businessName?: string;
  businessType?: string;
  targetCustomers?: string;
};

export type ChatRequest = {
  message: string;
  history?: ChatHistoryItem[];
  context?: ChatContext;
};

type GeminiModel = {
  name: string; // usually "models/<id>"
  supportedGenerationMethods?: string[];
};

type GeminiErrorPayload = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

type GeminiListModelsResponse = {
  models?: GeminiModel[];
};

type GeminiGenerateResponse = {
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function toGeminiRole(role: ChatHistoryItem["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

function buildSystemInstruction(ctx?: ChatContext): string {
  const businessName = ctx?.businessName?.trim();
  const businessType = ctx?.businessType?.trim();
  const targetCustomers = ctx?.targetCustomers?.trim();

  const lines = [
    "Kamu adalah asisten bisnis untuk owner UMKM di Indonesia.",
    "Tugasmu: bantu operasional harian, ide promo, copywriting, pricing sederhana, dan rencana kerja yang praktis.",
    "Jawab ringkas, terstruktur, dan actionable.",
    "Gunakan format plain text (tanpa Markdown). Jangan gunakan tanda: *, **, #, ```.",
    "Jika perlu list, pakai penomoran seperti 1) 2) 3) atau gunakan simbol •.",
    "Jika info kurang, tanya 1-3 pertanyaan klarifikasi.",
    "Jika pengguna bertanya tentang SiteAlra, jangan bilang tidak tahu.",
    "SiteAlra adalah platform untuk membantu UMKM membuat website dengan bantuan AI, tanpa perlu coding.",
    "Soroti manfaat utama: AI Precision (konten sesuai profil bisnis), Modern Design (desain modern untuk konversi), Cloud Secure (keamanan data di cloud).",
    "Jika ditanya biaya, jelaskan bahwa biaya tergantung paket/fitur dan tawarkan untuk cek paket atau tanya kebutuhan pengguna.",
    "Jika history menyebut nama bisnis lama, abaikan. Selalu gunakan nama bisnis terbaru dari konteks.",
  ];

  if (businessName) lines.push(`Nama bisnis: ${businessName}`);
  if (businessType) lines.push(`Jenis usaha: ${businessType}`);
  if (targetCustomers) lines.push(`Target pelanggan: ${targetCustomers}`);

  return lines.join("\n");
}

function stripMarkdownLikeFormatting(text: string): string {
  let out = String(text ?? "");

  // Remove code fences but keep inner content.
  out = out.replace(/```[a-zA-Z0-9_-]*\n?/g, "");
  out = out.replace(/```/g, "");

  // Bold/italic markers.
  out = out.replace(/\*\*(.*?)\*\*/g, "$1");
  out = out.replace(/__(.*?)__/g, "$1");
  out = out.replace(/\*(.*?)\*/g, "$1");
  out = out.replace(/_(.*?)_/g, "$1");

  // Headings.
  out = out
    .split("\n")
    .map((line) => line.replace(/^\s{0,3}#{1,6}\s+/, ""))
    .map((line) => line.replace(/^\s*[-*]\s+/, "• "))
    .join("\n");

  return out.trim();
}

function normalizeModelName(name: string): string {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("models/")
    ? trimmed.slice("models/".length)
    : trimmed;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseGeminiErrorPayload(text: string): GeminiErrorPayload | null {
  try {
    return JSON.parse(text) as GeminiErrorPayload;
  } catch {
    return null;
  }
}

function toFriendlyGeminiError(status: number, text: string): string {
  const payload = parseGeminiErrorPayload(text);
  const apiMessage = payload?.error?.message;
  const apiStatus = payload?.error?.status;

  if (status === 503 || apiStatus === "UNAVAILABLE") {
    return "Gemini sedang ramai (503). Coba lagi dalam 10–30 detik.";
  }

  if (status === 429 || apiStatus === "RESOURCE_EXHAUSTED") {
    return "RESOURCE_EXHAUSTED";
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return `Gemini error: ${apiMessage.trim()}`;
  }

  return `Gemini request failed: ${status}`;
}

let cachedModels: { loadedAt: number; models: GeminiModel[] } | null = null;

async function listModels(apiKey: string): Promise<GeminiModel[]> {
  const now = Date.now();
  if (cachedModels && now - cachedModels.loadedAt < 5 * 60_000) {
    return cachedModels.models;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
    apiKey,
  )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Gemini listModels failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`,
    );
  }

  const data = (await response.json()) as GeminiListModelsResponse;
  const models = Array.isArray(data?.models)
    ? (data.models as GeminiModel[])
    : [];
  cachedModels = { loadedAt: now, models };
  return models;
}

function pickFlashModel(models: GeminiModel[]): string {
  const candidates = models
    .filter((m) => typeof m?.name === "string" && m.name)
    .filter((m) =>
      Array.isArray(m.supportedGenerationMethods)
        ? m.supportedGenerationMethods.includes("generateContent")
        : true,
    )
    .map((m) => normalizeModelName(m.name))
    .filter((name) => name.toLowerCase().includes("gemini"));

  const flash = candidates.filter((name) =>
    name.toLowerCase().includes("flash"),
  );

  // Prefer newest Flash if present, else anything flash.
  const preferredOrder = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
  ];

  for (const p of preferredOrder) {
    const found = flash.find((n) => n === p);
    if (found) return found;
  }

  return flash[0] || candidates[0] || "";
}

export async function chatWithGeminiFlash(req: ChatRequest): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const apiKeyValue: string = apiKey;

  const configuredModel = normalizeModelName(process.env.GEMINI_MODEL || "");
  const fallbackDefault = "gemini-2.5-flash";
  let model = configuredModel || fallbackDefault;

  const history = Array.isArray(req.history) ? req.history : [];
  const contents = history
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    }));

  contents.push({
    role: "user",
    parts: [{ text: req.message }],
  });

  async function callGenerate(modelName: string): Promise<Response> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      modelName,
    )}:generateContent?key=${encodeURIComponent(apiKeyValue)}`;

    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(req.context) }],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1200,
        },
      }),
    });
  }

  async function callGenerateWithRetry(modelName: string): Promise<Response> {
    // Retry a couple times for transient UNAVAILABLE (high demand).
    const delays = [250, 800];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      const res = await callGenerate(modelName);
      if (res.status !== 503) return res;
      const text = await res.text().catch(() => "");
      const payload = parseGeminiErrorPayload(text);
      const apiStatus = payload?.error?.status;
      if (apiStatus !== "UNAVAILABLE") return res;
      if (attempt === delays.length) return res;
      await sleep(delays[attempt]);
    }

    // Unreachable, but keeps TS happy.
    return await callGenerate(modelName);
  }

  let response = await callGenerateWithRetry(model);

  // If model is invalid/unavailable, auto-pick a supported Flash model.
  if (response.status === 404) {
    const models = await listModels(apiKeyValue);
    const picked = pickFlashModel(models);
    if (picked && picked !== model) {
      model = picked;
      response = await callGenerateWithRetry(model);
    }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(toFriendlyGeminiError(response.status, text));
  }

  const data = (await response.json()) as GeminiGenerateResponse;
  const finishReason = data?.candidates?.[0]?.finishReason;
  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => (typeof p?.text === "string" ? p.text : ""))
      .join("")
      .trim() || "";

  if (!reply) throw new Error("Empty response from Gemini");

  const cleaned = stripMarkdownLikeFormatting(reply);

  if (finishReason === "MAX_TOKENS") {
    return `${cleaned}\n\n(Jawaban kepotong karena batas panjang. Balas "lanjut" untuk diteruskan.)`;
  }

  return cleaned;
}
