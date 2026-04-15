import * as React from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatarFile } from "@/lib/avatar-upload";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

interface AvatarUploadFieldProps {
  displayName: string;
  avatarUrl: string;
  onAvatarUrlChange: (url: string) => void;
  disabled?: boolean;
  idPrefix?: string;
}

export function AvatarUploadField({
  displayName,
  avatarUrl,
  onAvatarUrlChange,
  disabled,
  idPrefix = "avatar",
}: AvatarUploadFieldProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const firstLetter = displayName?.charAt(0)?.toUpperCase() || "U";
  const shownSrc = preview || avatarUrl || undefined;
  const hasPhoto = Boolean(shownSrc);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    const local = URL.createObjectURL(file);
    setPreview(local);

    setUploading(true);
    try {
      const { publicUrl } = await uploadAvatarFile(file);
      if (!publicUrl) throw new Error("Upload concluído, mas sem URL pública para avatar.");
      onAvatarUrlChange(publicUrl);
      URL.revokeObjectURL(local);
      setPreview(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string }; status?: number } }).response?.data?.error
          : null;
      setError(typeof msg === "string" ? msg : err instanceof Error ? err.message : "Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        id={`${idPrefix}-file`}
        disabled={disabled || uploading}
        onChange={onFileChange}
      />
      <button
        id={`${idPrefix}-trigger`}
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={disabled || uploading}
        className={cn(
          "group flex w-full flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-5 text-center shadow-sm transition-colors",
          "hover:border-primary/45 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-70",
        )}
      >
        <Avatar className="h-32 w-32 border-2 border-primary/30 shadow">
          <AvatarImage src={shownSrc} alt="" className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{firstLetter}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading ? "Processando imagem..." : hasPhoto ? "Clique para trocar foto" : "Clique para adicionar foto"}
          </p>
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP ou GIF, até 3 MB.</p>
        </div>
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
