/**
 * Exibe apenas o primeiro e o último nome, ignorando nomes intermediários.
 * Ex.: "Maria Clara Santos Oliveira" → "Maria Oliveira"
 */
export function displayFirstLastName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts[0]} ${parts[parts.length - 1]}`;
}
