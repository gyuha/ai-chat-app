import { createRouter, type RouterHistory } from "@tanstack/react-router";

import { createAppQueryClient } from "./query-client";
import { rootRoute } from "@/routes/__root";
import { indexRoute } from "@/routes/index";
import { loginRoute } from "@/routes/login";
import { signupRoute } from "@/routes/signup";

export const queryClient = createAppQueryClient();

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute]);

type CreateAppRouterOptions = {
  history?: RouterHistory;
  queryClient?: typeof queryClient;
};

export function createAppRouter({
  history,
  queryClient: routerQueryClient = queryClient,
}: CreateAppRouterOptions = {}) {
  return createRouter({
    routeTree,
    history,
    context: {
      queryClient: routerQueryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });
}

export const router = createAppRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
