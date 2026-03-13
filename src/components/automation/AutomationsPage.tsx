'use client'
import { useState } from 'react'
import { Zap, Plus, Play, Pause, Trash2, Edit2, CheckCircle, Clock, Mail, MessageSquare, Tag, AlertTriangle, Star, ShoppingCart } from 'lucide-react'

interface Automation {
  id: string; name: string; trigger: string; action: string
  runs: number; active: boolean; lastRun: string; successRate: number
  icon: any; color: string; category: string
}

const INITIAL: Automation[] = [
  { id: 'a1', name: 'Abandoned Cart Recovery', trigger: '1h after cart abandoned', action: 'Send recovery email', runs: 847, active: true, lastRun: '2m ago', successRate: 28, icon: ShoppingCart, color: 'bg-shopify-50 text-shopify-600', category: 'Email' },
  { id: 'a2', name: 'Post-Purchase Thank You SMS', trigger: 'Order paid', action: 'Send SMS + upsell offer', runs: 392, active: true, lastRun: '5m ago', successRate: 72, icon: MessageSquare, color: 'bg-blue-50 text-blue-600', category: 'SMS' },
  { id: 'a3', name: 'Low Stock Alert', trigger: 'Inventory ≤ 10 units', action: 'Notify admin via Slack + email', runs: 124, active: true, lastRun: '11m ago', successRate: 100, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600', category: 'Alert' },
  { id: 'a4', name: 'Review Request Email', trigger: '5 days after delivery', action: 'Send review request email', runs: 211, active: false, lastRun: '2h ago', successRate: 41, icon: Star, color: 'bg-red-50 text-red-600', category: 'Email' },
  { id: 'a5', name: 'VIP Customer Tag', trigger: 'Customer completes 3+ orders', action: 'Tag as VIP + send coupon', runs: 58, active: true, lastRun: '18m ago', successRate: 100, icon: Tag, color: 'bg-purple-50 text-purple-600', category: 'Tagging' },
  { id: 'a6', name: 'Win-Back Campaign', trigger: '60 days no purchase', action: 'Send win-back email series', runs: 33, active: false, lastRun: '1d ago', successRate: 15, icon: Mail, color: 'bg-teal-50 text-teal-600', category: 'Email' },
]

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(INITIAL)
  const [filter, setFilter] = useState('all')

  const toggle = (id: string) => setAutomations(a => a.map(x => x.id === id ? { ...x, active: !x.active } : x))
  const remove = (id: string) => setAutomations(a => a.filter(x => x.id !== id))

  const filtered = automations.filter(a => filter === 'all' || (filter === 'active' ? a.active : !a.active))
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0)
  const activeCount = automations.filter(a => a.active).length

  return (
    <div className="animate-fade-in space-y-5">
      <div className="page-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Automations</h2>
          <p className="text-xs text-gray-500">Automate your store workflows and customer journeys</p>
        </div>
        <button className="btn btn-primary text-xs"><Plus size={13} /> New Automation</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total automations', value: automations.length, icon: Zap, color: 'text-shopify-600 bg-shopify-50' },
          { label: 'Active', value: activeCount, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Total runs today', value: totalRuns.toLocaleString(), icon: Play, color: 'text-blue-600 bg-blue-50' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <span className={`p-3 rounded-xl ${s.color}`}><s.icon size={20} /></span>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'inactive'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-shopify-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Automation cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(a => {
          const Icon = a.icon
          return (
            <div key={a.id} className={`card p-5 transition-all ${a.active ? '' : 'opacity-60'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${a.color}`}><Icon size={18} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{a.name}</span>
                    <span className="badge badge-gray text-[9px]">{a.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    <span className="font-medium text-gray-600">Trigger:</span> {a.trigger}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Action:</span> {a.action}
                  </div>
                </div>

                {/* Toggle */}
                <button onClick={() => toggle(a.id)} className={`toggle flex-shrink-0 ${a.active ? 'toggle-on' : 'toggle-off'}`}>
                  <span className={`toggle-dot ${a.active ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{a.runs.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400">Total runs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-shopify-600">{a.successRate}%</div>
                  <div className="text-[10px] text-gray-400">Success rate</div>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-shopify-400 rounded-full" style={{ width: `${a.successRate}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock size={10} /> {a.lastRun}
                </div>
                <div className="flex gap-1">
                  <button className="btn btn-ghost p-1 rounded text-gray-400"><Edit2 size={12} /></button>
                  <button onClick={() => remove(a.id)} className="btn btn-ghost p-1 rounded text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
