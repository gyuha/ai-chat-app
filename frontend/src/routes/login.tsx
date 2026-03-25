import { Navigate, createRoute } from "@tanstack/react-router";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/features/auth/auth.store";

import { rootRoute } from "./__root";

function LoginRouteComponent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <AuthCard
      description="이메일과 비밀번호로 로그인하면 채팅을 시작할 수 있습니다."
      footerAction="회원가입"
      footerCopy="계정이 아직 없으신가요?"
      footerTo="/signup"
      mode="login"
      title="로그인이 필요합니다"
    >
      <LoginForm />
    </AuthCard>
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRouteComponent,
});
