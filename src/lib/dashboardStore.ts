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

const PROFILE_KEY = "sitealra_profile_v1";
const PRODUCTS_KEY = "sitealra_products_v1";
const AI_CONTENT_KEY = "sitealra_ai_content_v1";
const WEBSITE_ACTIVE_KEY = "sitealra_website_active_v1";
const VISITOR_TOTAL_KEY = "sitealra_visitor_total_v1";
const CHAT_MESSAGES_KEY = "sitealra_chat_messages_v1";

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

export function loadProfile(): UmkmProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return getDefaultProfile();
    return {
      ...getDefaultProfile(),
      ...(JSON.parse(raw) as Partial<UmkmProfile>),
    };
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile: UmkmProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProducts(): DashboardProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DashboardProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: DashboardProduct[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadAiContent(): AIContent | null {
  try {
    const raw = localStorage.getItem(AI_CONTENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AIContent;
  } catch {
    return null;
  }
}

export function saveAiContent(content: AIContent): void {
  localStorage.setItem(AI_CONTENT_KEY, JSON.stringify(content));
}

export function isWebsiteActive(): boolean {
  try {
    const raw = localStorage.getItem(WEBSITE_ACTIVE_KEY);
    if (raw === null) return Boolean(loadAiContent());
    return raw === "true";
  } catch {
    return Boolean(loadAiContent());
  }
}

export function setWebsiteActive(active: boolean): void {
  localStorage.setItem(WEBSITE_ACTIVE_KEY, String(active));
}

export function getVisitorTotal(): number {
  try {
    const raw = localStorage.getItem(VISITOR_TOTAL_KEY);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
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

export function incrementVisitorTotal(): number {
  const next = getVisitorTotal() + 1;
  localStorage.setItem(VISITOR_TOTAL_KEY, String(next));
  return next;
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
