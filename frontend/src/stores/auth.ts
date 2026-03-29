import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto } from '../lib/api/types';

interface AuthState {
  // 상태
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  setAuth: (user: UserDto, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      // 액션
      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      // 액세스 토큰은 persist에서 제외 (보안: 메모리에만 저장)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // accessToken은 localStorage에 저장하지 않음
      }),
    },
  ),
);
