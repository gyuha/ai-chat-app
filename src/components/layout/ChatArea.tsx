// src/components/layout/ChatArea.tsx
import { useChat } from '../../context/ChatContext';
import { Header } from './Header';
import { ChatInput } from '../chat/ChatInput';

export function ChatArea() {
  const { state } = useChat();
  const { conversations, selectedConversationId } = state;
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
          {/* Messages rendered here - Phase 2 */}
          <div className="space-y-4">
            {selectedConversation.messages.length === 0 ? (
              <p className="text-gray-500 text-center">Start a conversation</p>
            ) : (
              selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.role === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pt-4 pb-4">
            <ChatInput />
          </div>
        </div>
      </main>
    </div>
  );
}
