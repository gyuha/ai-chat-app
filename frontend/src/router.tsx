import { createRouter } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { ChatPage } from './pages/chat';
import { LoginPage } from './pages/login';

const router = createRouter({
  routeConfig: [
    createRoute({
      path: '/',
      component: LoginPage,
    }),
    createRoute({
      path: '/chat',
      component: ChatPage,
    }),
  ],
});

export default router;
