import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth';
import { useEffect } from 'react';

interface RouterContext {
  auth: ReturnType<typeof useAuthStore>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // 앱 마운트 시 로딩 완료
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      <Outlet />
    </>
  );
}
