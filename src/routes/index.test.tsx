import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { getSetting, SETTINGS_KEYS } from '@/lib/app-db';
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
});
