import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import { ApiKeyOnboardingCard } from '@/components/chat/api-key-onboarding-card';
import { ChatEmptyState } from '@/components/chat/chat-empty-state';
import { useApiKeyValidation } from '@/hooks/use-api-key-validation';
import {
  useSettingsActions,
  useSettingsQuery,
} from '@/hooks/use-settings-query';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  const [draftApiKey, setDraftApiKey] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    '설정 화면에서도 언제든 API 키를 변경하거나 삭제할 수 있습니다.',
  );
  const [statusTone, setStatusTone] = useState<'default' | 'error' | 'success'>(
    'default',
  );
  const settingsQuery = useSettingsQuery();
  const settingsActions = useSettingsActions();
  const validationMutation = useApiKeyValidation();
  const savedApiKey = settingsQuery.data?.openRouterApiKey ?? null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextApiKey = draftApiKey.trim();

    if (!nextApiKey) {
      setStatusTone('error');
      setStatusMessage('OpenRouter API 키를 입력한 뒤 다시 시도해 주세요.');
      return;
    }

    const result = await validationMutation.mutateAsync(nextApiKey);

    if (result.kind === 'success') {
      await settingsActions.saveApiKeyAfterValidation(nextApiKey);
      setStatusTone('success');
      setStatusMessage('모델 목록을 확인했고 API 키를 저장했습니다.');
      setDraftApiKey('');
      toast.success('API 키를 저장했습니다.');
      return;
    }

    if (result.kind === 'invalid_credentials') {
      setStatusTone('error');
      setStatusMessage(
        '입력한 키로 모델 목록을 불러오지 못했습니다. 키를 확인한 뒤 다시 시도해 주세요.',
      );
      toast.error('입력한 키를 다시 확인해 주세요.');
      return;
    }

    setStatusTone('error');
    setStatusMessage(
      '일시적인 문제로 모델 목록을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.',
    );
    toast.error('일시적인 문제로 모델 목록을 확인하지 못했습니다.');
  }

  if (savedApiKey) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <ChatEmptyState />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <ApiKeyOnboardingCard
        apiKey={draftApiKey}
        isSubmitting={validationMutation.isPending}
        onApiKeyChange={setDraftApiKey}
        onSubmit={handleSubmit}
        statusMessage={statusMessage}
        statusTone={statusTone}
      />
    </div>
  );
}
