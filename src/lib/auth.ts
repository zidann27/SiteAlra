export type SessionUser = {
  email: string;
};

const SESSION_KEY = "sitealra_session_v1";

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

export function signIn(email: string): void {
  const user: SessionUser = { email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}
