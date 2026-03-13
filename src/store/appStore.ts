import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface APISettings {
  shopifyStoreDomain: string
  shopifyAccessToken: string
  shopifyApiKey: string
  shopifyApiSecret: string
  shopifyWebhookSecret: string
  openaiApiKey: string
  openaiModel: string
  mistralApiKey: string
  mistralModel: string
  activeAIProvider: 'openai' | 'mistral'
  slackWebhookUrl: string
  twilioAccountSid: string
  twilioAuthToken: string
  twilioFromNumber: string
  emailSmtpHost: string
  emailSmtpPort: string
  emailSmtpUser: string
  emailSmtpPass: string
}

export interface Notification {
  id: string
  type: 'order' | 'inventory' | 'automation' | 'csr' | 'ai'
  title: string
  message: string
  time: string
  read: boolean
}

interface AppState {
  sidebarOpen: boolean
  activePage: string
  apiSettings: APISettings
  notifications: Notification[]
  setSidebarOpen: (v: boolean) => void
  setActivePage: (page: string) => void
  updateAPISettings: (settings: Partial<APISettings>) => void
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void
  markAllRead: () => void
}

const defaultSettings: APISettings = {
  shopifyStoreDomain: '',
  shopifyAccessToken: '',
  shopifyApiKey: '',
  shopifyApiSecret: '',
  shopifyWebhookSecret: '',
  openaiApiKey: '',
  openaiModel: 'gpt-4o',
  mistralApiKey: '',
  mistralModel: 'mistral-large-latest',
  activeAIProvider: 'openai',
  slackWebhookUrl: '',
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioFromNumber: '',
  emailSmtpHost: '',
  emailSmtpPort: '587',
  emailSmtpUser: '',
  emailSmtpPass: '',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activePage: 'dashboard',
      apiSettings: defaultSettings,
      notifications: [
        { id: '1', type: 'order', title: 'New order #5042', message: 'Sarah K. placed $129.00 order', time: '2m ago', read: false },
        { id: '2', type: 'inventory', title: 'Low stock alert', message: 'Classic Hoodie has 8 units left', time: '11m ago', read: false },
        { id: '3', type: 'automation', title: 'Cart recovery sent', message: 'Email sent to jane@email.com', time: '18m ago', read: true },
        { id: '4', type: 'csr', title: 'New support ticket', message: 'Customer asking about return policy', time: '25m ago', read: false },
        { id: '5', type: 'ai', title: 'AI summary ready', message: 'Daily store performance report generated', time: '1h ago', read: true },
      ],
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      setActivePage: (page) => set({ activePage: page }),
      updateAPISettings: (settings) => set((s) => ({ apiSettings: { ...s.apiSettings, ...settings } })),
      addNotification: (n) => set((s) => ({
        notifications: [{ ...n, id: Date.now().toString(), time: 'just now', read: false }, ...s.notifications],
      })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
    }),
    { name: 'nexashoppify-store', partialize: (s) => ({ apiSettings: s.apiSettings }) }
  )
)
