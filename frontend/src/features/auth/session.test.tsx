import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";

import {
  getAuthState,
  resetAuthState,
  setAuthenticated,
  useAuthStore,
} from "./auth.store";
import { useSessionBootstrap } from "./session";

function SessionProbe() {
  useSessionBootstrap();

  const status = useAuthStore((state) => state.status);
  const email = useAuthStore((state) => state.user?.email ?? "anonymous");

  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="email">{email}</span>
    </div>
  );
}

describe("auth/session bootstrap", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3001");
    resetAuthState();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("calls /auth/session with credentials include through one restore path", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ user: { id: "u-1", email: "a@test.dev" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const queryClient = createAppQueryClient();
    const view = render(
      <QueryClientProvider client={queryClient}>
        <SessionProbe />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("authenticated");
    });

    expect(screen.getByTestId("email").textContent).toBe("a@test.dev");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/auth/session",
      expect.objectContaining({
        credentials: "include",
        method: "GET",
      }),
    );

    view.rerender(
      <QueryClientProvider client={queryClient}>
        <SessionProbe />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(getAuthState().user?.email).toBe("a@test.dev");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears auth state immediately on a 401 session response", async () => {
    setAuthenticated({ id: "existing", email: "persisted@test.dev" });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 401,
      }),
    );

    const queryClient = createAppQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SessionProbe />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("anonymous");
    });

    expect(screen.getByTestId("email").textContent).toBe("anonymous");
    expect(getAuthState()).toMatchObject({
      isAuthenticated: false,
      user: null,
      status: "anonymous",
    });
  });
});
