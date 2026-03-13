'use client'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, ShoppingBag, Users, Zap, DollarSign, Package, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { REVENUE_DATA, MONTHLY_DATA, MOCK_ORDERS, MOCK_PRODUCTS } from '@/lib/shopify'
import { useAppStore } from '@/store/appStore'

const STATS = [
  { label: 'Revenue today', value: '$4,821', delta: '+12.4%', up: true, icon: DollarSign, color: 'text-shopify-600 bg-shopify-50' },
  { label: 'Orders today', value: '47', delta: '+8 vs avg', up: true, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
  { label: 'Automations run', value: '183', delta: '+23/hr', up: true, icon: Zap, color: 'text-purple-600 bg-purple-50' },
  { label: 'Active customers', value: '1,248', delta: '+3.2%', up: true, icon: Users, color: 'text-teal-600 bg-teal-50' },
]

const TRAFFIC = [
  { name: 'Organic', value: 41, color: '#378ADD' },
  { name: 'Paid Ads', value: 29, color: '#96bf48' },
  { name: 'Social', value: 18, color: '#EF9F27' },
  { name: 'Direct', value: 12, color: '#B4B2A9' },
]

const STATUS_COLORS: Record<string, string> = {
  paid: 'badge-green', pending: 'badge-amber', refunded: 'badge-red',
  cancelled: 'badge-gray', processing: 'badge-blue',
}

export default function DashboardPage() {
  const { setActivePage } = useAppStore()

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <div className="live-indicator">
          <span className="pulse-dot" />
          Live store data · Updated just now
        </div>
        <span className="text-xs text-gray-400">Friday, March 13, 2026</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <span className={`p-2 rounded-lg ${s.color}`}><s.icon size={16} /></span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? 'text-shopify-600' : 'text-red-500'}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{s.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Revenue — Last 7 Days</h3>
            <button onClick={() => setActivePage('analytics')} className="text-xs text-shopify-600 hover:underline flex items-center gap-1">Full report <ArrowUpRight size={12} /></button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#96bf48" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#96bf48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#96bf48" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="section-title">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={TRAFFIC} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {TRAFFIC.map((t, i) => <Cell key={i} fill={t.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {TRAFFIC.map(t => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: t.color }} />
                  <span className="text-gray-600">{t.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Recent Orders</h3>
            <button onClick={() => setActivePage('orders')} className="text-xs text-shopify-600 hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100">
                <th className="table-th">Order</th><th className="table-th">Customer</th>
                <th className="table-th">Amount</th><th className="table-th">Status</th>
              </tr></thead>
              <tbody>
                {MOCK_ORDERS.slice(0, 5).map(o => (
                  <tr key={o.id} className="table-row">
                    <td className="table-td font-mono text-xs font-medium">{o.id}</td>
                    <td className="table-td">{o.customer}</td>
                    <td className="table-td font-semibold">${o.amount.toFixed(2)}</td>
                    <td className="table-td"><span className={STATUS_COLORS[o.status] || 'badge-gray'}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-amber-500" />
            <h3 className="section-title mb-0">Inventory Alerts</h3>
          </div>
          <div className="space-y-3">
            {MOCK_PRODUCTS.filter(p => p.status !== 'active' || p.inventory < 15).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-800">{p.title}</div>
                  <div className="text-[10px] text-gray-400">{p.sku}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${p.inventory === 0 ? 'text-red-600' : p.inventory < 10 ? 'text-amber-600' : 'text-shopify-600'}`}>{p.inventory} units</div>
                  <span className={`badge text-[9px] ${p.status === 'out_of_stock' ? 'badge-red' : 'badge-amber'}`}>{p.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly bar + Order pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="section-title">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={MONTHLY_DATA} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#96bf48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="section-title">Order Pipeline</h3>
          <div className="space-y-2">
            {[
              { label: 'Paid / Unfulfilled', count: 23, pct: 90, color: 'bg-shopify-400' },
              { label: 'Processing', count: 11, pct: 55, color: 'bg-blue-400' },
              { label: 'In Transit', count: 8, pct: 38, color: 'bg-amber-400' },
              { label: 'Delivered', count: 5, pct: 22, color: 'bg-teal-400' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
