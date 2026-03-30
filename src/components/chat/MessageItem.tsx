import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { Message } from "@/db";

interface MessageItemProps {
  message: Pick<Message, "role" | "content" | "id">;
  isStreaming?: boolean;
}

export function MessageItem({ message }: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end px-4 py-2">
        <div
          data-slot="message-bubble"
          className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-2">
      <div
        data-slot="message-bubble"
        className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-foreground"
      >
        <div className="prose prose-sm prose-invert max-w-none text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
