import { createRouter, RouterProvider } from '@tanstack/react-router';

import { rootRoute } from '../routes/__root';
import { chatRoute } from '../routes/chat/$chatId';
import { indexRoute } from '../routes/index';

const routeTree = rootRoute.addChildren([indexRoute, chatRoute]);

export const createAppRouter = () =>
  createRouter({
    routeTree,
  });

const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const AppRouter = () => <RouterProvider router={router} />;
