import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chat-store"

export function StopButton() {
  const isStreaming = useChatStore((s) => s.isStreaming)
  const abortController = useChatStore((s) => s.abortController)
  const setAbortController = useChatStore((s) => s.setAbortController)
  const setStreaming = useChatStore((s) => s.setStreaming)

  const handleStop = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setStreaming(false)
    }
  }

  if (!isStreaming) return null

  return (
    <Button
      variant="outline"
      onClick={handleStop}
      size="icon"
      className="h-[40px] w-[40px] shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    </Button>
  )
}
