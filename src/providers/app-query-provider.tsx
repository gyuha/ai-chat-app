import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
};

export const appQueryClient = new QueryClient(queryClientConfig);

export function resetAppQueryClient() {
  appQueryClient.clear();
}

type AppQueryProviderProps = {
  children: React.ReactNode;
};

export function AppQueryProvider({ children }: AppQueryProviderProps) {
  return (
    <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>
  );
}
