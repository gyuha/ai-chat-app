import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiKeyOnboardingCard } from '@/components/chat/api-key-onboarding-card';
import { ChatEmptyState } from '@/components/chat/chat-empty-state';
import { SettingsPanelPlaceholder } from '@/components/settings/settings-panel-placeholder';
import { AppQueryProvider } from '@/providers/app-query-provider';
import { useUiStore } from '@/stores/ui-store';
import { resetUiStore } from '@/test/test-utils';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & {
      children: ReactNode;
      to?: string;
    }) => (
      <a href={typeof to === 'string' ? to : '#'} {...props}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

describe('Phase 1 Korean state surfaces', () => {
  beforeEach(() => {
    resetUiStore();
  });

  it('renders the API key onboarding card with Korean guidance and inline error slot', () => {
    render(
      <ApiKeyOnboardingCard
        apiKey=""
        onApiKeyChange={() => {}}
        onSubmit={(event) => event.preventDefault()}
        statusMessage="입력한 키로 모델 목록을 불러오지 못했습니다."
        statusTone="error"
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'OpenRouter API 키를 입력해 주세요',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('OpenRouter API Key')).toBeInTheDocument();
    expect(screen.getByText('모델 목록 확인')).toBeInTheDocument();
    expect(
      screen.getByText('입력한 키로 모델 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });

  it('renders Korean empty state and settings placeholder content', async () => {
    const user = userEvent.setup();

    render(
      <AppQueryProvider>
        <ChatEmptyState />
        <SettingsPanelPlaceholder />
      </AppQueryProvider>,
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '첫 대화를 시작해 보세요',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('새 대화 시작')).toBeInTheDocument();
    expect(screen.getByText('설정 보기')).toBeInTheDocument();
    expect(screen.getByText('API 키 관리')).toBeInTheDocument();
    expect(screen.getByText('기본 모델')).toBeInTheDocument();
    expect(screen.getByText('시스템 프롬프트')).toBeInTheDocument();
    expect(screen.getByText('테마')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /라이트/ }));

    expect(useUiStore.getState().themePreference).toBe('light');
  });
});
