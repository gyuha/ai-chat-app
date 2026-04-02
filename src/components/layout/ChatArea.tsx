// src/components/layout/ChatArea.tsx
import { useChat } from '../../context/ChatContext';
import { Header } from './Header';
import { ChatInput } from '../chat/ChatInput';
import { MessageList } from '../chat/MessageList';

export function ChatArea() {
  const { state } = useChat();
  const { conversations, selectedConversationId, isStreaming } = state;
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <Header />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="max-w-[768px] w-full px-4 py-6 text-center text-gray-500">
            <p>Select a conversation or start a new one</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[768px] mx-auto px-4 py-6">
          <MessageList
            messages={selectedConversation.messages}
            isStreaming={isStreaming}
          />
          <div className="pt-4 pb-4">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
