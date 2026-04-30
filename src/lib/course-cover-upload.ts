const MAX_COVER_BYTES = 3 * 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// FUNÇÃO PARA CONVERTER UM ARQUIVO EM DATA URL
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Falha ao processar o arquivo.'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Falha ao processar o arquivo.'));
    reader.readAsDataURL(file);
  });
}

// FUNÇÃO PARA UPLOADAR UM ARQUIVO DE COBERTURA DE CURSO
export async function uploadCourseCoverFile(file: File): Promise<string> {
  const contentType = (file.type || 'image/jpeg').toLowerCase();
  if (!ALLOWED_COVER_TYPES.has(contentType)) {
    throw new Error('Formato de imagem não suportado. Use JPEG, PNG, WebP ou GIF.');
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new Error('Imagem muito grande. O tamanho máximo é 3 MB.');
  }

  return fileToDataUrl(file);
}
