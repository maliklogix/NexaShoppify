'use client'
import { useAppStore } from '@/store/appStore'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import DashboardPage from '@/components/dashboard/DashboardPage'
import OrdersPage from '@/components/orders/OrdersPage'
import ProductsPage from '@/components/products/ProductsPage'
import CustomersPage from '@/components/customers/CustomersPage'
import AutomationsPage from '@/components/automation/AutomationsPage'
import WebhooksPage from '@/components/automation/WebhooksPage'
import AIPage from '@/components/ai/AIPage'
import CSRPage from '@/components/csr/CSRPage'
import SettingsPage from '@/components/settings/SettingsPage'
import AnalyticsPage from '@/components/analytics/AnalyticsPage'
import DiscountsPage from '@/components/dashboard/DiscountsPage'
import Head from 'next/head'

const PAGE_MAP: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  analytics: AnalyticsPage,
  orders: OrdersPage,
  products: ProductsPage,
  customers: CustomersPage,
  discounts: DiscountsPage,
  automations: AutomationsPage,
  webhooks: WebhooksPage,
  ai: AIPage,
  csr: CSRPage,
  settings: SettingsPage,
  notifications: DashboardPage,
}

export default function Home() {
  const { sidebarOpen, activePage } = useAppStore()
  const PageComponent = PAGE_MAP[activePage] || DashboardPage

  return (
    <>
      <Head>
        <title>NexaShoppify — Shopify Automation Dashboard</title>
        <meta name="description" content="Professional Shopify store automation dashboard with AI, CSR support and full order management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-surface-secondary">
        <Sidebar />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-16'}`}>
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <PageComponent />
          </main>
          <footer className="px-6 py-3 border-t border-gray-100 text-center text-xs text-gray-400">
            NexaShoppify v1.0.0 · Built with Next.js, Tailwind CSS & Shopify API
          </footer>
        </div>
      </div>
    </>
  )
}
