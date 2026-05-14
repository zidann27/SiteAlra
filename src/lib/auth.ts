export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

const SESSION_KEY = "sitealra_session_v1";
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

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getSessionUser());
}

export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    const response = await fetch(apiUrl("/auth/me"), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    const result = await parseJson<{
      success: boolean;
      data?: SessionUser;
    }>(response);

    if (!result.success || !result.data) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
    return result.data;
  } catch {
    return getSessionUser();
  }
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<SessionUser> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const result = await parseJson<{
    success: boolean;
    data?: SessionUser;
    error?: string;
  }>(response);

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Login gagal");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
  return result.data;
}

export async function registerWithPassword(
  email: string,
  password: string,
  name?: string,
): Promise<SessionUser> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });

  const result = await parseJson<{
    success: boolean;
    data?: SessionUser;
    error?: string;
  }>(response);

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Registrasi gagal");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(result.data));
  return result.data;
}

export function getGoogleAuthUrl(): string {
  return apiUrl("/auth/google");
}

export function getFacebookAuthUrl(): string {
  return apiUrl("/auth/facebook");
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
  await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
}
