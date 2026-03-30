import { useNavigate } from "@tanstack/react-router";
import { useMatches } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteConversation } from "@/hooks/use-conversations";

interface DeleteConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

export function DeleteConversationDialog({
  open,
  onOpenChange,
  conversationId,
}: DeleteConversationDialogProps) {
  const navigate = useNavigate();
  const deleteConversation = useDeleteConversation();
  const matches = useMatches();
  const isCurrentConversation = matches.some(
    (match) =>
      match.id === "/chat/$conversationId" &&
      (match.params as Record<string, string>).conversationId === conversationId,
  );

  const handleDelete = async () => {
    await deleteConversation.mutateAsync(conversationId);
    onOpenChange(false);
    if (isCurrentConversation) {
      navigate({ to: "/" });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>대화 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            이 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
