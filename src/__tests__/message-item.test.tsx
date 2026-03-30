import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageItem } from "../components/chat/MessageItem";
import type { Message } from "../db";

// Mock highlight.js CSS import
vi.mock("highlight.js/styles/github-dark.css", () => ({}));

describe("MessageItem", () => {
  const baseMessage: Message = {
    id: "msg-1",
    conversationId: "conv-1",
    content: "Hello",
    createdAt: new Date(),
    role: "user",
  };

  it('should render user message with right alignment (justify-end)', () => {
    const { container } = render(
      <MessageItem message={{ ...baseMessage, role: "user" }} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-end");
  });

  it('should render user message with primary bubble style', () => {
    const { container } = render(
      <MessageItem message={{ ...baseMessage, role: "user" }} />,
    );

    const bubble = container.querySelector("[data-slot='message-bubble']");
    expect(bubble?.className).toContain("bg-primary");
    expect(bubble?.className).toContain("text-primary-foreground");
  });

  it("should render user message content as plain text in a p tag", () => {
    render(
      <MessageItem
        message={{ ...baseMessage, role: "user", content: "Hello world" }}
      />,
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it('should render assistant message with left alignment (justify-start)', () => {
    const { container } = render(
      <MessageItem message={{ ...baseMessage, role: "assistant" }} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-start");
  });

  it("should render assistant message with ReactMarkdown", () => {
    const markdownContent = "# Hello\n\nThis is **bold** text.";
    render(
      <MessageItem
        message={{ ...baseMessage, role: "assistant", content: markdownContent }}
      />,
    );

    // ReactMarkdown should render the heading and bold text
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("should render code blocks in assistant markdown with pre > code elements", () => {
    const markdownWithCode =
      "Here is some code:\n\n```javascript\nconsole.log('hello');\n```";
    render(
      <MessageItem
        message={{
          ...baseMessage,
          role: "assistant",
          content: markdownWithCode,
        }}
      />,
    );

    const codeElement = document.querySelector("pre code");
    expect(codeElement).toBeInTheDocument();
  });

  it("should apply max-w-[80%] width constraint to message bubbles", () => {
    const { container } = render(
      <MessageItem message={{ ...baseMessage, role: "user" }} />,
    );

    const bubble = container.querySelector("[data-slot='message-bubble']");
    expect(bubble?.className).toContain("max-w-[80%]");
  });
});
