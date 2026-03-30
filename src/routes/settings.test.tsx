import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsActions } from '@/hooks/use-settings-query';
import { getSettingsSnapshot, SETTINGS_KEYS, setSetting } from '@/lib/app-db';
import { AppQueryProvider } from '@/providers/app-query-provider';
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
  {
    id: 'openrouter/free',
    name: 'OpenRouter Free',
    pricing: {
      completion: '0',
      prompt: '0',
    },
  },
];

describe('settings route', () => {
  beforeEach(() => {
    resetUiStore();
    resetFetchMock();
    setViewport(1280);
  });

  it('replaces a saved key only after successful validation', async () => {
    const user = userEvent.setup();

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');

    mockFetchResponses(
      createOpenRouterModelsResponse(FREE_MODELS),
      createOpenRouterModelsResponse(FREE_MODELS),
      createOpenRouterModelsResponse(FREE_MODELS),
    );

    await renderAppRoute('/settings');

    await screen.findByText('현재 저장된 API 키가 있습니다.');
    await user.type(
      screen.getByLabelText('OpenRouter API Key'),
      'sk-or-v1-replaced',
    );
    await user.click(screen.getByRole('button', { name: '키 확인하기' }));

    await waitFor(async () => {
      expect((await getSettingsSnapshot()).openRouterApiKey).toBe(
        'sk-or-v1-replaced',
      );
    });
  });

  it('keeps the saved key and draft value on invalid replacement attempts', async () => {
    const user = userEvent.setup();

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');

    mockFetchResponses(
      createOpenRouterModelsResponse(FREE_MODELS),
      createOpenRouterModelsResponse([], 401),
    );

    await renderAppRoute('/settings');

    await screen.findByText('현재 저장된 API 키가 있습니다.');
    await user.type(
      screen.getByLabelText('OpenRouter API Key'),
      'sk-or-v1-invalid',
    );
    await user.click(screen.getByRole('button', { name: '키 확인하기' }));

    expect(
      await screen.findByText(
        '입력한 키로 모델 목록을 불러오지 못했습니다. 키를 확인한 뒤 다시 시도해 주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('sk-or-v1-invalid')).toBeInTheDocument();
    expect((await getSettingsSnapshot()).openRouterApiKey).toBe('saved-key');
  });

  it('deletes the saved key after confirmation without leaving the settings route', async () => {
    const user = userEvent.setup();

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');

    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    await renderAppRoute('/settings');

    await screen.findByText('현재 저장된 API 키가 있습니다.');
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(await screen.findByText('API 키 삭제')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(async () => {
      expect((await getSettingsSnapshot()).openRouterApiKey).toBeNull();
    });

    expect(screen.getByText('API 키 관리')).toBeInTheDocument();
    expect((await screen.findAllByText('API 키를 삭제했습니다.')).length).toBe(
      2,
    );
  });

  it('clears invalid default models and persists the system prompt', async () => {
    const defaultSystemPrompt = '모든 답변은 한국어로 작성해 주세요.';

    await setSetting(SETTINGS_KEYS.openRouterApiKey, 'saved-key');
    await setSetting(SETTINGS_KEYS.defaultModelId, 'missing-model');

    mockFetchResponses(createOpenRouterModelsResponse(FREE_MODELS));

    await renderAppRoute('/settings');

    expect(
      await screen.findByText('기본값은 아직 선택되지 않았습니다.'),
    ).toBeInTheDocument();

    await waitFor(async () => {
      expect((await getSettingsSnapshot()).defaultModelId).toBeNull();
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        '예: 모든 답변은 한국어로 간결하게 작성해 주세요.',
      ),
      {
        target: {
          value: defaultSystemPrompt,
        },
      },
    );

    await waitFor(async () => {
      expect((await getSettingsSnapshot()).defaultSystemPrompt).toBe(
        defaultSystemPrompt,
      );
    });
  });

  it('persists a selected default model through the settings action path', async () => {
    const user = userEvent.setup();

    function SettingsActionHarness() {
      const settingsActions = useSettingsActions();

      return (
        <button
          onClick={() =>
            void settingsActions.setDefaultModelId(
              'meta-llama/llama-3.3-70b-instruct:free',
            )
          }
          type="button"
        >
          기본 모델 저장
        </button>
      );
    }

    render(
      <AppQueryProvider>
        <SettingsActionHarness />
      </AppQueryProvider>,
    );

    await user.click(screen.getByRole('button', { name: '기본 모델 저장' }));

    await waitFor(async () => {
      expect((await getSettingsSnapshot()).defaultModelId).toBe(
        'meta-llama/llama-3.3-70b-instruct:free',
      );
    });
  });
});
