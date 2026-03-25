import { Link, createRoute } from "@tanstack/react-router";

import { rootRoute } from "./__root";

function LoginRouteComponent() {
  return (
    <>
      <h1>로그인 화면 준비 중</h1>
      <p className="auth-copy">
        Plan 01-07에서 실제 로그인 폼과 validation을 연결합니다.
      </p>
      <Link className="primary-action" to="/signup">
        회원가입 화면 보기
      </Link>
    </>
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRouteComponent,
});
