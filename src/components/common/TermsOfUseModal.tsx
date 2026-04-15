import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, AlertTriangle } from "lucide-react";

interface TermsOfUseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal informativo de termos (conteúdo placeholder).
 * Acionado a partir do rodapé da sidebar, no padrão visual inspirado no projeto de referência.
 */
export function TermsOfUseModal({ open, onOpenChange }: TermsOfUseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(92vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="relative shrink-0 bg-gradient-to-br from-primary via-primary to-indigo-900 px-4 py-4 sm:px-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/2 rounded-full bg-white" />
          </div>
          <DialogHeader className="relative z-10 space-y-1 text-left">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-white/20 bg-white/15 p-2.5 shadow-lg backdrop-blur-sm">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-bold tracking-tight text-primary-foreground sm:text-lg">
                  Termos de Uso e Privacidade
                </DialogTitle>
                <DialogDescription className="text-xs text-primary-foreground/90 sm:text-sm">
                  MedLearn — texto provisório para revisão jurídica
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[min(60vh,420px)] border-t border-border">
          <div className="space-y-4 px-4 py-4 text-sm sm:px-6">
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                Introdução
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Este é um texto placeholder. Ao publicar o sistema, substitua por termos reais, política de
                privacidade e base legal (por exemplo LGPD), alinhados à realidade do produto e do controlador
                de dados.
              </p>
            </section>

            <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Uso aceitável
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Descreva aqui condutas permitidas e proibidas, responsabilidades do usuário, propriedade de
                conteúdos educacionais e limitações de garantia.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-muted/40 p-4">
              <h3 className="mb-2 font-semibold text-foreground">Dados pessoais</h3>
              <p className="leading-relaxed text-muted-foreground">
                Explique quais dados são coletados, finalidades, tempo de retenção, compartilhamento e canais
                para exercer direitos do titular.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-border px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
          Conteúdo meramente ilustrativo — não constitui aconselhamento jurídico.
        </div>
      </DialogContent>
    </Dialog>
  );
}
