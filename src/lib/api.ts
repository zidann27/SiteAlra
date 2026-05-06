import { AIContent, GenerateFormData, GeneratedSite } from "./types";

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

export async function generateWebsiteContent(
  formData: GenerateFormData,
): Promise<AIContent> {
  const response = await fetch(apiUrl("/api/generate-website"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      businessName: formData.businessName,
      businessDescription: formData.businessDescription,
      category: formData.category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }

  const result = await parseJson<{
    success: boolean;
    data?: AIContent;
    error?: string;
  }>(response);
  if (!result.success) {
    throw new Error(result.error || "Generation failed");
  }

  return result.data as AIContent;
}

export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function deploySite(
  formData: GenerateFormData,
  aiContent: AIContent,
): Promise<GeneratedSite> {
  const response = await fetch(apiUrl("/api/sites"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      businessName: formData.businessName,
      businessDescription: formData.businessDescription,
      category: formData.category,
      aiContent,
    }),
  });

  if (!response.ok) {
    throw new Error(`Deploy failed: ${response.statusText}`);
  }

  const result = await parseJson<{
    success: boolean;
    data?: GeneratedSite;
    error?: string;
  }>(response);
  if (!result.success || !result.data)
    throw new Error(result.error || "Deploy failed");
  return result.data;
}

export async function getSiteBySlug(
  slug: string,
): Promise<GeneratedSite | null> {
  const response = await fetch(
    apiUrl(`/api/sites/${encodeURIComponent(slug)}`),
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Load failed: ${response.statusText}`);

  const result = await parseJson<{
    success: boolean;
    data?: GeneratedSite;
    error?: string;
  }>(response);
  if (!result.success) throw new Error(result.error || "Load failed");
  return (result.data ?? null) as GeneratedSite | null;
}

export async function getRecentSites(limit = 6): Promise<GeneratedSite[]> {
  const response = await fetch(
    apiUrl(`/api/sites?limit=${encodeURIComponent(String(limit))}`),
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) throw new Error(`Load failed: ${response.statusText}`);

  const result = await parseJson<{
    success: boolean;
    data?: GeneratedSite[];
    error?: string;
  }>(response);
  if (!result.success) throw new Error(result.error || "Load failed");
  return (result.data || []) as GeneratedSite[];
}
