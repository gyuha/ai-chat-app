import type { ChatSummary } from '@repo/contracts';
import { Link } from '@tanstack/react-router';

import { Button } from '../ui/button';

interface AppSidebarProps {
  activeChatId?: string;
  chats: ChatSummary[];
  isLoading: boolean;
  onCreateChat: () => void;
  onNavigate?: () => void;
}

export const AppSidebar = ({
  activeChatId,
  chats,
  isLoading,
  onCreateChat,
  onNavigate,
}: AppSidebarProps) => {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Workspace</p>
          <h1 className="mt-2 text-lg font-semibold text-slate-50">OpenRouter Free Chat</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Modern conversational shell with a server-only model boundary.
          </p>
        </div>

        <Button className="w-full justify-start" onClick={onCreateChat} type="button">
          New chat
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-[24px] border border-slate-900 bg-slate-950/60 p-2">
        <div className="px-3 py-2">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Recent chats</p>
        </div>

        <div className="space-y-1">
          {isLoading ? (
            <div className="space-y-2 p-3">
              <div className="h-12 rounded-2xl bg-slate-900/80" />
              <div className="h-12 rounded-2xl bg-slate-900/60" />
            </div>
          ) : chats.length ? (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;

              return (
                <Link
                  className={`block rounded-2xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'bg-emerald-500/12 text-slate-50 ring-1 ring-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-slate-50'
                  }`}
                  key={chat.id}
                  onClick={onNavigate}
                  params={{ chatId: chat.id }}
                  to="/chat/$chatId"
                >
                  <p className="truncate text-sm font-medium">{chat.title}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{chat.settings.modelId}</p>
                </Link>
              );
            })
          ) : (
            <div className="px-3 py-8 text-sm leading-6 text-slate-500">
              No chats yet. Start one and it will appear here instantly.
            </div>
          )}
        </div>
      </div>

      <button
        className="rounded-2xl border border-slate-900 bg-slate-950/60 px-4 py-3 text-left text-sm text-slate-400 transition hover:border-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        type="button"
      >
        Settings arrive in Phase 4
      </button>
    </div>
  );
};
