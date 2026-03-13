'use client'
import { useState } from 'react'
import { Search, Download, Users, Star, TrendingDown, UserPlus } from 'lucide-react'
import { MOCK_CUSTOMERS } from '@/lib/shopify'

const TAG_BADGE: Record<string, string> = { VIP: 'badge-purple', Regular: 'badge-blue', New: 'badge-green', 'At Risk': 'badge-red' }
const STATUS_BADGE: Record<string, string> = { active: 'badge-green', at_risk: 'badge-amber' }

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header">
        <div><h2 className="text-lg font-bold text-gray-900">Customers</h2><p className="text-xs text-gray-500">Manage your customer base</p></div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-xs"><Download size={13}/> Export</button>
          <button className="btn btn-primary text-xs"><UserPlus size={13}/> Add Customer</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: '1,248', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'VIP Customers', value: '3', icon: Star, color: 'text-purple-600 bg-purple-50' },
          { label: 'At Risk', value: '1', icon: TrendingDown, color: 'text-red-600 bg-red-50' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <span className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={18}/></span>
            <div><div className="text-2xl font-bold text-gray-900">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="card p-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Search size={13} className="text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="bg-transparent text-sm outline-none flex-1"/>
        </div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Customer','Email','Orders','Total Spent','Tag','Status','Joined','Location'].map(h => <th key={h} className="table-th">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="table-row">
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-shopify-100 flex items-center justify-center text-shopify-600 text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className="font-medium text-gray-800">{c.name}</span>
                  </div>
                </td>
                <td className="table-td text-xs text-gray-500">{c.email}</td>
                <td className="table-td text-center font-medium">{c.orders}</td>
                <td className="table-td font-bold text-gray-900">${c.spent.toLocaleString()}</td>
                <td className="table-td"><span className={`badge ${TAG_BADGE[c.tag] || 'badge-gray'}`}>{c.tag}</span></td>
                <td className="table-td"><span className={`badge ${STATUS_BADGE[c.status] || 'badge-gray'}`}>{c.status.replace('_',' ')}</span></td>
                <td className="table-td text-xs text-gray-500">{c.joinDate}</td>
                <td className="table-td text-xs text-gray-500">{c.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
