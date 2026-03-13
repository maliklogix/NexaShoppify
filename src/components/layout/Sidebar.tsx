'use client'
import { useAppStore } from '@/store/appStore'
import {
  LayoutDashboard, ShoppingBag, Users, Package, Zap, MessageSquare,
  Settings, BarChart3, Bell, Tag, Webhook, Bot, ChevronLeft, Store, Shield
} from 'lucide-react'

const NAV = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'Store' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '23' },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'discounts', label: 'Discounts', icon: Tag },
  { section: 'Automation' },
  { id: 'automations', label: 'Automations', icon: Zap, badge: '5' },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { section: 'AI & Support' },
  { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'csr', label: 'CSR Support', icon: MessageSquare, badge: '3' },
  { section: 'System' },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings & API', icon: Settings },
]

export default function Sidebar() {
  const { sidebarOpen, activePage, setActivePage, setSidebarOpen, notifications } = useAppStore()
  const unread = notifications.filter(n => !n.read).length

  if (!sidebarOpen) return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-1 z-30">
      <div className="w-9 h-9 bg-shopify-400 rounded-lg flex items-center justify-center mb-3 cursor-pointer" onClick={() => setSidebarOpen(true)}>
        <Store className="w-5 h-5 text-white" />
      </div>
      {NAV.filter(n => n.id).map(n => {
        const Icon = (n as any).icon
        if (!Icon) return null
        return (
          <button key={n.id} onClick={() => setActivePage(n.id!)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${activePage === n.id ? 'bg-shopify-50 text-shopify-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
            title={n.label}>
            <Icon className="w-4.5 h-4.5" size={18} />
          </button>
        )
      })}
    </div>
  )

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-gray-200 flex flex-col z-30 animate-slide-in">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-shopify-400 rounded-lg flex items-center justify-center">
            <Store className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">NexaShoppify</div>
            <div className="text-xs text-gray-400">Automation Dashboard</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded">
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1.5">{item.section}</div>
          )
          const Icon = (item as any).icon
          const badgeVal = item.id === 'notifications' ? (unread > 0 ? String(unread) : undefined) : item.badge
          return (
            <button key={item.id} onClick={() => setActivePage(item.id!)}
              className={`w-full sidebar-link ${activePage === item.id ? 'active' : ''}`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {badgeVal && (
                <span className="bg-shopify-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badgeVal}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 p-2.5 bg-shopify-50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-shopify-400 animate-pulse-green flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-shopify-700 truncate">Store Connected</div>
            <div className="text-[10px] text-shopify-500 truncate">mystore.myshopify.com</div>
          </div>
          <Shield size={13} className="text-shopify-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
