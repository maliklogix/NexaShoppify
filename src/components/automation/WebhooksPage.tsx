'use client'
import { useState } from 'react'
import { Webhook, Plus, Trash2, CheckCircle, XCircle, Clock, Copy, RefreshCw } from 'lucide-react'

const INITIAL_WEBHOOKS = [
  { id: 'wh1', topic: 'orders/create', url: '/webhooks/orders/create', status: 'active', lastTriggered: '2m ago', deliveries: 847, failures: 2 },
  { id: 'wh2', topic: 'orders/updated', url: '/webhooks/orders/updated', status: 'active', lastTriggered: '5m ago', deliveries: 412, failures: 0 },
  { id: 'wh3', topic: 'inventory_levels/update', url: '/webhooks/inventory/update', status: 'active', lastTriggered: '11m ago', deliveries: 124, failures: 1 },
  { id: 'wh4', topic: 'customers/create', url: '/webhooks/customers/create', status: 'active', lastTriggered: '34m ago', deliveries: 208, failures: 0 },
  { id: 'wh5', topic: 'products/update', url: '/webhooks/products/update', status: 'inactive', lastTriggered: '2h ago', deliveries: 56, failures: 8 },
  { id: 'wh6', topic: 'refunds/create', url: '/webhooks/refunds/create', status: 'active', lastTriggered: '1d ago', deliveries: 14, failures: 0 },
]

const LOGS = [
  { id: 'l1', topic: 'orders/create', status: 200, time: '14:22:01', payload: '{"id":5042,"total_price":"129.00"}' },
  { id: 'l2', topic: 'inventory_levels/update', status: 200, time: '14:11:44', payload: '{"inventory_item_id":12,"available":8}' },
  { id: 'l3', topic: 'customers/create', status: 500, time: '13:58:12', payload: '{"id":9901,"email":"new@email.com"}' },
  { id: 'l4', topic: 'orders/updated', status: 200, time: '13:45:30', payload: '{"id":5041,"fulfillment_status":"fulfilled"}' },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const remove = (id: string) => setWebhooks(w => w.filter(x => x.id !== id))

  return (
    <div className="animate-fade-in space-y-5">
      <div className="page-header">
        <div><h2 className="text-lg font-bold text-gray-900">Webhooks</h2><p className="text-xs text-gray-500">Monitor and manage Shopify webhook endpoints</p></div>
        <button className="btn btn-primary text-xs"><Plus size={13} /> Register Webhook</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Webhooks', value: webhooks.filter(w => w.status === 'active').length, color: 'text-shopify-600 bg-shopify-50', icon: Webhook },
          { label: 'Total Deliveries', value: webhooks.reduce((s, w) => s + w.deliveries, 0).toLocaleString(), color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
          { label: 'Total Failures', value: webhooks.reduce((s, w) => s + w.failures, 0), color: 'text-red-600 bg-red-50', icon: XCircle },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <span className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={18} /></span>
            <div><div className="text-2xl font-bold text-gray-900">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Registered Webhooks</span>
          <button className="btn btn-ghost text-xs p-1.5"><RefreshCw size={13} /></button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Topic', 'Endpoint URL', 'Status', 'Last Triggered', 'Deliveries', 'Failures', 'Actions'].map(h =>
                <th key={h} className="table-th">{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {webhooks.map(w => (
              <tr key={w.id} className="table-row">
                <td className="table-td font-mono text-xs font-semibold text-gray-700">{w.topic}</td>
                <td className="table-td">
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{w.url}</code>
                    <button onClick={() => copy(w.url, w.id)} className="text-gray-400 hover:text-gray-600">
                      {copied === w.id ? <CheckCircle size={12} className="text-shopify-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                </td>
                <td className="table-td">
                  <span className={`badge ${w.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${w.status === 'active' ? 'bg-shopify-500' : 'bg-gray-400'}`} />
                    {w.status}
                  </span>
                </td>
                <td className="table-td text-xs text-gray-500 flex items-center gap-1"><Clock size={11} />{w.lastTriggered}</td>
                <td className="table-td text-center font-medium text-shopify-600">{w.deliveries}</td>
                <td className="table-td text-center font-medium text-red-500">{w.failures}</td>
                <td className="table-td">
                  <button onClick={() => remove(w.id)} className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 rounded"><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delivery logs */}
      <div className="card p-5">
        <h3 className="section-title">Recent Delivery Logs</h3>
        <div className="space-y-2">
          {LOGS.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl font-mono text-xs">
              <span className={`badge flex-shrink-0 ${l.status === 200 ? 'badge-green' : 'badge-red'}`}>{l.status}</span>
              <span className="text-gray-500">{l.time}</span>
              <span className="font-semibold text-gray-700">{l.topic}</span>
              <span className="text-gray-400 truncate flex-1">{l.payload}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
