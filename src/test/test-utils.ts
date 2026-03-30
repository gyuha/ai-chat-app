import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import type { RenderResult } from '@testing-library/react';
import { act, render } from '@testing-library/react';
import { createElement } from 'react';
import { vi } from 'vitest';

import type { OpenRouterModel } from '@/lib/openrouter-client';
import { AppQueryProvider } from '@/providers/app-query-provider';
import { routeTree } from '@/routeTree.gen';
import { useUiStore } from '@/stores/ui-store';

export function resetUiStore() {
  useUiStore.setState({
    mobileSidebarOpen: false,
    resolvedTheme: 'dark',
    themePreference: 'dark',
  });
}

export function setPrefersDark(value: boolean) {
  window.__mockPrefersDark = value;
}

export function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

function ensureFetchMock() {
  const currentFetch = globalThis.fetch;

  if (!currentFetch || !vi.isMockFunction(currentFetch)) {
    const nextFetch = vi.fn();

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: nextFetch,
    });

    return nextFetch;
  }

  return currentFetch as ReturnType<typeof vi.fn>;
}

export function createOpenRouterModelsResponse(
  models: OpenRouterModel[],
  status = 200,
) {
  return new Response(JSON.stringify({ data: models }), {
    headers: {
      'Content-Type': 'application/json',
    },
    status,
  });
}

export function mockFetchResponses(...responses: Array<Error | Response>) {
  const fetchMock = ensureFetchMock();

  fetchMock.mockReset();

  for (const response of responses) {
    if (response instanceof Error) {
      fetchMock.mockRejectedValueOnce(response);
      continue;
    }

    fetchMock.mockResolvedValueOnce(response);
  }

  return fetchMock;
}

export function resetFetchMock() {
  ensureFetchMock().mockReset();
}

export async function renderAppRoute(path = '/') {
  const history = createMemoryHistory({
    initialEntries: [path],
  });
  const router = createRouter({
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    history,
    routeTree,
    scrollRestoration: true,
  });
  let renderResult: RenderResult | null = null;

  await act(async () => {
    renderResult = render(
      createElement(
        AppQueryProvider,
        null,
        createElement(RouterProvider, { router }),
      ),
    );
    await router.load();
  });

  if (renderResult === null) {
    throw new Error('renderAppRoute failed to initialize the render result.');
  }

  const resolvedRenderResult: RenderResult = renderResult;

  return {
    router,
    ...resolvedRenderResult,
  };
}
