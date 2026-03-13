'use client'
import { useState } from 'react'
import { Tag, Plus, Copy, CheckCircle, Trash2, RefreshCw } from 'lucide-react'

const DISCOUNTS = [
  { id: 'd1', code: 'WELCOME15', type: 'percentage', value: 15, used: 124, limit: 500, expires: '2026-06-01', status: 'active' },
  { id: 'd2', code: 'VIPONLY30', type: 'percentage', value: 30, used: 34, limit: 100, expires: '2026-04-30', status: 'active' },
  { id: 'd3', code: 'SAVE10', type: 'fixed', value: 10, used: 280, limit: null, expires: null, status: 'active' },
  { id: 'd4', code: 'SUMMER2025', type: 'percentage', value: 20, used: 500, limit: 500, expires: '2025-09-01', status: 'expired' },
]

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState(DISCOUNTS)
  const [copied, setCopied] = useState<string | null>(null)
  const [newCode, setNewCode] = useState('')
  const [newVal, setNewVal] = useState('')
  const [newType, setNewType] = useState('percentage')

  const copy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    setNewCode(Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
  }

  const create = () => {
    if (!newCode || !newVal) return
    setDiscounts(d => [...d, {
      id: `d${Date.now()}`, code: newCode.toUpperCase(), type: newType as any,
      value: Number(newVal), used: 0, limit: null, expires: null, status: 'active',
    }])
    setNewCode(''); setNewVal('')
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header">
        <div><h2 className="text-lg font-bold text-gray-900">Discounts</h2><p className="text-xs text-gray-500">Create and manage discount codes for your store</p></div>
      </div>

      {/* Create new */}
      <div className="card p-5">
        <h3 className="section-title">Create Discount Code</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="label">Code</label>
            <div className="flex gap-2">
              <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="MYCODE10" className="input font-mono uppercase" />
              <button onClick={generate} className="btn btn-secondary px-2" title="Generate"><RefreshCw size={13} /></button>
            </div>
          </div>
          <div>
            <label className="label">Type</label>
            <select value={newType} onChange={e => setNewType(e.target.value)} className="input w-36">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ($)</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
          </div>
          <div className="w-28">
            <label className="label">Value</label>
            <input value={newVal} onChange={e => setNewVal(e.target.value)} type="number" placeholder="15" className="input" />
          </div>
          <button onClick={create} className="btn btn-primary text-xs"><Plus size={13} /> Create Code</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['Code', 'Type', 'Value', 'Usage', 'Expires', 'Status', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="table-row">
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{d.code}</code>
                    <button onClick={() => copy(d.code)} className="text-gray-400 hover:text-gray-600">
                      {copied === d.code ? <CheckCircle size={12} className="text-shopify-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                </td>
                <td className="table-td"><span className="badge badge-blue">{d.type}</span></td>
                <td className="table-td font-bold">{d.type === 'percentage' ? `${d.value}%` : d.type === 'fixed' ? `$${d.value}` : 'Free'}</td>
                <td className="table-td">
                  <div className="flex items-center gap-2 text-xs">
                    <span>{d.used}{d.limit ? `/${d.limit}` : ''} used</span>
                    {d.limit && <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-shopify-400 rounded-full" style={{ width: `${Math.min(100, (d.used / d.limit) * 100)}%` }} /></div>}
                  </div>
                </td>
                <td className="table-td text-xs text-gray-500">{d.expires || '—'}</td>
                <td className="table-td"><span className={`badge ${d.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{d.status}</span></td>
                <td className="table-td"><button onClick={() => setDiscounts(x => x.filter(i => i.id !== d.id))} className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 rounded"><Trash2 size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
