import { useEffect, useRef, useCallback } from 'react';
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // MSG-07: Auto-scroll to bottom when new messages arrive
  // Only scroll if user is near bottom (~100px threshold)
  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

    // Only auto-scroll if user is within 100px of bottom
    if (distanceFromBottom < 100) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Start a conversation
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-gray-100 text-gray-900'
                : 'bg-blue-500 text-white'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{msg.content || (msg.role === 'assistant' && isStreaming ? '...' : '')}</p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
