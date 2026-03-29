import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { SidebarProvider } from '../../components/ui/sidebar';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{children}</SidebarProvider>
    </QueryClientProvider>
  );
};
