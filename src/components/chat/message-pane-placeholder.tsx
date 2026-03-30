import { ChatEmptyState } from '@/components/chat/chat-empty-state';
import { getConversationTitle } from '@/components/layout/conversation-list';
import { Skeleton } from '@/components/ui/skeleton';

type MessagePanePlaceholderProps = {
  conversationId: string;
};

export function MessagePanePlaceholder({
  conversationId,
}: MessagePanePlaceholderProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-1 flex-col">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                현재 대화
              </p>
              <h2 className="pt-2 text-xl font-semibold text-[var(--color-text)]">
                {getConversationTitle(conversationId)}
              </h2>
            </div>
            <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]">
              메시지 0개
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-28 rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
            <Skeleton className="h-4 w-full rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
            <Skeleton className="h-4 w-4/5 rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-2 py-10 sm:py-14">
          <ChatEmptyState />
        </div>
      </div>
    </section>
  );
}
