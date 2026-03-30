import { ConversationListItem } from '@/components/layout/conversation-list-item';
import { SidebarMenu } from '@/components/ui/sidebar';

export type MockConversation = {
  id: string;
  title: string;
  updatedLabel: string;
};

export const mockConversations: MockConversation[] = [
  {
    id: 'welcome-brief',
    title: 'OpenRouter 무료 모델 비교',
    updatedLabel: '방금 전 업데이트',
  },
  {
    id: 'ui-outline',
    title: '채팅 UI 구조 초안',
    updatedLabel: '12분 전 업데이트',
  },
  {
    id: 'settings-copy',
    title: '설정 화면 문구 점검',
    updatedLabel: '어제 업데이트',
  },
];

export function getConversationTitle(conversationId: string | null) {
  if (!conversationId) {
    return '새 대화';
  }

  return (
    mockConversations.find((conversation) => conversation.id === conversationId)
      ?.title ?? '새 대화'
  );
}

type ConversationListProps = {
  activeConversationId: string | null;
  onNavigate?: () => void;
};

export function ConversationList({
  activeConversationId,
  onNavigate,
}: ConversationListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-2 pb-2">
        <p className="px-3 text-[11px] font-medium tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
          최근 대화
        </p>
      </div>

      <SidebarMenu className="gap-1 px-2">
        {mockConversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            href={`/chat/${conversation.id}`}
            isActive={activeConversationId === conversation.id}
            title={conversation.title}
            updatedLabel={conversation.updatedLabel}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarMenu>
    </div>
  );
}
