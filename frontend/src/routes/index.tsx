import { createRoute } from '@tanstack/react-router';
import LoginPage from '@/pages/login';

export const Route = createRoute({
  getParentRoute: () => import('./__root').then(m => m.Route),
  path: '/',
  component: LoginPage,
}).update({
  id: '/',
});
