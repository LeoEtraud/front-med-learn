const PT_BR_ACCENT_WORDS: Record<string, string> = {
  urgencias: "urgências",
  cardiologico: "cardiológico",
  cardiologica: "cardiológica",
  cardiologicos: "cardiológicos",
  cardiologicas: "cardiológicas",
  fisico: "físico",
  fisica: "física",
  fisicos: "físicos",
  fisicas: "físicas",
  emergencia: "emergência",
  emergencias: "emergências",
  basico: "básico",
  basica: "básica",
  basicos: "básicos",
  basicas: "básicas",
  padrao: "padrão",
  padroes: "padrões",
  lesao: "lesão",
  lesoes: "lesões",
  aerea: "aérea",
  ventilacao: "ventilação",
  perfusao: "perfusão",
  neurologico: "neurológico",
  neurologicos: "neurológicos",
  definicao: "definição",
  definicoes: "definições",
  reanimacao: "reanimação",
  terapeutico: "terapêutico",
  terapeuticos: "terapêuticos",
  criterios: "critérios",
  forca: "força",
  coordenacao: "coordenação",
  sindrome: "síndrome",
  sindromes: "síndromes",
  terapeutica: "terapêutica",
  consciencia: "consciência",
  neurologica: "neurológica",
  neurologicas: "neurológicas",
  modulo: "módulo",
  modulos: "módulos",
  conteudo: "conteúdo",
  conteudos: "conteúdos",
  catalogo: "catálogo",
  duvida: "dúvida",
  duvidas: "dúvidas",
  clinica: "clínica",
  clinicas: "clínicas",
};

function preserveWordCase(original: string, corrected: string) {
  if (!original) return corrected;

  if (original === original.toUpperCase()) {
    return corrected.toUpperCase();
  }

  if (original[0] === original[0].toUpperCase()) {
    return corrected[0].toUpperCase() + corrected.slice(1);
  }

  return corrected;
}

export function normalizePtBrText(value?: string | null) {
  if (!value) return value ?? "";

  return value.replace(/[A-Za-zÀ-ÿ]+/g, (word) => {
    const normalized = word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const corrected = PT_BR_ACCENT_WORDS[normalized];
    if (!corrected) return word;

    return preserveWordCase(word, corrected);
  });
}
