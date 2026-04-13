import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// PÁGINA DE ERRO 404 - PÁGINA NÃO ENCONTRADA
export default function NotFound() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-gray-50 px-4 py-8">
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap items-start gap-2 sm:gap-3">
            <AlertCircle className="h-8 w-8 shrink-0 text-red-500" aria-hidden />
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Página não encontrada</h1>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            O endereço não existe ou foi removido. Verifique o link ou volte à página inicial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
