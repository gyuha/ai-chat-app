import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

export const Route = createRootRoute({
  component: () => (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  ),
});
