import { Link, createRoute } from "@tanstack/react-router";

import { rootRoute } from "./__root";

function SignupRouteComponent() {
  return (
    <>
      <h1>회원가입 화면 준비 중</h1>
      <p className="auth-copy">
        Plan 01-07에서 실제 회원가입 폼과 submit flow를 연결합니다.
      </p>
      <Link className="primary-action" to="/login">
        로그인 화면 보기
      </Link>
    </>
  );
}

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupRouteComponent,
});
