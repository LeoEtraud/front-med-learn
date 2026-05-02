const ONLY_DIGITS = /\D/g;

/** Comprimento máximo do valor exibido com máscara de CPF (`000.000.000-00`). */
export const CPF_MASK_MAX_LENGTH = 14;

/** Comprimento máximo do telefone BR mascarado `(11) 98765-4321`. */
export const PHONE_BR_MASK_MAX_LENGTH = 15;

export function digitsOnly(value: string): string {
  return value.replace(ONLY_DIGITS, "");
}

// FUNÇÃO PARA FORMATAR UM TELEFONE EM BRASIL
export function formatPhoneBR(value: string): string {
  const digits = value.replace(ONLY_DIGITS, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export type BrContactValidityOpts = {
  /** Se `true`, string vazia ou só espaços é considerada válida (perfil: campos opcionais). Padrão: `true`. */
  allowEmpty?: boolean;
};

// FUNÇÃO PARA VALIDAR UM TELEFONE EM BRASIL
export function isValidPhoneBR(value: string, opts?: BrContactValidityOpts): boolean {
  const allowEmpty = opts?.allowEmpty ?? true;
  if (!value.trim()) return allowEmpty;
  return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value);
}

// FUNÇÃO PARA FORMATAR UM CPF
export function formatCpf(value: string): string {
  const digits = value.replace(ONLY_DIGITS, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

// FUNÇÃO PARA VALIDAR UM CPF
function isCpfChecksumValid(cpfDigits: string): boolean {
  if (!/^\d{11}$/.test(cpfDigits)) return false;
  if (/^(\d)\1{10}$/.test(cpfDigits)) return false;

  const calcDigit = (base: string, factor: number) => {
    const sum = base.split("").reduce((acc, digit) => acc + Number(digit) * factor--, 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calcDigit(cpfDigits.slice(0, 9), 10);
  const secondDigit = calcDigit(cpfDigits.slice(0, 10), 11);
  return firstDigit === Number(cpfDigits[9]) && secondDigit === Number(cpfDigits[10]);
}

// FUNÇÃO PARA VALIDAR UM CPF
export function isValidCpf(value: string, opts?: BrContactValidityOpts): boolean {
  const allowEmpty = opts?.allowEmpty ?? true;
  if (!value.trim()) return allowEmpty;
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) return false;
  return isCpfChecksumValid(value.replace(ONLY_DIGITS, ""));
}
