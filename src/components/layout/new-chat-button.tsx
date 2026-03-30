import { PenSquareIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useStartConversation } from '@/hooks/use-start-conversation';
import { cn } from '@/lib/utils';

type NewChatButtonProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function NewChatButton({
  mobile = false,
  onNavigate,
}: NewChatButtonProps) {
  const { isPending, startConversation } = useStartConversation();

  return (
    <Button
      aria-label="새 대화 시작"
      className={cn(
        'transition-colors duration-200',
        mobile
          ? 'size-9 rounded-xl'
          : 'h-11 w-full justify-start rounded-2xl px-4 text-sm font-medium',
      )}
      disabled={isPending}
      onClick={() => startConversation({ onNavigate })}
      size={mobile ? 'icon' : 'lg'}
      type="button"
    >
      <PenSquareIcon className="size-4" />
      {!mobile ? <span>새 대화 시작</span> : null}
    </Button>
  );
}
