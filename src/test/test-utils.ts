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
