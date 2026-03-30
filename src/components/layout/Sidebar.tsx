import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewChatButton } from "@/components/conversation/NewChatButton";
import { ConversationList } from "@/components/conversation/ConversationList";

export function Sidebar() {
  return (
    <aside className="flex w-[280px] min-w-[280px] flex-col border-r border-border bg-card">
      <div className="p-3">
        <NewChatButton />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <ConversationList />
      </ScrollArea>
      <Separator />
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link to="/settings">
            <Settings className="size-4" />
            설정
          </Link>
        </Button>
      </div>
    </aside>
  );
}
