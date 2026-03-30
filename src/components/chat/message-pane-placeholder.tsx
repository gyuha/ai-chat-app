import { BotIcon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFreeModelsQuery } from '@/hooks/use-free-models-query';
import { useSettingsQuery } from '@/hooks/use-settings-query';
import type { ConversationRecord } from '@/lib/app-db';
import { getConversationDisplayTitle } from '@/lib/conversation-service';

type MessagePanePlaceholderProps = {
  conversation: ConversationRecord | null;
};

export function MessagePanePlaceholder({
  conversation,
}: MessagePanePlaceholderProps) {
  const settingsQuery = useSettingsQuery();
  const activeModelId = conversation?.modelId ?? null;
  const freeModelsQuery = useFreeModelsQuery(
    settingsQuery.data?.openRouterApiKey,
  );
  const activeModel = activeModelId
    ? (freeModelsQuery.data?.find((model) => model.id === activeModelId) ??
      null)
    : null;
  const title = getConversationDisplayTitle(conversation);
  const needsModelSelection = conversation !== null && !conversation.modelId;

  function openModelSelector() {
    document.getElementById('conversation-model-selector-trigger')?.click();
  }

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
                {title}
              </h2>
            </div>
            {needsModelSelection ? (
              <div className="rounded-full border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                모델 선택 필요
              </div>
            ) : (
              <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                활성 모델 ·{' '}
                {activeModel?.name ?? conversation?.modelId ?? '준비 중'}
              </div>
            )}
          </div>

          {needsModelSelection ? (
            <div className="mt-6 rounded-[24px] border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-panel))] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]">
                    <SparklesIcon className="size-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      먼저 무료 모델을 선택해 주세요
                    </p>
                    <p className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                      이 대화는 이미 생성되었습니다. 상단 헤더에서 사용할 무료
                      모델을 고르면 바로 입력창이 활성화됩니다.
                    </p>
                  </div>
                </div>
                <Button
                  className="h-10 rounded-2xl px-4 text-sm font-medium"
                  onClick={openModelSelector}
                  type="button"
                >
                  모델 선택
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-28 rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
                <Skeleton className="h-4 w-full rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
                <Skeleton className="h-4 w-4/5 rounded-full bg-[color-mix(in_srgb,var(--color-panel)_65%,white)]" />
              </div>

              <div className="mt-8 rounded-[24px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_88%,black)] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_82%,black)]">
                    <BotIcon className="size-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      활성 모델
                    </p>
                    <p className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                      {activeModel?.name ?? conversation?.modelId} 선택이
                      유지되고 있습니다. Phase 4에서 실제 메시지 스트리밍이
                      이어집니다.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
