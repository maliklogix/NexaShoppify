import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: string
}

interface AppState {
  // Authentication State
  isAuthenticated: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
  
  // Dashboard Settings
  isSidebarOpen: boolean
  toggleSidebar: () => void
  
  // App Theme
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth Default State
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      
      // UI State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Theme State
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'nexashoppify-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for simple auth persistence
    }
  )
)
