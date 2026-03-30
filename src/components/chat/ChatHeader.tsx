import { ModelSelectorPopover } from "./ModelSelectorPopover";

interface ChatHeaderProps {
  conversationTitle: string;
  modelId: string;
  onModelChange: (modelId: string) => void;
}

export function ChatHeader({
  conversationTitle,
  modelId,
  onModelChange,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3">
      <h1 className="max-w-[50%] truncate text-lg font-semibold">
        {conversationTitle}
      </h1>
      <ModelSelectorPopover modelId={modelId} onModelChange={onModelChange} />
    </div>
  );
}
