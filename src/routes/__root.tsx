import { createRootRoute, Outlet } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <SidebarLayout>
      <Outlet />
      <Toaster />
    </SidebarLayout>
  ),
});
