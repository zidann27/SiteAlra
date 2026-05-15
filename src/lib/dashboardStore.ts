import type { AIContent } from "./types";

export type UmkmStyle = "modern" | "minimal" | "food" | "luxury";

export type UmkmProfile = {
  name: string;
  businessType: string;
  shortDescription: string;
  targetCustomers: string;
  style: UmkmStyle;
  ownerEmail: string;
  phone: string;
  publicEmail: string;
  address: string;
  hours: string;
  domainName: string;
  logoDataUrl: string | null;
  themeColor: string; // primary color
};

export type DashboardProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageDataUrl: string | null;
};

export type ChatMessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount?: number;
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "";

const CHAT_THREADS_KEY_PREFIX = "sitealra_chat_threads";
const CHAT_ACTIVE_THREAD_KEY_PREFIX = "sitealra_chat_active_thread";
const CHAT_MESSAGES_KEY = "sitealra_chat_messages";


function apiUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function userKeyed(prefix: string, userKey: string): string {
  return `${prefix}:${userKey || "anon"}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export function getDefaultProfile(): UmkmProfile {
  return {
    name: "",
    businessType: "kuliner",
    shortDescription: "",
    targetCustomers: "",
    style: "modern",
    ownerEmail: "",
    phone: "",
    publicEmail: "",
    address: "",
    hours: "",
    domainName: "",
    logoDataUrl: null,
    themeColor: "#2563eb", // tailwind blue-600-ish
  };
}

async function fetchProfile(): Promise<
  UmkmProfile & {
    aiContent?: AIContent | null;
    websiteActive?: boolean;
    visitorTotal?: number;
  }
> {
  const response = await fetch(apiUrl("/api/owner/profile"), {
    method: "GET",
    credentials: "include",
  });

  const result = await parseJson<{
    success: boolean;
    data?: UmkmProfile & {
      aiContent?: AIContent | null;
      websiteActive?: boolean;
      visitorTotal?: number;
    };
    error?: string;
  }>(response);

  if (!response.ok || !result.success || !result.data) {
    return getDefaultProfile();
  }

  return {
    ...getDefaultProfile(),
    ...result.data,
  };
}

export async function loadProfile(): Promise<UmkmProfile> {
  const profile = await fetchProfile();
  return {
    ...getDefaultProfile(),
    ...profile,
  };
}

export async function saveProfile(profile: UmkmProfile): Promise<void> {
  const response = await fetch(apiUrl("/api/owner/profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profile),
  });

  const result = await parseJson<{
    success?: boolean;
    data?: UmkmProfile;
    error?: string;
  }>(response);

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || `Gagal menyimpan settings (${response.status})`,
    );
  }
}

export async function loadProducts(): Promise<DashboardProduct[]> {
  const response = await fetch(apiUrl("/api/owner/products"), {
    method: "GET",
    credentials: "include",
  });

  const result = await parseJson<{
    success: boolean;
    data?: DashboardProduct[];
    error?: string;
  }>(response);

  if (!response.ok || !result.success) {
    return [];
  }

  return result.data || [];
}

export async function saveProducts(
  products: DashboardProduct[],
): Promise<{ ok: true } | { ok: false; error: "network" | "unknown" }> {
  try {
    const response = await fetch(apiUrl("/api/owner/products"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ products }),
    });

    if (!response.ok) {
      return { ok: false, error: "unknown" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

export async function loadAiContent(): Promise<AIContent | null> {
  const profile = await fetchProfile();
  return (profile.aiContent as AIContent | null) ?? null;
}

export async function saveAiContent(content: AIContent): Promise<void> {
  const sanitized: AIContent = {
    ...content,
    products: (content.products || []).map((p) => ({
      ...p,
      imageDataUrl: null,
    })),
    brand: content.brand ? { ...content.brand, logoDataUrl: null } : undefined,
  };

  await fetch(apiUrl("/api/owner/profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ aiContent: sanitized, websiteActive: true }),
  });
}

export async function isWebsiteActive(): Promise<boolean> {
  const profile = await fetchProfile();
  return Boolean(profile.websiteActive ?? profile.aiContent);
}

export async function setWebsiteActive(active: boolean): Promise<void> {
  await fetch(apiUrl("/api/owner/profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ websiteActive: active }),
  });
}

export async function getVisitorTotal(): Promise<number> {
  const profile = await fetchProfile();
  return Number(profile.visitorTotal || 0);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export async function loadChatMessages(): Promise<ChatMessage[]> {
  const response = await fetch(apiUrl("/api/owner/chat"), {
    method: "GET",
    credentials: "include",
  });

  const result = await parseJson<{
    success: boolean;
    data?: ChatMessage[];
    error?: string;
  }>(response);

  if (!response.ok || !result.success) {
    return [];
  }

  return result.data || [];
}

export async function saveChatMessages(messages: ChatMessage[]): Promise<void> {
  await fetch(apiUrl("/api/owner/chat"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });
}

export function loadLegacyChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        typeof m?.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        typeof m.createdAt === "number",
    );
  } catch {
    return [];
  }
}

export function loadLegacyChatThreads(userKey: string): Array<{
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  messages: ChatMessage[];
}> {
  try {
    const raw = localStorage.getItem(userKeyed(CHAT_THREADS_KEY_PREFIX, userKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{
      title?: string;
      createdAt?: number;
      updatedAt?: number;
      messages?: ChatMessage[];
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((t) => ({
        title: typeof t.title === "string" ? t.title : undefined,
        createdAt: typeof t.createdAt === "number" ? t.createdAt : undefined,
        updatedAt: typeof t.updatedAt === "number" ? t.updatedAt : undefined,
        messages: Array.isArray(t.messages) ? t.messages : [],
      }))
      .filter((t) => t.messages.length > 0);
  } catch {
    return [];
  }
}

export function clearLegacyChatThreads(userKey: string): void {
  localStorage.removeItem(userKeyed(CHAT_THREADS_KEY_PREFIX, userKey));
}

export async function loadChatThreads(): Promise<ChatThread[]> {
  const response = await fetch(apiUrl("/api/owner/chat/threads"), {
    method: "GET",
    credentials: "include",
  });

  const result = await parseJson<{
    success: boolean;
    data?: ChatThread[];
    error?: string;
  }>(response);

  if (!response.ok || !result.success) return [];
  return result.data || [];
}

export async function createChatThread(input: {
  title?: string;
  messages?: ChatMessage[];
}): Promise<ChatThread> {
  const response = await fetch(apiUrl("/api/owner/chat/threads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: input.title,
      messages: input.messages,
    }),
  });

  const result = await parseJson<{
    success: boolean;
    data?: ChatThread;
    error?: string;
  }>(response);

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Gagal membuat chat baru.");
  }

  return result.data;
}

export async function loadChatThreadMessages(
  threadId: string,
): Promise<ChatMessage[]> {
  const response = await fetch(
    apiUrl(`/api/owner/chat/threads/${encodeURIComponent(threadId)}`),
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await parseJson<{
    success: boolean;
    data?: ChatMessage[];
    error?: string;
  }>(response);

  if (!response.ok || !result.success) return [];
  return result.data || [];
}

export async function saveChatThreadMessages(
  threadId: string,
  messages: ChatMessage[],
): Promise<void> {
  const response = await fetch(
    apiUrl(`/api/owner/chat/threads/${encodeURIComponent(threadId)}`),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messages }),
    },
  );

  const result = await parseJson<{ success?: boolean; error?: string }>(
    response,
  );

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Gagal menyimpan chat.");
  }
}

export function getActiveChatThreadId(userKey: string): string | null {
  return localStorage.getItem(
    userKeyed(CHAT_ACTIVE_THREAD_KEY_PREFIX, userKey),
  );
}

export function setActiveChatThreadId(userKey: string, threadId: string): void {
  localStorage.setItem(
    userKeyed(CHAT_ACTIVE_THREAD_KEY_PREFIX, userKey),
    threadId,
  );
}

