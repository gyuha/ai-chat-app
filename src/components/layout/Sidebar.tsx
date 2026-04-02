// src/components/layout/Sidebar.tsx
import { useChat } from '../../context/ChatContext';

export function Sidebar() {
  const { state, createChat, selectChat, deleteChat } = useChat();
  const { conversations, selectedConversationId } = state;

  return (
    <div className="w-[260px] h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* New chat button - top (D-06) */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={createChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
        >
          <span className="text-lg">+</span>
          <span>New chat</span>
        </button>
      </div>

      {/* Chat list (D-05: title only) */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No conversations yet</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              className={`group relative px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedConversationId === conv.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => selectChat(conv.id)}
            >
              <span className="truncate text-sm block pr-8">{conv.name}</span>
              {/* Delete icon - visible on hover (D-07) */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  deleteChat(conv.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete conversation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
