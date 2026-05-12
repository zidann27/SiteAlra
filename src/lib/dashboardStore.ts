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

async function fetchProfile(): Promise<UmkmProfile & {
  aiContent?: AIContent | null;
  websiteActive?: boolean;
  visitorTotal?: number;
}> {
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
  await fetch(apiUrl("/api/owner/profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profile),
  });
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
  await fetch(apiUrl("/api/owner/profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ aiContent: content, websiteActive: true }),
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
