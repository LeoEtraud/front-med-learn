/**
 * Mutator usado pelo Orval (`api-spec/orval.config.ts`).
 * Ajuste após rodar `pnpm codegen:api` no backend se o gerador esperar outra assinatura.
 */
export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as T;
}
