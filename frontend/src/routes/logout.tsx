import { createFileRoute, redirect } from '@tanstack/react-router';
import { authApi } from '../lib/api/auth';
import { useAuthStore } from '../stores/auth';

export const Route = createFileRoute('/logout')({
  beforeLoad: async () => {
    // 로그아웃 API 호출
    await authApi.logout();

    // 상태 초기화
    useAuthStore.getState().clearAuth();

    // 로그인 페이지로 리다이렉트
    throw redirect({ to: '/login' });
  },
});
