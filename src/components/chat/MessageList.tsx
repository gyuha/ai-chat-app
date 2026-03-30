import { useCallback, useEffect, useRef } from "react";
import type { Message } from "@/db";
import { MessageItem } from "./MessageItem";
import { StreamingIndicator } from "./StreamingIndicator";

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
}

function useAutoScroll(isStreaming: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    shouldAutoScrollRef.current =
      scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  useEffect(() => {
    if (isStreaming && shouldAutoScrollRef.current) {
      const container = containerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  });

  return { containerRef, handleScroll };
}

export function MessageList({
  messages,
  streamingContent,
  isStreaming,
}: MessageListProps) {
  const { containerRef, handleScroll } = useAutoScroll(isStreaming);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground">대화를 시작해보세요.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-slot="message-list-scroll"
      className="flex-1 overflow-y-auto p-4"
      onScroll={handleScroll}
    >
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
      {isStreaming && streamingContent && (
        <MessageItem
          message={{
            id: "streaming",
            role: "assistant",
            content: streamingContent,
          }}
          isStreaming
        />
      )}
      {isStreaming && !streamingContent && <StreamingIndicator />}
    </div>
  );
}
