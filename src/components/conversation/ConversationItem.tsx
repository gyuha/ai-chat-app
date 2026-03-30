import { useState } from "react";
import { Link, useMatches } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/db";
import { DeleteConversationDialog } from "./DeleteConversationDialog";

interface ConversationItemProps {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const matches = useMatches();
  const isActive = matches.some(
    (match) =>
      match.id === "/chat/$conversationId" &&
      (match.params as Record<string, string>).conversationId === conversation.id,
  );

  return (
    <>
      <div
        className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 cursor-pointer"
        }`}
      >
        <Link
          to="/chat/$conversationId"
          params={{ conversationId: conversation.id }}
          className="flex-1 truncate"
        >
          {conversation.title}
        </Link>
        <Button
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover:opacity-100 shrink-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <DeleteConversationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        conversationId={conversation.id}
      />
    </>
  );
}
