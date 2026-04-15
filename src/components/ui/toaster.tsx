import { AlertCircle, CheckCircle2, Info, MinusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const icon =
          variant === "success" ? (
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-current opacity-95"
              aria-hidden
            />
          ) : variant === "warning" ? (
            <MinusCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-current opacity-95"
              aria-hidden
            />
          ) : variant === "destructive" ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 opacity-95" aria-hidden />
          ) : (
            <Info
              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )

        return (
          <Toast key={id} variant={variant} className="items-start" {...props}>
            <div className="flex min-w-0 flex-1 gap-3">
              {icon}
              <div className="grid min-w-0 flex-1 gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
