// src/components/chat/ChatInput.tsx
import { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { Message } from '../../types/chat';
import { streamChat } from '../../lib/openrouter';

export function ChatInput() {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { state, addMessage, updateMessage } = useChat();
  const { selectedConversationId, apiKey, selectedModel } = state;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter allows default (natural newline)
  };

  const handleSubmit = async () => {
    // MSG-03: Empty message rejection
    if (input.trim() === '') {
      return;
    }

    // No conversation selected
    if (!selectedConversationId) {
      return;
    }

    // If already streaming, ignore
    if (isStreaming) {
      return;
    }

    // Cancel any existing abort controller
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsStreaming(true);

    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now(),
    };

    // Clear input first
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    addMessage(selectedConversationId, userMessage);

    // Create placeholder assistant message
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };
    addMessage(selectedConversationId, assistantMessage);

    // Prepare messages for API
    const conversation = state.conversations.find(c => c.id === selectedConversationId);
    if (!conversation) {
      setIsStreaming(false);
      return;
    }

    const messagesForApi = conversation.messages.map(m => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // Stream the response
    try {
      for await (const delta of streamChat({
        apiKey: apiKey || '',
        model: selectedModel,
        messages: messagesForApi,
        signal: abortControllerRef.current.signal,
      })) {
        updateMessage(selectedConversationId, assistantMessageId, delta);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Streaming error:', err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
        className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={1}
        disabled={isStreaming}
      />
    </div>
  );
}
