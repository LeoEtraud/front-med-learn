const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Falha ao processar o arquivo."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Falha ao processar o arquivo."));
    reader.readAsDataURL(file);
  });
}

/** Converte o avatar para data URL (base64) para persistência no banco. */
export async function uploadAvatarFile(file: File): Promise<{ publicUrl: string | null; objectKey: string }> {
  const contentType = (file.type || "image/jpeg").toLowerCase();
  if (!ALLOWED_AVATAR_TYPES.has(contentType)) {
    throw new Error("Formato de imagem não suportado. Use JPEG, PNG, WebP ou GIF.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Imagem muito grande. O tamanho máximo é 3 MB.");
  }

  const dataUrl = await fileToDataUrl(file);
  return { publicUrl: dataUrl, objectKey: "db-inline" };
}
