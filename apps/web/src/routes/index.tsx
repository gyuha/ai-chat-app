import { createRoute, Navigate } from '@tanstack/react-router';

import { OnboardingEmptyState } from '../components/feedback/onboarding-empty-state';
import { useChatsQuery, useCreateChatFlow, useModelsQuery } from '../features/chats/hooks';
import { rootRoute } from './__root';

const HomePage = () => {
  const chatsQuery = useChatsQuery();
  const modelsQuery = useModelsQuery();
  const createChat = useCreateChatFlow();

  if (chatsQuery.data?.length) {
    return <Navigate params={{ chatId: chatsQuery.data[0].id }} replace to="/chat/$chatId" />;
  }

  return (
    <OnboardingEmptyState
      modelLabel={modelsQuery.data?.[0]?.label ?? 'Loading model...'}
      onCreateChat={() => {
        void createChat();
      }}
      onPromptSelect={(prompt) => {
        void createChat(prompt);
      }}
    />
  );
};

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
