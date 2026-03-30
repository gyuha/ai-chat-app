import { MessageCircle } from "lucide-react";

export function EmptyConversationList() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center">
      <MessageCircle className="size-8 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold leading-tight">대화가 없습니다</p>
        <p className="mt-1 text-xs text-muted-foreground">
          새 대화를 시작하여 AI와 대화해 보세요.
        </p>
      </div>
    </div>
  );
}
