export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

const SESSION_KEY = "sitealra_session_v1";
const CHAT_ACTIVE_THREAD_KEY_PREFIX = "sitealra_chat_active_thread";
const CHAT_THREADS_KEY_PREFIX = "sitealra_chat_threads";
const CHAT_MESSAGES_KEY = "sitealra_chat_messages";
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
  const session = getSessionUser();
  const userKey = session?.id || session?.email || "anon";
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(`${CHAT_ACTIVE_THREAD_KEY_PREFIX}:${userKey}`);
  localStorage.removeItem(`${CHAT_THREADS_KEY_PREFIX}:${userKey}`);
  localStorage.removeItem(CHAT_MESSAGES_KEY);
  await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(apiUrl("/auth/password/forgot"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  const result = await parseJson<{ success?: boolean; error?: string }>(
    response,
  );

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Gagal mengirim email reset.");
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const response = await fetch(apiUrl("/auth/password/reset"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, password }),
  });

  const result = await parseJson<{ success?: boolean; error?: string }>(
    response,
  );

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Reset password gagal.");
  }
}
