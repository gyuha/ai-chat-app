import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConversationList } from '@/components/layout/conversation-list';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppQueryProvider } from '@/providers/app-query-provider';
import {
  createConversationFixture,
  resetUiStore,
  seedConversations,
} from '@/test/test-utils';

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

describe('ConversationList', () => {
  beforeEach(() => {
    resetUiStore();
  });

  it('renders stored conversations in updatedAt order and marks drafts', async () => {
    await seedConversations([
      createConversationFixture({
        id: 'older',
        modelId: 'openrouter/free',
        title: '이전 대화',
        updatedAt: '2026-03-31T00:00:00.000Z',
      }),
      createConversationFixture({
        id: 'draft',
        modelId: null,
        title: '새 대화',
        updatedAt: '2026-03-31T01:00:00.000Z',
      }),
    ]);

    render(
      <AppQueryProvider>
        <TooltipProvider>
          <SidebarProvider defaultOpen>
            <ConversationList activeConversationId="draft" />
          </SidebarProvider>
        </TooltipProvider>
      </AppQueryProvider>,
    );

    expect(
      await screen.findByText('draft · 모델 선택 필요'),
    ).toBeInTheDocument();

    const titles = screen
      .getAllByRole('link')
      .map((node) => node.textContent ?? '')
      .join('\n');

    expect(titles.indexOf('새 대화')).toBeLessThan(titles.indexOf('이전 대화'));
  });
});
