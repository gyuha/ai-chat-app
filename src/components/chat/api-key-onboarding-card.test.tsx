import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ApiKeyOnboardingCard } from '@/components/chat/api-key-onboarding-card';

describe('ApiKeyOnboardingCard', () => {
  it('submits the current draft key from the controlled form', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    function ControlledCard() {
      const [apiKey, setApiKey] = useState('');

      return (
        <ApiKeyOnboardingCard
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSubmit={handleSubmit}
        />
      );
    }

    render(<ControlledCard />);

    const button = screen.getByRole('button', { name: '모델 목록 확인' });

    expect(button).toBeDisabled();

    await user.type(
      screen.getByLabelText('OpenRouter API Key'),
      'sk-or-v1-test',
    );

    expect(button).toBeEnabled();

    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders loading and error feedback in the aria-live status area', () => {
    render(
      <ApiKeyOnboardingCard
        apiKey="sk-or-v1-test"
        isSubmitting
        onApiKeyChange={() => {}}
        onSubmit={(event) => event.preventDefault()}
        statusMessage="입력한 키로 모델 목록을 불러오지 못했습니다."
        statusTone="error"
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('확인 중')).toBeInTheDocument();
    expect(
      screen.getByText('입력한 키로 모델 목록을 불러오지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
