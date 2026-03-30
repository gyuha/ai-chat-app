import { X, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useConversations } from "@/hooks/use-db"
import { useUIStore } from "@/stores/ui-store"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onClose?: () => void  // Mobile: close button handler
}

export function Sidebar({ onClose }: SidebarProps) {
  const conversations = useConversations()
  const { currentConversationId, setCurrentConversation } = useUIStore()

  const handleConversationClick = (id: number) => {
    setCurrentConversation(id)
  }

  return (
    <div className="flex flex-col h-full bg-secondary">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <span className="font-semibold text-foreground">OpenRouter Chat</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* New Chat button */}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-foreground border-input"
          onClick={() => setCurrentConversation(null)}
        >
          <Plus className="h-4 w-4" />
          새 대화
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-3 pb-3">
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground px-3 py-2">
              저장된 대화가 없습니다
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv.id!)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors",
                  currentConversationId === conv.id
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-accent/5"
                )}
              >
                {conv.title}
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
