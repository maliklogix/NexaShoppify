'use client'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { REVENUE_DATA, MONTHLY_DATA } from '@/lib/shopify'
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react'

const CONVERSION = [
  { step: 'Visitors', value: 12400 }, { step: 'Product views', value: 8200 },
  { step: 'Add to cart', value: 3100 }, { step: 'Checkout', value: 1800 }, { step: 'Purchased', value: 1240 },
]
const DEVICE = [
  { name: 'Mobile', value: 54, color: '#96bf48' },
  { name: 'Desktop', value: 34, color: '#378ADD' },
  { name: 'Tablet', value: 12, color: '#EF9F27' },
]
const COUNTRY = [
  { country: 'United States', orders: 210, revenue: 18400 },
  { country: 'United Kingdom', orders: 89, revenue: 7800 },
  { country: 'Japan', orders: 67, revenue: 6200 },
  { country: 'India', orders: 54, revenue: 4100 },
  { country: 'Germany', orders: 43, revenue: 3900 },
]

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="page-header">
        <div><h2 className="text-lg font-bold text-gray-900">Analytics</h2><p className="text-xs text-gray-500">Store performance insights and trends</p></div>
        <div className="flex gap-1.5">
          {['7D', '30D', '90D', '1Y'].map(d => (
            <button key={d} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${d === '7D' ? 'bg-shopify-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$31,821', delta: '+18.2%', icon: DollarSign, up: true },
          { label: 'Total Orders', value: '272', delta: '+11.4%', icon: ShoppingBag, up: true },
          { label: 'New Customers', value: '148', delta: '+24.1%', icon: Users, up: true },
          { label: 'Avg Order Value', value: '$117', delta: '+6.3%', icon: TrendingUp, up: true },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <s.icon size={15} className="text-gray-400" />
              <span className={`text-xs font-semibold ${s.up ? 'text-shopify-600' : 'text-red-500'}`}>{s.delta}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="section-title">Daily Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#96bf48" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#96bf48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#96bf48" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="section-title">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#96bf48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversion funnel */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="section-title">Conversion Funnel</h3>
          <div className="space-y-3">
            {CONVERSION.map((s, i) => {
              const pct = Math.round((s.value / CONVERSION[0].value) * 100)
              return (
                <div key={s.step}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{s.step}</span>
                    <span className="text-gray-800 font-bold">{s.value.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-shopify-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Device split */}
        <div className="card p-5">
          <h3 className="section-title">Device Split</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={DEVICE} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                {DEVICE.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DEVICE.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top countries */}
      <div className="card p-5">
        <h3 className="section-title">Top Countries by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="table-th">Country</th>
              <th className="table-th">Orders</th>
              <th className="table-th">Revenue</th>
              <th className="table-th">Share</th>
            </tr></thead>
            <tbody>
              {COUNTRY.map(c => {
                const totalRev = COUNTRY.reduce((s, x) => s + x.revenue, 0)
                const pct = Math.round((c.revenue / totalRev) * 100)
                return (
                  <tr key={c.country} className="table-row">
                    <td className="table-td font-medium">{c.country}</td>
                    <td className="table-td">{c.orders}</td>
                    <td className="table-td font-bold">${c.revenue.toLocaleString()}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-shopify-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
