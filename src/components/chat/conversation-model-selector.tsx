import { BotIcon, Loader2Icon, SparklesIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useConversationActions,
  useConversationQuery,
} from '@/hooks/use-conversations-query';
import { useFreeModelsQuery } from '@/hooks/use-free-models-query';
import { useSettingsQuery } from '@/hooks/use-settings-query';

type ConversationModelSelectorProps = {
  conversationId: string | null;
};

function getModelLabel(modelId: string | null, modelName: string | null) {
  if (!modelId) {
    return '모델 선택';
  }

  return modelName ?? modelId;
}

export function ConversationModelSelector({
  conversationId,
}: ConversationModelSelectorProps) {
  const settingsQuery = useSettingsQuery();
  const conversationQuery = useConversationQuery(conversationId);
  const conversationActions = useConversationActions();
  const freeModelsQuery = useFreeModelsQuery(
    settingsQuery.data?.openRouterApiKey,
  );
  const freeModels = freeModelsQuery.data ?? [];
  const activeConversation = conversationQuery.data;
  const activeModel =
    freeModels.find((model) => model.id === activeConversation?.modelId) ??
    null;
  const triggerLabel = getModelLabel(
    activeConversation?.modelId ?? null,
    activeModel?.name ?? null,
  );

  if (!conversationId) {
    return null;
  }

  return (
    <div className="w-full max-w-[220px] sm:w-auto">
      <Select
        disabled={
          !settingsQuery.data?.openRouterApiKey ||
          conversationQuery.isPending ||
          freeModelsQuery.isPending ||
          freeModels.length === 0
        }
        onValueChange={(value) =>
          void conversationActions.updateConversationModel(
            conversationId,
            value,
          )
        }
        value={activeConversation?.modelId ?? ''}
      >
        <SelectTrigger
          aria-label="현재 대화 모델 선택"
          className="h-9 w-full rounded-xl px-3 sm:min-w-[220px]"
          id="conversation-model-selector-trigger"
        >
          <div className="flex min-w-0 items-center gap-2">
            {freeModelsQuery.isPending ? (
              <Loader2Icon className="size-4 animate-spin text-[var(--color-text-muted)]" />
            ) : activeConversation?.modelId ? (
              <BotIcon className="size-4 text-[var(--color-accent)]" />
            ) : (
              <SparklesIcon className="size-4 text-[var(--color-text-muted)]" />
            )}
            <div className="min-w-0 text-left">
              <p className="truncate text-[11px] text-[var(--color-text-muted)]">
                현재 모델
              </p>
              <div className="truncate text-sm text-[var(--color-text)]">
                <SelectValue placeholder={triggerLabel} />
              </div>
            </div>
          </div>
        </SelectTrigger>
        <SelectContent>
          {freeModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span>{model.name ?? model.id}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {model.id}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
