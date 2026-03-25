import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import { SessionLoader } from "@/components/auth/session-loader";
import { useSessionBootstrap } from "@/features/auth/session";

type RouterContext = {
  queryClient: QueryClient;
};

function RootLayout() {
  const sessionQuery = useSessionBootstrap();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname === "/" && sessionQuery.isPending) {
    return <SessionLoader />;
  }

  return (
    <main className="app-shell">
      <Outlet />
    </main>
  );
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
