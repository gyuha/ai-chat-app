import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/providers/theme-provider';
import { useUiStore } from '@/stores/ui-store';
import { resetUiStore, setPrefersDark } from '@/test/test-utils';

describe('ThemeProvider', () => {
  beforeEach(() => {
    resetUiStore();
    setPrefersDark(false);
  });

  it('defaults to dark theme and persists the preference', async () => {
    render(
      <ThemeProvider>
        <div>theme target</div>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    expect(localStorage.getItem('openrouter-chat-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('resolves system preference from localStorage when configured', async () => {
    localStorage.setItem('openrouter-chat-theme', 'system');
    setPrefersDark(false);

    render(
      <ThemeProvider>
        <div>theme target</div>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(useUiStore.getState().themePreference).toBe('system');
      expect(useUiStore.getState().resolvedTheme).toBe('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
