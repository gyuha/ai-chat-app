import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/db";
import {
  useSetting,
  SETTINGS_KEYS,
} from "@/hooks/use-settings";
import { useMessages, useAddMessage } from "@/hooks/use-messages";
import { useChatStream } from "@/hooks/use-chat-stream";
import { handleApiError } from "@/lib/error-handler";
import { EmptyApiKeyListener } from "@/components/settings/EmptyApiKeyListener";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/button";

interface ChatPageProps {
  conversationId: string;
}

export function ChatPage({ conversationId }: ChatPageProps) {
  const { data: apiKey } = useSetting(SETTINGS_KEYS.API_KEY);
  const { data: defaultModelId } = useSetting(SETTINGS_KEYS.DEFAULT_MODEL_ID);
  const { data: globalSystemPrompt } = useSetting(SETTINGS_KEYS.SYSTEM_PROMPT);
  const { data: messages } = useMessages(conversationId);
  const addMessage = useAddMessage();

  // Fetch conversation details
  const { data: conversation } = useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => db.conversations.get(conversationId),
    enabled: !!conversationId,
  });

  const [modelId, setModelId] = useState<string>(
    conversation?.modelId ?? defaultModelId ?? "",
  );

  // Sync modelId when conversation or defaultModelId loads
  useEffect(() => {
    if (conversation?.modelId) {
      setModelId(conversation.modelId);
    } else if (defaultModelId) {
      setModelId(defaultModelId);
    }
  }, [conversation?.modelId, defaultModelId]);

  const systemPrompt =
    conversation?.systemPrompt ?? globalSystemPrompt ?? null;

  const {
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
  } = useChatStream(modelId, systemPrompt);

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Save user message to IndexedDB
      const userMessage = {
        id: crypto.randomUUID(),
        conversationId,
        role: "user" as const,
        content,
      };
      addMessage.mutate(userMessage);

      // Build messages array including the new user message
      const allMessages = [
        ...(messages ?? []),
        { ...userMessage, createdAt: new Date() },
      ];

      try {
        const fullContent = await sendMessage(
          allMessages.map((m) => ({ role: m.role, content: m.content })),
        );

        if (fullContent) {
          addMessage.mutate({
            id: crypto.randomUUID(),
            conversationId,
            role: "assistant",
            content: fullContent,
          });
        }
      } catch (err) {
        handleApiError(err);
      }
    },
    [conversationId, messages, addMessage, sendMessage],
  );

  const handleStop = useCallback(() => {
    stopStreaming();
  }, [stopStreaming]);

  const handleRetry = useCallback(() => {
    if (!messages || messages.length === 0) return;

    // Find last user message
    const lastUserMessageIndex = [...messages]
      .map((m, i) => ({ m, i }))
      .reverse()
      .find(({ m }) => m.role === "user");

    if (!lastUserMessageIndex) return;

    // Build messages up to and including the last user message
    const messagesToRetry = messages
      .slice(0, lastUserMessageIndex.i + 1)
      .map((m) => ({ role: m.role, content: m.content }));

    sendMessage(messagesToRetry).then((fullContent) => {
      if (fullContent) {
        addMessage.mutate({
          id: crypto.randomUUID(),
          conversationId,
          role: "assistant",
          content: fullContent,
        });
      }
    }).catch((err) => {
      handleApiError(err);
    });
  }, [messages, conversationId, sendMessage, addMessage]);

  // API key not set
  if (!apiKey) {
    return (
      <div className="flex flex-1 flex-col">
        <EmptyApiKeyListener />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        conversationTitle={conversation?.title ?? "새 대화"}
        modelId={modelId}
        onModelChange={setModelId}
      />
      <MessageList
        messages={messages ?? []}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
      />
      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2">
          <span className="text-sm text-destructive">{error.message}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            재시도
          </Button>
        </div>
      )}
      <MessageInput
        onSend={handleSend}
        disabled={!apiKey}
        isStreaming={isStreaming}
        onStop={handleStop}
      />
    </div>
  );
}
