import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createAppQueryClient } from "@/app/query-client";
import { apiRequest } from "@/lib/api/client";
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

function renderAt(pathname: "/login" | "/signup") {
  const queryClient = createAppQueryClient();
  const history = createMemoryHistory({
    initialEntries: [pathname],
  });
  const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute]);
  const router = history && routeTree && undefined;

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

  return { queryClient };
}

describe("auth forms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3000");
    vi.mocked(authApi.getSession).mockResolvedValue(null as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("shows the approved invalid-credentials form error", async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce(new Error("invalid credentials"));

    renderAt("/login");

    fireEvent.change(screen.getByLabelText("이메일"), {
      target: { value: "hello@example.com" },
    });
    fireEvent.blur(screen.getByLabelText("이메일"));
    fireEvent.change(screen.getByLabelText("비밀번호"), {
      target: { value: "not-secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인하기" }));

    await waitFor(() => {
      expect(
        screen.getByText("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요."),
      ).toBeInTheDocument();
    });
  });

  it("keeps the shared client helper credentialed for /auth/session", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ user: { id: "user-1", email: "hello@example.com" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    await apiRequest("/auth/session");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/auth/session",
      expect.objectContaining({
        credentials: "include",
      }),
    );
  });
});
