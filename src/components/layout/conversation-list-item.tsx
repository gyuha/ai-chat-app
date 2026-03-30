import { Link } from '@tanstack/react-router';
import { MessageSquareTextIcon } from 'lucide-react';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type ConversationListItemProps = {
  href: string;
  isActive: boolean;
  title: string;
  updatedLabel: string;
  onNavigate?: () => void;
};

export function ConversationListItem({
  href,
  isActive,
  title,
  updatedLabel,
  onNavigate,
}: ConversationListItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          'h-auto rounded-xl px-3 py-3 transition-colors duration-200',
          'hover:bg-[color-mix(in_srgb,var(--color-panel)_88%,white)]',
          'data-[active=true]:bg-[color-mix(in_srgb,var(--color-accent)_18%,var(--color-panel))]',
          'data-[active=true]:text-[var(--color-text)]',
        )}
        tooltip={title}
      >
        <Link preload="intent" to={href} onClick={onNavigate}>
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_82%,black)]',
                isActive &&
                  'border-[color-mix(in_srgb,var(--color-accent)_60%,transparent)]',
              )}
            >
              <MessageSquareTextIcon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-sm font-medium text-[var(--color-text)]">
                {title}
              </span>
              <span className="truncate text-xs text-[var(--color-text-muted)]">
                {updatedLabel}
              </span>
            </div>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
