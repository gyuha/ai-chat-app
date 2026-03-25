import { Navigate, createRoute } from "@tanstack/react-router";

import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { useAuthStore } from "@/features/auth/auth.store";

import { rootRoute } from "./__root";

function SignupRouteComponent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <AuthCard
      description="새 계정을 만들면 바로 채팅 화면으로 이동합니다."
      footerAction="로그인"
      footerCopy="이미 계정이 있으신가요?"
      footerTo="/login"
      mode="signup"
      title="회원가입"
    >
      <SignupForm />
    </AuthCard>
  );
}

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupRouteComponent,
});
