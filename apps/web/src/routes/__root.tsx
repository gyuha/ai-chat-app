import { createRootRoute, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Outlet />
    </div>
  ),
});
