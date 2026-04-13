import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// FUNÇÃO PARA COMBINAR E NORMALIZAR CLASSES CSS/TW
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FUNÇÃO PARA FORMATAR DURAÇÃO (SEGUNDOS) EM TEXTO LEGÍVEL
export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}
