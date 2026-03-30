import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppShell } from '@/components/layout/app-shell';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useUiStore } from '@/stores/ui-store';
import { resetUiStore, setViewport } from '@/test/test-utils';

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
  };
});

describe('AppShell', () => {
  beforeEach(() => {
    resetUiStore();
    setViewport(1280);
  });

  it('renders the standard shell layout with sidebar, header, and content', () => {
    render(
      <TooltipProvider>
        <AppShell activeConversationId={null} currentPath="/" title="새 대화">
          <div>메시지 영역</div>
        </AppShell>
      </TooltipProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '새 대화' }),
    ).toBeInTheDocument();
    expect(screen.getByText('메시지 영역')).toBeInTheDocument();
    expect(screen.getAllByText('새 대화 시작').length).toBeGreaterThan(0);
    expect(screen.getAllByText('설정').length).toBeGreaterThan(0);
  });

  it('opens the mobile sidebar from the hamburger interaction', async () => {
    const user = userEvent.setup();
    setViewport(375);

    render(
      <TooltipProvider>
        <AppShell activeConversationId={null} currentPath="/" title="새 대화">
          <div>모바일 콘텐츠</div>
        </AppShell>
      </TooltipProvider>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('대화 목록 열기'));

    await waitFor(() => {
      expect(useUiStore.getState().mobileSidebarOpen).toBe(true);
    });

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
