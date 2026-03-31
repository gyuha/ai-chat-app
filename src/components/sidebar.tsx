import { useState, useRef, useEffect } from "react"
import { X, Plus, MessageSquare, Trash2, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConversations, createConversation, updateConversationTitle, deleteConversation } from "@/hooks/use-db"
import { useUIStore } from "@/stores/ui-store"
import { useThemeStore } from "@/stores/theme-store"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onClose?: () => void  // Mobile: close button handler
}

interface ConversationItemProps {
  conv: { id?: number; title: string }
  isActive: boolean
  onSelect: () => void
}

function ConversationItem({ conv, isActive, onSelect }: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conv.title)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { currentConversationId, setCurrentConversation } = useUIStore()

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== conv.title) {
      await updateConversationTitle(conv.id!, trimmed)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") {
      setEditValue(conv.title)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    await deleteConversation(conv.id!)
    if (currentConversationId === conv.id) {
      setCurrentConversation(null)
    }
    setDeleteOpen(false)
  }

  return (
    <div className="group relative flex items-center gap-1">
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-background px-3 py-1.5 text-sm rounded border border-ring min-w-0"
          maxLength={40}
        />
      ) : (
        <button
          onClick={onSelect}
          onDoubleClick={() => setIsEditing(true)}
          className={cn(
            "flex-1 truncate px-3 py-2 rounded-md text-sm text-left transition-colors min-w-0",
            isActive
              ? "bg-accent/10 text-accent"
              : "hover:bg-accent/5 text-foreground"
          )}
        >
          {conv.title}
        </button>
      )}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>대화 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function Sidebar({ onClose }: SidebarProps) {
  // Apply theme to document
  useTheme()

  const conversations = useConversations()
  const { currentConversationId, setCurrentConversation } = useUIStore()

  const handleNewChat = async () => {
    const newId = await createConversation()
    setCurrentConversation(newId)
  }

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
        <div className="flex items-center gap-1">
          {!onClose && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="테마 전환">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => useThemeStore.getState().setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  라이트 모드
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => useThemeStore.getState().setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  다크 모드
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => useThemeStore.getState().setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  시스템 설정
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
      </div>

      {/* New Chat button */}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-foreground border-input"
          onClick={handleNewChat}
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
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={currentConversationId === conv.id}
                onSelect={() => handleConversationClick(conv.id!)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
