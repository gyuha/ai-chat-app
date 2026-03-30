import { ConversationListItem } from '@/components/layout/conversation-list-item';
import { SidebarMenu } from '@/components/ui/sidebar';
import { useConversationsQuery } from '@/hooks/use-conversations-query';
import type { ConversationRecord } from '@/lib/app-db';
import { getConversationDisplayTitle } from '@/lib/conversation-service';

function getUpdatedLabel(updatedAt: string) {
  const updatedTime = new Date(updatedAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((now - updatedTime) / 60000));

  if (diffMinutes < 1) {
    return '방금 전 업데이트';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전 업데이트`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전 업데이트`;
  }

  if (diffHours < 48) {
    return '어제 업데이트';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(updatedAt));
}

function getConversationStatusLabel(conversation: ConversationRecord) {
  if (!conversation.modelId) {
    return 'draft · 모델 선택 필요';
  }

  return getUpdatedLabel(conversation.updatedAt);
}

export function getConversationTitle(_conversationId: string | null) {
  return '새 대화';
}

export function getConversationListTitle(
  conversation: ConversationRecord | null | undefined,
) {
  return getConversationDisplayTitle(conversation);
}

type ConversationListProps = {
  activeConversationId: string | null;
  onNavigate?: () => void;
};

export function ConversationList({
  activeConversationId,
  onNavigate,
}: ConversationListProps) {
  const conversationsQuery = useConversationsQuery();
  const conversations = conversationsQuery.data ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-2 pb-2">
        <p className="px-3 text-[11px] font-medium tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
          최근 대화
        </p>
      </div>

      <SidebarMenu className="gap-1 px-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-4 text-sm text-[var(--color-text-muted)]">
            아직 저장된 대화가 없습니다.
          </div>
        ) : null}

        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            href={`/chat/${conversation.id}`}
            isActive={activeConversationId === conversation.id}
            isDraft={!conversation.modelId}
            title={getConversationListTitle(conversation)}
            updatedLabel={getConversationStatusLabel(conversation)}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarMenu>
    </div>
  );
}
