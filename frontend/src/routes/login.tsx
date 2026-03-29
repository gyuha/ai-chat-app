import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { LoginForm } from '../components/auth/LoginForm';

export const Route = createFileRoute('/login')({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <LoginForm
          onSuccess={() => {
            // 로그인 성공 후 이전 페이지 또는 메인으로 리다이렉트
            const redirectTo = (search as Record<string, string | undefined>).redirect;
            navigate({ to: redirectTo || '/' });
          }}
        />
      </div>
    </div>
  );
}
