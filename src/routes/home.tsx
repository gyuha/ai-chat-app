import { useRef, useEffect, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ApiKeySetup } from "@/components/api-key-setup"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { StopButton } from "@/components/stop-button"
import { LoadingIndicator } from "@/components/loading-indicator"
import { ChatLayout } from "@/components/chat-layout"
import { useSettings } from "@/hooks/use-settings"
import { useChat } from "@/hooks/use-chat"
import { useUIStore } from "@/stores/ui-store"
import {
  useConversation,
  useMessages,
  createConversation,
  addMessage,
} from "@/hooks/use-db"

export function HomePage() {
  const { apiKey, defaultModel, isLoading: settingsLoading } = useSettings()
  const { messages, sendMessage, isStreaming } = useChat()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Phase 2: Conversation state
  const { currentConversationId, setCurrentConversation } = useUIStore()
  const currentConversation = useConversation(currentConversationId)
  const persistedMessages = useMessages(currentConversationId)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, persistedMessages])

  // Phase 2: Handle sending message with persistence
  const handleSend = useCallback(
    async (content: string) => {
      if (!currentConversationId) {
        // Create new conversation if none selected
        const newId = await createConversation()
        setCurrentConversation(newId)
        // Add message after setting conversation
        await addMessage(newId, "user", content)
      } else {
        await addMessage(currentConversationId, "user", content)
      }
      // Send to API (useChat handles streaming)
      await sendMessage(content)
    },
    [currentConversationId, setCurrentConversation, sendMessage]
  )

  // Phase 2: Persist assistant response to DB
  useEffect(() => {
    if (!currentConversationId) return
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === "assistant" && !isStreaming) {
      // Check if already persisted (avoid duplicate)
      const lastPersisted = persistedMessages[persistedMessages.length - 1]
      if (!lastPersisted || lastPersisted.content !== lastMessage.content) {
        addMessage(currentConversationId, "assistant", lastMessage.content)
      }
    }
  }, [messages, isStreaming, currentConversationId, persistedMessages])

  if (settingsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  if (!apiKey) {
    return <ApiKeySetup />
  }

  // Wrap with ChatLayout for sidebar
  return (
    <ChatLayout
      header={
        <span className="font-medium text-foreground">
          {currentConversation?.title || "새 대화"}
        </span>
      }
    >
      <div className="flex h-full flex-col">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  {defaultModel
                    ? "메시지를 입력하여 대화를 시작하세요."
                    : "먼저 모델을 선택해 주세요."}
                </p>
                {!defaultModel && (
                  <Button
                    variant="link"
                    onClick={() => navigate({ to: "/settings" })}
                  >
                    설정에서 모델 선택하기
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4 p-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isStreaming && msg === messages[messages.length - 1]}
                />
              ))}
              {isStreaming &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <LoadingIndicator />
                )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-background">
          <div className="mx-auto max-w-3xl p-4">
            <div className="flex items-end gap-2">
              <StopButton />
              <ChatInput
                onSend={handleSend}
                disabled={isStreaming || !defaultModel}
              />
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
