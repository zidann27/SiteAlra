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

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "";

const CHAT_MESSAGES_KEY = "sitealra_chat_messages_v1";
const CHAT_THREADS_KEY_PREFIX = "sitealra_chat_threads_v1:";
const CHAT_ACTIVE_THREAD_KEY_PREFIX = "sitealra_chat_active_thread_v1:";

export type ChatThread = {
  id: string;
  ownerKey?: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

function userKeyed(prefix: string, userKey: string): string {
  return `${prefix}${userKey || "anon"}`;
}

function apiUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
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

export function loadChatMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
}

function defaultThreadTitle(ts: number): string {
  try {
    const when = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
    return `Chat ${when}`;
  } catch {
    return "Chat";
  }
}

export function loadChatThreads(userKey: string): ChatThread[] {
  try {
    const raw = localStorage.getItem(
      userKeyed(CHAT_THREADS_KEY_PREFIX, userKey),
    );
    if (raw) {
      const parsed = JSON.parse(raw) as ChatThread[];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((t) => ({ ...t, ownerKey: t.ownerKey || userKey }))
        .filter((t) => (t.ownerKey || userKey) === userKey);
    }

    // Migrate legacy single-thread storage for anonymous users.
    if ((userKey || "anon") === "anon") {
      const legacy = loadChatMessages();
      if (legacy.length) {
        const now = Date.now();
        const migrated: ChatThread = {
          id: newId(),
          ownerKey: "anon",
          title: defaultThreadTitle(now),
          createdAt: now,
          updatedAt: now,
          messages: legacy,
        };
        saveChatThreads("anon", [migrated]);
        localStorage.removeItem(CHAT_MESSAGES_KEY);
        return [migrated];
      }
    }

    return [];
  } catch {
    return [];
  }
}

export function saveChatThreads(userKey: string, threads: ChatThread[]): void {
  localStorage.setItem(
    userKeyed(CHAT_THREADS_KEY_PREFIX, userKey),
    JSON.stringify(threads),
  );
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

export function createChatThread(input: {
  userKey: string;
  messages: ChatMessage[];
  title?: string;
}): ChatThread {
  const now = Date.now();
  return {
    id: newId(),
    ownerKey: input.userKey,
    title: (input.title || "").trim() || defaultThreadTitle(now),
    createdAt: now,
    updatedAt: now,
    messages: input.messages,
  };
}
