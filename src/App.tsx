import { RouterProvider } from '@tanstack/react-router';

import { AppQueryProvider } from './providers/app-query-provider';
import { router } from './router';

export function App() {
  return (
    <AppQueryProvider>
      <RouterProvider router={router} />
    </AppQueryProvider>
  );
}
