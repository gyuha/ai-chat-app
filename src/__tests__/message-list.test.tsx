import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageList } from "../components/chat/MessageList";
import type { Message } from "../db";

vi.mock("highlight.js/styles/github-dark.css", () => ({}));

// Mock scrollTo for jsdom
beforeAll(() => {
  HTMLElement.prototype.scrollTo = vi.fn();
});

describe("MessageList", () => {
  const mockMessages: Message[] = [
    {
      id: "msg-1",
      conversationId: "conv-1",
      role: "user",
      content: "Hello",
      createdAt: new Date("2024-01-01T10:00:00"),
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      role: "assistant",
      content: "Hi there!",
      createdAt: new Date("2024-01-01T10:00:01"),
    },
  ];

  it("should render all messages", () => {
    render(
      <MessageList
        messages={mockMessages}
        streamingContent=""
        isStreaming={false}
      />,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("should show empty state when no messages", () => {
    render(
      <MessageList messages={[]} streamingContent="" isStreaming={false} />,
    );

    expect(screen.getByText("대화를 시작해보세요.")).toBeInTheDocument();
  });

  it("should show streaming content as an assistant message when isStreaming and streamingContent exist", () => {
    render(
      <MessageList
        messages={mockMessages}
        streamingContent="Streaming response..."
        isStreaming={true}
      />,
    );

    expect(screen.getByText("Streaming response...")).toBeInTheDocument();
  });

  it("should show StreamingIndicator when isStreaming and no streamingContent", () => {
    render(
      <MessageList
        messages={mockMessages}
        streamingContent=""
        isStreaming={true}
      />,
    );

    expect(screen.getByText("생각 중...")).toBeInTheDocument();
  });

  it("should have scroll container with overflow-y-auto", () => {
    const { container } = render(
      <MessageList
        messages={mockMessages}
        streamingContent=""
        isStreaming={false}
      />,
    );

    const scrollContainer = container.querySelector(
      "[data-slot='message-list-scroll']",
    );
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.className).toContain("overflow-y-auto");
  });
});
