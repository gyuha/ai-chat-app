import { useParams } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import { useChatsQuery, useCreateChatFlow } from '../../features/chats/hooks';
import {
  Sidebar,
  SidebarContent,
  SidebarMobileSheet,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar';
import { AppSidebar } from './app-sidebar';

export const AppShell = ({ children }: PropsWithChildren) => {
  const chatsQuery = useChatsQuery();
  const createChat = useCreateChatFlow();
  const params = useParams({ strict: false });
  const { setMobileOpen } = useSidebar();

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const sidebar = (
    <AppSidebar
      activeChatId={params.chatId}
      chats={chatsQuery.data ?? []}
      isLoading={chatsQuery.isLoading}
      onCreateChat={() => {
        void createChat();
        closeMobileSidebar();
      }}
      onNavigate={closeMobileSidebar}
    />
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-50">
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>{sidebar}</SidebarContent>
        </Sidebar>

        <SidebarMobileSheet>{sidebar}</SidebarMobileSheet>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-900/80 px-4 py-3 md:hidden">
            <SidebarTrigger />
            <div className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
              Internal API only
            </div>
          </div>

          <div aria-live="polite" className="sr-only">
            Conversation shell loaded
          </div>

          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};
