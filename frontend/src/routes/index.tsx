import { Navigate, redirect, createRoute } from "@tanstack/react-router";

import { ensureSession } from "@/features/auth/session";
import { useAuthStore } from "@/features/auth/auth.store";

import { rootRoute } from "./__root";

function ProtectedHomeRoute() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  if (status === "anonymous") {
    return <Navigate to="/login" />;
  }

  return (
    <section className="app-home-card">
      <p className="eyebrow">Authenticated Session</p>
      <h1>채팅 앱 진입점</h1>
      <p className="auth-copy">
        {user ? `${user.email} 계정으로 인증되었습니다.` : "세션을 확인하는 중입니다."}
      </p>
    </section>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    const user = await ensureSession(context.queryClient);

    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedHomeRoute,
});
