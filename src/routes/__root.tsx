import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { getConversationTitle } from '@/components/layout/conversation-list';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
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
  const title =
    pathname === '/settings'
      ? '설정'
      : pathname === '/'
        ? '새 대화'
        : getConversationTitle(activeConversationId);

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
