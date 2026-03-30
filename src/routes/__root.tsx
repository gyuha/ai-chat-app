import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useConversationQuery } from '@/hooks/use-conversations-query';
import { getConversationDisplayTitle } from '@/lib/conversation-service';
import { ThemeProvider } from '@/providers/theme-provider';
import { selectResolvedTheme, useUiStore } from '@/stores/ui-store';

export const Route = createRootRoute({
  component: RootRouteComponent,
});

function RootRouteComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const resolvedTheme = useUiStore(selectResolvedTheme);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const activeConversationId = pathname.startsWith('/chat/')
    ? decodeURIComponent(pathname.replace('/chat/', ''))
    : null;
  const activeConversationQuery = useConversationQuery(activeConversationId);
  const title =
    pathname === '/settings'
      ? '설정'
      : pathname === '/'
        ? '새 대화'
        : getConversationDisplayTitle(activeConversationQuery.data);

  useEffect(() => {
    if (pathname) {
      closeMobileSidebar();
    }
  }, [closeMobileSidebar, pathname]);

  return (
    <ThemeProvider>
      <TooltipProvider>
        <AppShell
          activeConversationId={activeConversationId}
          currentPath={pathname}
          title={title}
        >
          <Outlet />
        </AppShell>
        <Toaster position="top-center" richColors theme={resolvedTheme} />
      </TooltipProvider>
    </ThemeProvider>
  );
}
