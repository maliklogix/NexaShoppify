'use client'
import { useState } from 'react'
import { Bot, Send, Sparkles, BarChart3, ShoppingBag, Users, TrendingUp, RefreshCw, Copy, CheckCheck } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { generateAISummary } from '@/lib/shopify'

function logChatToBackend(userId: string, role: 'user' | 'assistant', content: string) {
  if (userId && userId !== 'fallback-admin-id') {
    fetch('/api/logs/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role, content }),
    }).catch(() => {})
  }
}

const QUICK_PROMPTS = [
  { icon: BarChart3, label: 'Summarize today\'s store performance', color: 'bg-shopify-50 text-shopify-600' },
  { icon: ShoppingBag, label: 'List top 5 products this week', color: 'bg-blue-50 text-blue-600' },
  { icon: Users, label: 'Identify at-risk customers', color: 'bg-amber-50 text-amber-600' },
  { icon: TrendingUp, label: 'Revenue forecast for next 7 days', color: 'bg-purple-50 text-purple-600' },
]

interface Message { role: 'user' | 'assistant'; content: string; time: string }

export default function AIPage() {
  const { user, apiSettings } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hello! I'm your NexaShoppify AI assistant powered by ${apiSettings.activeAIProvider === 'openai' ? 'OpenAI GPT-4o' : 'Mistral AI'}.\n\nI can help you:\n• Summarize your store performance\n• Analyze customer behavior\n• Suggest automation improvements\n• Answer questions about your orders, products & more\n\nHow can I help you today?`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const provider = apiSettings.activeAIProvider
  const hasKey = provider === 'openai' ? !!apiSettings.openaiApiKey : !!apiSettings.mistralApiKey

  const sendMessage = async (text?: string) => {
    const msg = text || input
    if (!msg.trim()) return
    setInput('')
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { role: 'user', content: msg, time }])
    logChatToBackend(user?.id ?? '', 'user', msg)
    setLoading(true)

    let reply = ''
    if (hasKey) {
      try {
        reply = await generateAISummary(
          `You are a Shopify store assistant. Answer this concisely: ${msg}`,
          { provider, openaiKey: apiSettings.openaiApiKey, mistralKey: apiSettings.mistralApiKey, openaiModel: apiSettings.openaiModel, mistralModel: apiSettings.mistralModel }
        ) || ''
      } catch { reply = '' }
    }

    if (!reply) {
      // Demo response
      const demos: Record<string, string> = {
        'summarize': '📊 **Today\'s Store Summary**\n\n• Revenue: $4,821 (+12.4% vs yesterday)\n• Orders: 47 (23 unfulfilled)\n• Top product: Classic Hoodie (8 sold)\n• Cart recovery rate: 28%\n• 3 open support tickets need attention\n\nOverall a strong day! Classic Hoodie inventory is critically low (8 units) — consider restocking.',
        'customer': '👥 **At-Risk Customers**\n\n1. Luca R. — Last purchase 45 days ago, only 2 orders total\n2. Maria G. — Cancelled last order, hasn\'t returned\n3. Omar B. — Single purchase, no repeat activity\n\nRecommendation: Trigger a win-back automation with a 15% discount code for these customers.',
        'revenue': '📈 **Revenue Forecast (Next 7 Days)**\n\nBased on current trends:\n• Mon: ~$3,800 | Tue: ~$4,100\n• Wed: ~$4,500 | Thu: ~$5,200\n• Fri: ~$4,800 | Sat: ~$6,500 | Sun: ~$5,100\n\nEstimated weekly total: **~$34,000**\nTrend: +8.2% vs last week',
      }
      const key = Object.keys(demos).find(k => msg.toLowerCase().includes(k))
      reply = key ? demos[key] : `I'm ready to help! To enable live AI responses, please add your ${provider === 'openai' ? 'OpenAI' : 'Mistral'} API key in **Settings → AI Settings**.\n\nFor now, I can provide demo responses. Try asking about:\n• Store performance summary\n• Customer analysis\n• Revenue forecast`
    }

    const assistantTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { role: 'assistant', content: reply, time: assistantTime }])
    logChatToBackend(user?.id ?? '', 'assistant', reply)
    setLoading(false)
  }

  const copyMsg = (i: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="page-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
          <p className="text-xs text-gray-500">Powered by {provider === 'openai' ? `OpenAI ${apiSettings.openaiModel}` : `Mistral ${apiSettings.mistralModel}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${hasKey ? 'badge-green' : 'badge-amber'}`}>
            <Sparkles size={10} />
            {hasKey ? `${provider === 'openai' ? 'OpenAI' : 'Mistral'} Connected` : 'API Key Required'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Quick prompts */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quick Actions</h3>
          {QUICK_PROMPTS.map(p => (
            <button key={p.label} onClick={() => sendMessage(p.label)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-shopify-300 hover:bg-shopify-50/50 transition-all text-left`}>
              <span className={`p-1.5 rounded-lg flex-shrink-0 ${p.color}`}><p.icon size={14} /></span>
              <span className="text-xs text-gray-700 leading-snug">{p.label}</span>
            </button>
          ))}

          <div className="card p-4 mt-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">AI Provider</div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${provider === 'openai' ? 'bg-shopify-50 border border-shopify-200' : 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full ${provider === 'openai' && hasKey ? 'bg-shopify-400' : 'bg-gray-300'}`} />
                <span className="font-medium">OpenAI GPT-4o</span>
                {provider === 'openai' && <span className="ml-auto badge badge-green text-[9px]">Active</span>}
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${provider === 'mistral' ? 'bg-shopify-50 border border-shopify-200' : 'bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full ${provider === 'mistral' && hasKey ? 'bg-shopify-400' : 'bg-gray-300'}`} />
                <span className="font-medium">Mistral Large</span>
                {provider === 'mistral' && <span className="ml-auto badge badge-green text-[9px]">Active</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="card flex flex-col lg:col-span-3 overflow-hidden" style={{ height: '580px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-shopify-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`group relative max-w-lg ${m.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                  <div className="flex items-center justify-between mt-1.5 gap-3">
                    <span className={`text-[10px] ${m.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{m.time}</span>
                    {m.role === 'assistant' && (
                      <button onClick={() => copyMsg(i, m.content)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {copied === i ? <CheckCheck size={11} className="text-shopify-500" /> : <Copy size={11} className="text-gray-400" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-shopify-400 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="ai-bubble-bot flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Ask anything about your store... (${provider === 'openai' ? 'GPT-4o' : 'Mistral'})`}
              className="input flex-1 text-sm" />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="btn btn-primary px-3">
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
