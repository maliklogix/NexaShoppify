'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppStore } from '@/store/appStore'
import { Menu, Bell, Search, RefreshCw, ChevronDown, LogOut } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard', analytics: 'Analytics', orders: 'Orders',
  products: 'Products', customers: 'Customers', discounts: 'Discounts',
  automations: 'Automations', webhooks: 'Webhooks', ai: 'AI Assistant',
  csr: 'CSR Support Center', users: 'User Management', notifications: 'Notifications', settings: 'Settings & API Keys',
}

export default function Header() {
  const router = useRouter()
  const { user, sidebarOpen, setSidebarOpen, activePage, notifications, markAllRead, logout } = useAppStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (user?.id && user.id !== 'fallback-admin-id') {
      try { await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) }) } catch (_) {}
    }
    logout()
    setShowUserMenu(false)
    router.push('/login')
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1500)
  }

  const typeColor: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    inventory: 'bg-amber-100 text-amber-600',
    automation: 'bg-shopify-100 text-shopify-600',
    csr: 'bg-red-100 text-red-600',
    ai: 'bg-purple-100 text-purple-600',
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 sticky top-0 z-20">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-ghost p-1.5">
        <Menu size={18} />
      </button>

      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-900">{PAGE_TITLES[activePage] || 'NexaShoppify'}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 w-56 cursor-pointer hover:bg-white hover:border-gray-300 transition-all">
        <Search size={14} />
        <span>Search anything...</span>
        <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-mono">⌘K</span>
      </div>

      {/* Sync */}
      <button onClick={handleSync} className={`btn btn-secondary text-xs px-3 py-1.5 ${syncing ? 'opacity-70' : ''}`}>
        <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
        {syncing ? 'Syncing...' : 'Sync'}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) markAllRead() }}
          className="btn btn-ghost p-2 relative">
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-xl shadow-modal z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold">Notifications</span>
              <span className="text-xs text-gray-400">{notifications.length} total</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-shopify-50/30' : ''}`}>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${typeColor[n.type]}`}>{n.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800">{n.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="relative" ref={userMenuRef}>
        <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <div className="w-7 h-7 rounded-full bg-shopify-400 flex items-center justify-center text-white text-xs font-bold">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.username ?? 'User'}</span>
          <ChevronDown size={12} className="text-gray-400" />
        </button>
        {showUserMenu && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-modal z-50 py-1">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-800 truncate">{user?.username}</p>
              <p className="text-[10px] text-gray-500">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
