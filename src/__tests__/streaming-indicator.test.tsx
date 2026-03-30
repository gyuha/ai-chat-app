import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreamingIndicator } from "../components/chat/StreamingIndicator";

describe("StreamingIndicator", () => {
  it("should render thinking/loading text", () => {
    render(<StreamingIndicator />);

    expect(screen.getByText("생각 중...")).toBeInTheDocument();
  });

  it("should render with left alignment (justify-start)", () => {
    const { container } = render(<StreamingIndicator />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-start");
  });

  it("should contain a spinner element with animate-spin class", () => {
    const { container } = render(<StreamingIndicator />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should have text-muted-foreground color on content", () => {
    const { container } = render(<StreamingIndicator />);

    const content = container.querySelector(".text-muted-foreground");
    expect(content).toBeInTheDocument();
  });
});
