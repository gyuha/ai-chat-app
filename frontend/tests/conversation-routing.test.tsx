import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";
import { createAppRouter } from "@/app/router";
import { clearAuthState, resetAuthState } from "@/features/auth/auth.store";

import * as authApi from "@/features/auth/api";
import * as conversationsApi from "@/features/conversations/api";

vi.mock("@/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/features/auth/api")>("@/features/auth/api");

  return {
    ...actual,
    getSession: vi.fn(),
  };
});

vi.mock("@/features/conversations/api", async () => {
  const actual = await vi.importActual<typeof import("@/features/conversations/api")>(
    "@/features/conversations/api",
  );

  return {
    ...actual,
    listConversations: vi.fn(),
    createConversation: vi.fn(),
    getConversation: vi.fn(),
  };
});

function renderApp(initialPath = "/") {
  const queryClient = createAppQueryClient();
  const history = createMemoryHistory({
    initialEntries: [initialPath],
  });
  const router = createAppRouter({
    history,
    queryClient,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{
          queryClient,
        }}
      />
    </QueryClientProvider>,
  );

  return {
    queryClient,
    router,
  };
}

describe("conversation routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthState();
    vi.mocked(authApi.getSession).mockResolvedValue({
      user: { id: "user-1", email: "hello@example.com" },
    });
    vi.mocked(conversationsApi.getConversation).mockImplementation(async (id) => ({
      id,
      title: "새 대화",
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearAuthState();
  });

  it("renders an existing conversation title for an authenticated visit", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValueOnce([
      { id: "conversation-1", title: "기존 대화" },
    ]);

    const { router } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "기존 대화" })).toBeTruthy();
    });

    expect(router.state.location.pathname).toBe("/");
    expect(conversationsApi.createConversation).not.toHaveBeenCalled();
  });

  it("bootstraps exactly one conversation when the authenticated user has none", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValueOnce([]);
    vi.mocked(conversationsApi.createConversation).mockResolvedValueOnce({
      id: "conversation-1",
      title: "새 대화",
    });

    renderApp("/");

    await waitFor(() => {
      expect(conversationsApi.createConversation).toHaveBeenCalledTimes(1);
    });

    expect(conversationsApi.createConversation).toHaveBeenCalledWith({
      mode: "bootstrap",
    });

    await waitFor(() => {
      expect(screen.getAllByText("새 대화").length).toBeGreaterThan(0);
    });
  });

  it("does not render a manual create conversation CTA before bootstrap completes", async () => {
    vi.mocked(conversationsApi.listConversations).mockResolvedValueOnce([]);
    vi.mocked(conversationsApi.createConversation).mockResolvedValueOnce({
      id: "conversation-1",
      title: "새 대화",
    });

    renderApp("/");

    await waitFor(() => {
      expect(conversationsApi.createConversation).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByRole("button", { name: /새 대화 만들기/i })).toBeNull();
    expect(screen.queryByText(/대화를 만들어 보세요/i)).toBeNull();
  });
});
