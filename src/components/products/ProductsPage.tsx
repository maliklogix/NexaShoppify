'use client'
import { useState } from 'react'
import { Search, Plus, Download, Package, AlertTriangle, TrendingUp, Edit2, Trash2, Eye } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/shopify'

const STATUS_BADGE: Record<string, string> = {
  active: 'badge-green', low_stock: 'badge-amber', out_of_stock: 'badge-red',
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = MOCK_PRODUCTS.filter(p =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header">
        <div><h2 className="text-lg font-bold text-gray-900">Products</h2><p className="text-xs text-gray-500">Manage your product catalog and inventory</p></div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-xs"><Download size={13} /> Export</button>
          <button className="btn btn-primary text-xs"><Plus size={13} /> Add Product</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: MOCK_PRODUCTS.length, icon: Package, color: 'text-blue-600 bg-blue-50' },
          { label: 'Low Stock', value: MOCK_PRODUCTS.filter(p => p.status === 'low_stock').length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Out of Stock', value: MOCK_PRODUCTS.filter(p => p.status === 'out_of_stock').length, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <span className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={18} /></span>
            <div><div className="text-2xl font-bold text-gray-900">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px]">
          <Search size={13} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent text-sm outline-none flex-1" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'active', 'low_stock', 'out_of_stock'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-shopify-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Product', 'SKU', 'Price', 'Inventory', 'Sold', 'Revenue', 'Category', 'Status', 'Actions'].map(h =>
                <th key={h} className="table-th">{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="table-row">
                <td className="table-td font-semibold text-gray-800">{p.title}</td>
                <td className="table-td font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="table-td font-bold">${p.price.toFixed(2)}</td>
                <td className="table-td">
                  <span className={`font-bold ${p.inventory === 0 ? 'text-red-600' : p.inventory < 10 ? 'text-amber-600' : 'text-shopify-600'}`}>
                    {p.inventory}
                  </span>
                </td>
                <td className="table-td text-gray-600">{p.sold}</td>
                <td className="table-td font-semibold text-gray-800">${p.revenue.toLocaleString()}</td>
                <td className="table-td"><span className="badge badge-gray">{p.category}</span></td>
                <td className="table-td"><span className={`badge ${STATUS_BADGE[p.status] || 'badge-gray'}`}>{p.status.replace('_', ' ')}</span></td>
                <td className="table-td">
                  <div className="flex gap-1">
                    <button className="btn btn-ghost p-1.5 rounded"><Eye size={13} /></button>
                    <button className="btn btn-ghost p-1.5 rounded"><Edit2 size={13} /></button>
                    <button className="btn btn-ghost p-1.5 rounded text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
