import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/auth.store";
import { useSessionBootstrap } from "@/features/auth/session";

type RouterContext = {
  queryClient: QueryClient;
};

function RootLayout() {
  useSessionBootstrap();

  const status = useAuthStore((state) => state.status);

  return (
    <main className="app-shell">
      <section className="auth-shell">
        <div className="auth-card">
          <p className="eyebrow">OpenRouter Free Chat</p>
          <nav className="auth-actions" aria-label="Primary navigation">
            <Link className="secondary-action" to="/">
              앱 홈
            </Link>
            <Link className="secondary-action" to="/login">
              로그인
            </Link>
            <Link className="secondary-action" to="/signup">
              회원가입
            </Link>
          </nav>
          <p className="auth-copy">세션 상태: {status}</p>
          <Outlet />
        </div>
      </section>
    </main>
  );
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
