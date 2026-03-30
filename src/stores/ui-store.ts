import { create } from 'zustand';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

type UiState = {
  mobileSidebarOpen: boolean;
  resolvedTheme: ResolvedTheme;
  themePreference: ThemePreference;
  cycleThemePreference: () => void;
  closeMobileSidebar: () => void;
  openMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  setThemePreference: (theme: ThemePreference) => void;
  toggleMobileSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  resolvedTheme: 'dark',
  themePreference: 'dark',
  cycleThemePreference: () =>
    set((state) => ({
      themePreference:
        state.themePreference === 'dark'
          ? 'light'
          : state.themePreference === 'light'
            ? 'system'
            : 'dark',
    })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
  setThemePreference: (themePreference) => set({ themePreference }),
  toggleMobileSidebar: () =>
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
}));

export const selectMobileSidebarOpen = (state: UiState) =>
  state.mobileSidebarOpen;
export const selectResolvedTheme = (state: UiState) => state.resolvedTheme;
export const selectThemePreference = (state: UiState) => state.themePreference;
