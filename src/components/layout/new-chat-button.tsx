import { Link } from '@tanstack/react-router';
import { PenSquareIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NewChatButtonProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function NewChatButton({
  mobile = false,
  onNavigate,
}: NewChatButtonProps) {
  return (
    <Button
      asChild
      aria-label="새 대화 시작"
      className={cn(
        'transition-colors duration-200',
        mobile
          ? 'size-9 rounded-xl'
          : 'h-11 w-full justify-start rounded-2xl px-4 text-sm font-medium',
      )}
      size={mobile ? 'icon' : 'lg'}
    >
      <Link preload="intent" to="/" onClick={onNavigate}>
        <PenSquareIcon className="size-4" />
        {!mobile ? <span>새 대화 시작</span> : null}
      </Link>
    </Button>
  );
}
