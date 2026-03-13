'use client'
import { useState } from 'react'
import { Search, Filter, Download, RefreshCw, Eye, Package, XCircle, RotateCcw } from 'lucide-react'
import { MOCK_ORDERS } from '@/lib/shopify'

const STATUS_BADGE: Record<string, string> = {
  paid: 'badge-green', pending: 'badge-amber', refunded: 'badge-red',
  cancelled: 'badge-gray', processing: 'badge-blue',
}
const FULFILL_BADGE: Record<string, string> = {
  fulfilled: 'badge-green', unfulfilled: 'badge-amber', in_transit: 'badge-blue',
  returned: 'badge-red', restocked: 'badge-gray',
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [viewOrder, setViewOrder] = useState<typeof MOCK_ORDERS[0] | null>(null)

  const filtered = MOCK_ORDERS.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  )

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage and fulfill all store orders</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-xs"><Download size={13} /> Export CSV</button>
          <button className="btn btn-primary text-xs"><RefreshCw size={13} /> Sync Orders</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px]">
          <Search size={13} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'paid', 'pending', 'refunded', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-shopify-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500">{selected.length} selected</span>
            <button className="btn btn-secondary text-xs px-2 py-1"><Package size={12} /> Fulfill</button>
            <button className="btn btn-danger text-xs px-2 py-1"><XCircle size={12} /> Cancel</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="table-th w-8"><input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? filtered.map(o => o.id) : [])} /></th>
                <th className="table-th">Order</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Payment</th>
                <th className="table-th">Fulfillment</th>
                <th className="table-th">Items</th>
                <th className="table-th">Date</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className={`table-row ${selected.includes(o.id) ? 'bg-shopify-50' : ''}`}>
                  <td className="table-td"><input type="checkbox" className="rounded" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} /></td>
                  <td className="table-td font-mono text-xs font-bold text-gray-800">{o.id}</td>
                  <td className="table-td">
                    <div className="font-medium text-gray-800">{o.customer}</div>
                    <div className="text-[10px] text-gray-400">{o.email}</div>
                  </td>
                  <td className="table-td font-bold text-gray-900">${o.amount.toFixed(2)}</td>
                  <td className="table-td"><span className={`badge ${STATUS_BADGE[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                  <td className="table-td"><span className={`badge ${FULFILL_BADGE[o.fulfillment] || 'badge-gray'}`}>{o.fulfillment.replace('_', ' ')}</span></td>
                  <td className="table-td text-center">{o.items}</td>
                  <td className="table-td text-xs text-gray-500">{o.date}</td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      <button onClick={() => setViewOrder(o)} className="btn btn-ghost p-1.5 rounded" title="View"><Eye size={13} /></button>
                      <button className="btn btn-ghost p-1.5 rounded" title="Fulfill"><Package size={13} /></button>
                      <button className="btn btn-ghost p-1.5 rounded text-red-400 hover:text-red-600" title="Refund"><RotateCcw size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filtered.length} of {MOCK_ORDERS.length} orders</span>
          <div className="flex gap-1">
            <button className="btn btn-secondary px-2 py-1 text-xs">Prev</button>
            <button className="btn btn-secondary px-2 py-1 text-xs">Next</button>
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Order {viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ['Customer', viewOrder.customer], ['Email', viewOrder.email],
                ['Amount', `$${viewOrder.amount.toFixed(2)}`], ['Items', String(viewOrder.items)],
                ['Country', viewOrder.country], ['Date', viewOrder.date],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className={`badge ${STATUS_BADGE[viewOrder.status] || 'badge-gray'}`}>{viewOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fulfillment</span>
                <span className={`badge ${FULFILL_BADGE[viewOrder.fulfillment] || 'badge-gray'}`}>{viewOrder.fulfillment.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button className="btn btn-primary flex-1 text-xs"><Package size={13} /> Fulfill Order</button>
              <button className="btn btn-secondary flex-1 text-xs"><RotateCcw size={13} /> Issue Refund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
