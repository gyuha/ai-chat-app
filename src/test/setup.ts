import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

type MatchMediaListener = (event: MediaQueryListEvent) => void;

declare global {
  interface Window {
    __mockPrefersDark?: boolean;
  }
}

function evaluateQuery(query: string) {
  if (query.includes('prefers-color-scheme: dark')) {
    return window.__mockPrefersDark ?? false;
  }

  const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
  if (maxWidthMatch) {
    return window.innerWidth <= Number(maxWidthMatch[1]);
  }

  const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
  if (minWidthMatch) {
    return window.innerWidth >= Number(minWidthMatch[1]);
  }

  return false;
}

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: vi.fn().mockImplementation((query: string) => {
    const listeners = new Set<MatchMediaListener>();

    return {
      matches: evaluateQuery(query),
      media: query,
      onchange: null,
      addEventListener: (_: 'change', listener: MatchMediaListener) => {
        listeners.add(listener);
      },
      removeEventListener: (_: 'change', listener: MatchMediaListener) => {
        listeners.delete(listener);
      },
      addListener: (listener: MatchMediaListener) => {
        listeners.add(listener);
      },
      removeListener: (listener: MatchMediaListener) => {
        listeners.delete(listener);
      },
      dispatchEvent: (event: MediaQueryListEvent) => {
        listeners.forEach((listener) => {
          listener(event);
        });
        return true;
      },
    };
  }),
});

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.className = '';
  document.documentElement.style.colorScheme = '';
  window.__mockPrefersDark = false;
});
