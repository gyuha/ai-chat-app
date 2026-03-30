import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { appDb, getSetting, SETTINGS_KEYS, setSetting } from '@/lib/app-db';
import {
  createOpenRouterModelsResponse,
  mockFetchResponses,
  renderAppRoute,
  resetFetchMock,
  resetUiStore,
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
];

describe('index route', () => {
  beforeEach(() => {
    resetUiStore();
    resetFetchMock();
    setViewport(1280);
  });

  it('stores a validated key and switches to the empty state on the same route', async () => {
    const user = userEvent.setup();
    const apiKey = 'sk-or-v1-success';

    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    await renderAppRoute('/');

    await user.type(screen.getByLabelText('OpenRouter API Key'), apiKey);
    await user.click(screen.getByRole('button', { name: '모델 목록 확인' }));

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: '첫 대화를 시작해 보세요',
      }),
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect((await getSetting(SETTINGS_KEYS.openRouterApiKey))?.value).toBe(
        apiKey,
      );
    });
  });

  it('keeps the onboarding draft on invalid credentials failures', async () => {
    const user = userEvent.setup();
    const apiKey = 'sk-or-v1-invalid';

    mockFetchResponses(createOpenRouterModelsResponse([], 401));

    await renderAppRoute('/');

    await user.type(screen.getByLabelText('OpenRouter API Key'), apiKey);
    await user.click(screen.getByRole('button', { name: '모델 목록 확인' }));

    expect(
      await screen.findByText(
        '입력한 키로 모델 목록을 불러오지 못했습니다. 키를 확인한 뒤 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(apiKey)).toBeInTheDocument();
    expect(await getSetting(SETTINGS_KEYS.openRouterApiKey)).toBeUndefined();
  });

  it('keeps the onboarding draft on transient failures', async () => {
    const user = userEvent.setup();
    const apiKey = 'sk-or-v1-transient';

    mockFetchResponses(new Error('network down'));

    await renderAppRoute('/');

    await user.type(screen.getByLabelText('OpenRouter API Key'), apiKey);
    await user.click(screen.getByRole('button', { name: '모델 목록 확인' }));

    expect(
      await screen.findByText(
        '일시적인 문제로 모델 목록을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(apiKey)).toBeInTheDocument();
    expect(await getSetting(SETTINGS_KEYS.openRouterApiKey)).toBeUndefined();
  });

  it('starts a draft conversation from the home empty state when an API key is saved', async () => {
    const user = userEvent.setup();

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');
    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    const { router } = await renderAppRoute('/');
    const startConversationButton = screen
      .getAllByRole('button', { name: '새 대화 시작' })
      .at(-1);

    if (!startConversationButton) {
      throw new Error('새 대화 시작 버튼을 찾지 못했습니다.');
    }

    await user.click(startConversationButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toMatch(/^\/chat\//);
    });

    expect(screen.getByText('모델 선택 필요')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        '상단에서 모델을 선택하면 입력할 수 있습니다.',
      ),
    ).toBeDisabled();

    await waitFor(async () => {
      expect(await appDb.conversations.count()).toBe(1);
    });
  });

  it('reuses the same draft conversation when a model is not selected yet', async () => {
    const user = userEvent.setup();

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');
    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    const { router } = await renderAppRoute('/');
    const startConversationButton = screen
      .getAllByRole('button', { name: '새 대화 시작' })
      .at(-1);

    if (!startConversationButton) {
      throw new Error('새 대화 시작 버튼을 찾지 못했습니다.');
    }

    await user.click(startConversationButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toMatch(/^\/chat\//);
    });

    const firstPath = router.state.location.pathname;

    await user.click(
      screen.getAllByRole('button', { name: '새 대화 시작' })[0],
    );

    await waitFor(async () => {
      expect(await appDb.conversations.count()).toBe(1);
    });

    expect(router.state.location.pathname).toBe(firstPath);
  });
});
