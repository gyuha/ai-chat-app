import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen bg-background text-foreground">
      <Outlet />
    </div>
  ),
});
