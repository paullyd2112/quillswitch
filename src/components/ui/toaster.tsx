
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {Array.isArray(toasts) && toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && (
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className="mt-2"
              >
                {action.label}
              </Button>
            )}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
