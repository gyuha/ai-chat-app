// src/components/chat/ChatInput.tsx
import { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useToast } from '../../components/Toast';
import { Message } from '../../types/chat';
import { streamChat } from '../../lib/openrouter';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { state, addMessage, updateMessage, startStreaming, finishStreaming, cancelStreaming, showApiKeyModal } = useChat();
  const { selectedConversationId, apiKey, selectedModel, isStreaming } = state;
  const { toast } = useToast();

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

  const cancelStream = () => {
    // MSG-05: Cancel button calls abort() on AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    cancelStreaming();
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

    // Check if API key is set
    if (!apiKey) {
      toast({ message: 'API 키를 설정해주세요.', type: 'error' });
      showApiKeyModal(true);
      return;
    }

    // Cancel any existing abort controller
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    startStreaming();

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

    // Prepare messages for API - include both existing messages and the new user message
    const conversation = state.conversations.find(c => c.id === selectedConversationId);
    const existingMessages = conversation?.messages || [];

    const messagesForApi = [
      ...existingMessages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
      { role: 'user' as const, content: input.trim() },
    ];

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
        toast({ message: `오류: ${err.message}`, type: 'error' });
      }
    } finally {
      finishStreaming();
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="w-full flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={isStreaming ? 'Waiting for response...' : 'Type a message... (Enter to send, Shift+Enter for new line)'}
        className={`flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-1 ${
          isStreaming
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        }`}
        rows={1}
        disabled={isStreaming}
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={cancelStream}
          className="shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={input.trim() === ''}
          className="shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Send
        </button>
      )}
    </div>
  );
}
