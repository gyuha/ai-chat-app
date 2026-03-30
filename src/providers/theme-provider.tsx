import {
  type PropsWithChildren,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react';

import {
  selectResolvedTheme,
  selectThemePreference,
  useUiStore,
} from '@/stores/ui-store';

const STORAGE_KEY = 'openrouter-chat-theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function isThemePreference(
  value: string | null,
): value is 'dark' | 'light' | 'system' {
  return value === 'dark' || value === 'light' || value === 'system';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const themePreference = useUiStore(selectThemePreference);
  const resolvedTheme = useUiStore(selectResolvedTheme);
  const setResolvedTheme = useUiStore((state) => state.setResolvedTheme);
  const setThemePreference = useUiStore((state) => state.setThemePreference);
  const initializedRef = useRef(false);

  const applyResolvedTheme = useEffectEvent((theme: 'dark' | 'light') => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  });

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const storedPreference = window.localStorage.getItem(STORAGE_KEY);

    if (isThemePreference(storedPreference)) {
      setThemePreference(storedPreference);
      return;
    }

    setThemePreference('dark');
  }, [setThemePreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const updateResolvedTheme = () => {
      const nextTheme =
        themePreference === 'system'
          ? mediaQuery.matches
            ? 'dark'
            : 'light'
          : themePreference;

      setResolvedTheme(nextTheme);
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateResolvedTheme);
    };
  }, [setResolvedTheme, themePreference]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  return children;
}
