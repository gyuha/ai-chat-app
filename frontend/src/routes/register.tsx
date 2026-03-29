import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Route = createFileRoute('/register')({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <RegisterForm
          onSuccess={() => {
            // 회원가입 성공 후 메인으로 리다이렉트 (자동 로그인됨)
            navigate({ to: '/' });
          }}
        />
      </div>
    </div>
  );
}
