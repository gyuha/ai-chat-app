import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth';

export const Route = createFileRoute('/')({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      // 미인증 시 로그인 페이지로 리다이렉트
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: IndexComponent,
});

function IndexComponent() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          환영합니다, {user?.email}!
        </h1>
        <p className="text-gray-600">
          인증된 사용자만 접근할 수 있는 페이지입니다.
        </p>
      </div>
    </div>
  );
}
