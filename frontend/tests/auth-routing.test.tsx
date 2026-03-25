import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";
import { createAppRouter } from "@/app/router";
import { clearAuthState, getAuthState, resetAuthState } from "@/features/auth/auth.store";
import { ApiError } from "@/lib/api/client";

import * as authApi from "@/features/auth/api";

vi.mock("@/features/auth/api", async () => {
  const actual = await vi.importActual<typeof import("@/features/auth/api")>("@/features/auth/api");

  return {
    ...actual,
    getSession: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
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

describe("auth routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearAuthState();
  });

  it("redirects unauthenticated visits to /login", async () => {
    vi.mocked(authApi.getSession).mockRejectedValueOnce(
      new ApiError("Request failed with status 401", 401),
    );

    const { router } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "로그인이 필요합니다" })).toBeTruthy();
    });

    expect(router.state.location.pathname).toBe("/login");
    expect(screen.getByRole("button", { name: "로그인하기" })).toBeTruthy();
  });

  it("restores a mocked session through /auth/session and keeps the protected route", async () => {
    vi.mocked(authApi.getSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "hello@example.com" },
    });

    const { router } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("hello@example.com 계정으로 인증되었습니다.")).toBeTruthy();
    });

    expect(authApi.getSession).toHaveBeenCalledTimes(1);
    expect(router.state.location.pathname).toBe("/");
  });

  it("returns the app to /login when the session expires with 401", async () => {
    vi.mocked(authApi.getSession)
      .mockResolvedValueOnce({
        user: { id: "user-1", email: "hello@example.com" },
      })
      .mockRejectedValueOnce(new ApiError("Request failed with status 401", 401));

    const { queryClient, router } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("hello@example.com 계정으로 인증되었습니다.")).toBeTruthy();
    });

    await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    await queryClient.refetchQueries({ queryKey: ["auth", "session"] });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });

    expect(getAuthState().status).toBe("anonymous");
  });
});
