import { useNavigate } from "@tanstack/react-router";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/use-conversations";

export function NewChatButton() {
  const navigate = useNavigate();
  const createConversation = useCreateConversation();

  const handleClick = async () => {
    const conversation = await createConversation.mutateAsync({});
    navigate({ to: "/chat/$conversationId", params: { conversationId: conversation.id } });
  };

  return (
    <Button
      className="w-full justify-start gap-2"
      onClick={handleClick}
      disabled={createConversation.isPending}
    >
      {createConversation.isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Plus className="size-4" />
      )}
      새 대화
    </Button>
  );
}
