'use client'
import { useState } from 'react'
import { MessageSquare, Search, Plus, Clock, User, CheckCircle, AlertCircle, Circle, Send, Bot, Phone, Mail, Globe } from 'lucide-react'
import { MOCK_TICKETS } from '@/lib/shopify'

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'badge-red', high: 'badge-amber', medium: 'badge-blue', low: 'badge-gray',
}
const STATUS_BADGE: Record<string, string> = {
  open: 'badge-amber', pending: 'badge-blue', resolved: 'badge-green',
}
const STATUS_ICON: Record<string, any> = {
  open: AlertCircle, pending: Clock, resolved: CheckCircle,
}

const AGENTS = [
  { name: 'Agent Maya', tickets: 8, resolved: 5, online: true },
  { name: 'Agent Alex', tickets: 6, resolved: 4, online: true },
  { name: 'Agent Jordan', tickets: 3, resolved: 3, online: false },
]

export default function CSRPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [selected, setSelected] = useState(tickets[0])
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([
    { from: 'customer', text: 'Hi, I placed order #5042 two days ago but haven\'t received any shipping confirmation. Can you help?', time: '10:22 AM' },
    { from: 'agent', text: 'Hello Sarah! Let me check the status of your order right away.', time: '10:24 AM' },
    { from: 'customer', text: 'I also tried tracking it on the website but couldn\'t find anything.', time: '10:25 AM' },
  ])
  const [filter, setFilter] = useState('all')
  const [aiSuggestion] = useState('Based on this conversation, I suggest: "Your order #5042 is currently being processed and will ship within 24 hours. You\'ll receive a tracking email shortly. We apologize for the delay."')

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMessages(m => [...m, { from: 'agent', text: chatMsg, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }])
    setChatMsg('')
  }

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter)

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">CSR Support Center</h2>
          <p className="text-xs text-gray-500">Customer service & ticket management with AI assistance</p>
        </div>
        <button className="btn btn-primary text-xs"><Plus size={13} /> New Ticket</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Open tickets', value: tickets.filter(t => t.status === 'open').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending', value: tickets.filter(t => t.status === 'pending').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Resolved today', value: tickets.filter(t => t.status === 'resolved').length, color: 'text-shopify-600', bg: 'bg-shopify-50' },
          { label: 'Avg. response', value: '4.2m', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.bg} border-0`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: '600px' }}>
        {/* Ticket list */}
        <div className="card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 flex-1">
                <Search size={12} className="text-gray-400" /><input placeholder="Search..." className="text-xs bg-transparent outline-none flex-1" />
              </div>
            </div>
            <div className="flex gap-1">
              {['all', 'open', 'pending', 'resolved'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${filter === f ? 'bg-shopify-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.map(t => {
              const SIcon = STATUS_ICON[t.status]
              return (
                <div key={t.id} onClick={() => setSelected(t)}
                  className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selected.id === t.id ? 'bg-shopify-50 border-l-2 border-l-shopify-400' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-800 line-clamp-1">{t.subject}</span>
                    <span className={`badge flex-shrink-0 text-[9px] ${PRIORITY_BADGE[t.priority]}`}>{t.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="font-medium text-gray-600">{t.customer}</span>
                    <span>·</span>
                    <span className={`badge text-[9px] ${STATUS_BADGE[t.status]}`}>{t.status}</span>
                    <span className="ml-auto">{t.created.split(' ')[1]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat */}
        <div className="card flex flex-col overflow-hidden lg:col-span-2">
          {/* Ticket header */}
          <div className="p-4 border-b border-gray-100 flex items-start justify-between">
            <div>
              <div className="font-semibold text-gray-900 text-sm">{selected.subject}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{selected.customer}</span>
                <span className="text-gray-300">·</span>
                <span className={`badge text-[9px] ${PRIORITY_BADGE[selected.priority]}`}>{selected.priority}</span>
                <span className={`badge text-[9px] ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
              </div>
            </div>
            <div className="flex gap-2 text-gray-400 text-[10px]">
              <span className="flex items-center gap-1"><Mail size={10}/>{selected.channel}</span>
              <span className="flex items-center gap-1"><User size={10}/>{selected.assigned}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div className={m.from === 'agent' ? 'ai-bubble-user' : 'ai-bubble-bot'}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === 'agent' ? 'text-white/70' : 'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestion */}
          <div className="mx-4 mb-2 p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Bot size={14} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold text-purple-700 mb-1">AI Suggested Reply</div>
                <p className="text-xs text-purple-800">{aiSuggestion}</p>
                <button onClick={() => setChatMsg(aiSuggestion)} className="mt-1.5 text-[10px] font-semibold text-purple-600 hover:underline">Use this reply</button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Type your reply..." className="input flex-1 text-xs" />
            <button onClick={sendMsg} className="btn btn-primary px-3"><Send size={14} /></button>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div className="card p-5">
        <h3 className="section-title">Support Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGENTS.map(a => (
            <div key={a.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-shopify-400 flex items-center justify-center text-white text-sm font-bold">
                  {a.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${a.online ? 'bg-shopify-400' : 'bg-gray-300'}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">{a.name}</div>
                <div className="text-xs text-gray-500">{a.tickets} tickets · {a.resolved} resolved</div>
              </div>
              <span className={`badge text-[9px] ${a.online ? 'badge-green' : 'badge-gray'}`}>{a.online ? 'Online' : 'Away'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
