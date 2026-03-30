import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/providers/theme-provider';

export const Route = createRootRoute({
  component: RootRouteComponent,
});

function RootRouteComponent() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
          <Outlet />
        </div>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
