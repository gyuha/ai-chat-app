import { createFileRoute } from '@tanstack/react-router';

import { ApiKeyOnboardingCard } from '@/components/chat/api-key-onboarding-card';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <ApiKeyOnboardingCard />
    </div>
  );
}
