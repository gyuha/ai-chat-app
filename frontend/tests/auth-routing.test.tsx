import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";
import { clearAuthState, getAuthState, resetAuthState } from "@/features/auth/auth.store";
import { rootRoute } from "@/routes/__root";
import { indexRoute } from "@/routes/index";
import { loginRoute } from "@/routes/login";
import { signupRoute } from "@/routes/signup";

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
  const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute]);
  const router = authApi.getSession
    ? undefined
    : undefined;

  const appRouter = router ?? undefined;

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={appRouter}
        context={{
          queryClient,
        }}
      />
    </QueryClientProvider>,
  );

  return {
    history,
    queryClient,
  };
}

describe("auth routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuthState();
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearAuthState();
  });

  it("redirects unauthenticated visits to /login", async () => {
    vi.mocked(authApi.getSession).mockResolvedValueOnce(null as never);

    renderApp("/");

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });

    expect(screen.getByRole("heading", { name: "로그인이 필요합니다" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인하기" })).toBeInTheDocument();
  });

  it("restores a mocked session through /auth/session and keeps the protected route", async () => {
    vi.mocked(authApi.getSession).mockResolvedValueOnce({
      user: { id: "user-1", email: "hello@example.com" },
    });

    renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("hello@example.com 계정으로 인증되었습니다.")).toBeInTheDocument();
    });

    expect(authApi.getSession).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe("/");
  });

  it("returns the app to /login when the session expires with 401", async () => {
    vi.mocked(authApi.getSession)
      .mockResolvedValueOnce({
        user: { id: "user-1", email: "hello@example.com" },
      })
      .mockRejectedValueOnce(new Response(null, { status: 401 }) as never);

    const { queryClient } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("hello@example.com 계정으로 인증되었습니다.")).toBeInTheDocument();
    });

    await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    await queryClient.refetchQueries({ queryKey: ["auth", "session"] });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });

    expect(getAuthState().status).toBe("anonymous");
  });
});
