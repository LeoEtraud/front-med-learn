const AUTH_COOKIE_NAME = "medlearn_token";

function cookiePrefix(name: string) {
  return `${encodeURIComponent(name)}=`;
}

export function getAuthTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const prefix = cookiePrefix(AUTH_COOKIE_NAME);
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    if (!cookie.startsWith(prefix)) continue;
    const rawValue = cookie.slice(prefix.length);
    return decodeURIComponent(rawValue);
  }

  return null;
}

export function hasAuthTokenCookie(): boolean {
  return !!getAuthTokenFromCookie();
}

export function setAuthTokenCookie(token: string, maxAgeDays = 7): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = Math.max(1, Math.floor(maxAgeDays * 24 * 60 * 60));

  document.cookie = `${encodeURIComponent(AUTH_COOKIE_NAME)}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearAuthTokenCookie(): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(AUTH_COOKIE_NAME)}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
