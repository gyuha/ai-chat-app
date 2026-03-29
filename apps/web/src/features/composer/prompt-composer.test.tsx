import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PromptComposer } from './prompt-composer';

describe('PromptComposer', () => {
  it('submits on Enter and keeps Shift+Enter for newline', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PromptComposer chatId="chat-1" onSubmit={onSubmit} />);

    const textarea = screen.getByLabelText('메시지 입력');

    await user.type(textarea, 'Hello');
    await user.keyboard('{Shift>}{Enter}{/Shift}World');
    expect(onSubmit).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Hello\nWorld');
  });

  it('shows stop action while streaming', async () => {
    const user = userEvent.setup();
    const onAbort = vi.fn();

    render(<PromptComposer chatId="chat-1" isStreaming onAbort={onAbort} onSubmit={vi.fn()} />);

    const stopButton = screen.getByRole('button', { name: 'Stop generating' });
    await user.click(stopButton);

    expect(onAbort).toHaveBeenCalledTimes(1);
  });
});
