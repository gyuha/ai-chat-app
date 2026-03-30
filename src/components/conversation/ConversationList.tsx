import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import { ConversationItem } from "./ConversationItem";
import { EmptyConversationList } from "./EmptyConversationList";

export function ConversationList() {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return <EmptyConversationList />;
  }

  return (
    <div className="flex flex-col gap-1 p-3">
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
