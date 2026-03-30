import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"

// Toast item type
export interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Toast component
function Toast({ id, title, description, variant = "default", onClose }: ToastItem & { onClose: (id: string) => void }) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default" && "border bg-background text-foreground",
        variant === "destructive" && "destructive group border-destructive bg-destructive text-destructive-foreground"
      )}
    >
      <div className="flex flex-col space-y-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none group-hover:opacity-100",
          variant === "destructive" && "text-red-300 hover:text-red-50"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss?: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onDismiss || (() => {})} />
      ))}
    </div>
  )
}

// Toast hook - simple state-based implementation
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((props: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...props, id }])
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toast, toasts, dismiss }
}

export { ToastContainer }
