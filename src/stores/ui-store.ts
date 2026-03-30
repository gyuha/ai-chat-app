import { create } from "zustand"

interface UIState {
  // Sidebar visibility (mobile)
  sidebarOpen: boolean
  // Current active conversation ID
  currentConversationId: number | null

  // Actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setCurrentConversation: (id: number | null) => void
  closeSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentConversationId: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setCurrentConversation: (id) =>
    set({ currentConversationId: id, sidebarOpen: false }),

  closeSidebar: () => set({ sidebarOpen: false }),
}))