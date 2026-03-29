import { useNavigate } from '@tanstack/react-router';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // /logout 라우트로 이동 (beforeLoad에서 로그아웃 처리)
    navigate({ to: '/logout' });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      로그아웃
    </button>
  );
}
