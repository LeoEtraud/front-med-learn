const PUBLIC_AUTH_PATHS = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

export function isPublicAuthPath(pathname: string): boolean {
  const path = pathname.split("?")[0] ?? pathname;
  return PUBLIC_AUTH_PATHS.has(path);
}
