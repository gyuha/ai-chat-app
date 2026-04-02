// src/components/chat/ChatInput.tsx
import { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { Message } from '../../types/chat';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, addMessage } = useChat();
  const { selectedConversationId } = state;

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

  const handleSubmit = () => {
    // MSG-03: Empty message rejection
    if (input.trim() === '') {
      return;
    }

    // No conversation selected
    if (!selectedConversationId) {
      return;
    }

    // Create user message
    const message: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now(),
    };

    addMessage(selectedConversationId, message);

    // Clear input
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
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
      />
    </div>
  );
}
