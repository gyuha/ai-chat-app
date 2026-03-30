import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { appDb, SETTINGS_KEYS, setSetting } from '@/lib/app-db';
import {
  createConversationFixture,
  createOpenRouterModelsResponse,
  mockFetchResponses,
  renderAppRoute,
  resetFetchMock,
  resetUiStore,
  seedConversations,
  setViewport,
} from '@/test/test-utils';

const FREE_MODELS = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    pricing: {
      completion: '0',
      prompt: '0',
    },
  },
  {
    id: 'openrouter/free',
    name: 'OpenRouter Free',
    pricing: {
      completion: '0',
      prompt: '0',
    },
  },
];

describe('chat conversation route', () => {
  beforeEach(() => {
    resetUiStore();
    resetFetchMock();
    setViewport(1280);
  });

  it('shows the draft guidance and keeps the composer disabled without a model', async () => {
    const draftConversation = createConversationFixture({
      id: 'draft-chat',
      modelId: null,
      title: '새 대화',
    });

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');
    await seedConversations([draftConversation]);
    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    await renderAppRoute('/chat/draft-chat');

    expect(await screen.findByText('모델 선택 필요')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '모델 선택' }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        '상단에서 모델을 선택하면 입력할 수 있습니다.',
      ),
    ).toBeDisabled();
  });

  it('shows the active model and persists header selector changes', async () => {
    const user = userEvent.setup();
    const conversation = createConversationFixture({
      id: 'active-chat',
      modelId: 'meta-llama/llama-3.3-70b-instruct:free',
      title: '모델 비교',
    });

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');
    await seedConversations([conversation]);
    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    await renderAppRoute('/chat/active-chat');

    expect(await screen.findByText('활성 모델')).toBeInTheDocument();
    expect(
      (
        await screen.findAllByText(
          (_, element) =>
            element?.textContent?.includes('Llama 3.3 70B') ?? false,
        )
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByPlaceholderText(
        'OpenRouter 무료 모델에게 무엇을 물어볼까요?',
      ),
    ).toBeEnabled();

    await user.click(screen.getByLabelText('현재 대화 모델 선택'));
    await user.click(await screen.findByText('OpenRouter Free'));

    await waitFor(async () => {
      expect((await appDb.conversations.get('active-chat'))?.modelId).toBe(
        'openrouter/free',
      );
    });
  });
});
