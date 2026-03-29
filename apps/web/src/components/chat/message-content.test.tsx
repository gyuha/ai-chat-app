import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { copyText } from '../../lib/clipboard';
import { MessageContent } from './message-content';

vi.mock('../../lib/clipboard', () => ({
  copyText: vi.fn().mockResolvedValue(true),
}));

describe('MessageContent', () => {
  beforeEach(() => {
    vi.mocked(copyText).mockClear();
  });

  it('renders markdown headings and copies fenced code blocks', async () => {
    const user = userEvent.setup();

    render(
      <MessageContent
        content={`## Sample heading\n\n\`\`\`ts\nconsole.log('hi')\n\`\`\``}
        messageRole="assistant"
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Sample heading' })).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: '코드 복사' });
    await user.click(copyButton);

    expect(copyText).toHaveBeenCalledWith("console.log('hi')");
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });
});
