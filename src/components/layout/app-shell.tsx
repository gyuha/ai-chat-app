import type { PropsWithChildren } from 'react';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { useUiStore } from '@/stores/ui-store';

type AppShellProps = PropsWithChildren<{
  activeConversationId: string | null;
  currentPath: string;
  title: string;
}>;

export function AppShell({
  activeConversationId,
  children,
  currentPath,
  title,
}: AppShellProps) {
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const openMobileSidebar = useUiStore((state) => state.openMobileSidebar);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const setMobileSidebarOpen = useUiStore(
    (state) => state.setMobileSidebarOpen,
  );

  return (
    <div className="flex min-h-svh bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppSidebar
        activeConversationId={activeConversationId}
        currentPath={currentPath}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <AppHeader
          onOpenSidebar={openMobileSidebar}
          onStartNewChat={closeMobileSidebar}
          title={title}
        />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
