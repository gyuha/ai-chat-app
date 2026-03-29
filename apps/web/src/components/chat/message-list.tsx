import type { ChatMessage } from '@repo/contracts';

import { MessageBubble } from './message-bubble';

interface MessageListProps {
  isStreaming?: boolean;
  messages: ChatMessage[];
  onRegenerate?: () => void;
  regenerateMessageId?: string;
}

export const MessageList = ({
  isStreaming = false,
  messages,
  onRegenerate,
  regenerateMessageId,
}: MessageListProps) => {
  return (
    <div className="space-y-5">
      {messages.map((message) => (
        <MessageBubble
          canRegenerate={!isStreaming && message.id === regenerateMessageId}
          key={message.id}
          message={message}
          onRegenerate={onRegenerate}
        />
      ))}
    </div>
  );
};
