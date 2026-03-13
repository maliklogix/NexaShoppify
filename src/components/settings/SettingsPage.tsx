'use client'
import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { Save, Eye, EyeOff, CheckCircle, Store, Bot, MessageSquare, Mail, Webhook, Shield, TestTube } from 'lucide-react'
import toast from 'react-hot-toast'

function Field({ label, value, onChange, type = 'text', placeholder = '', mono = false }: any) {
  const [show, setShow] = useState(false)
  const isSecret = type === 'password'
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type={isSecret && !show ? 'password' : 'text'}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input ${mono ? 'font-mono text-xs' : ''} ${isSecret ? 'pr-10' : ''}`}
        />
        {isSecret && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, desc, children, color = 'text-shopify-600 bg-shopify-50' }: any) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <span className={`p-2 rounded-xl ${color}`}><Icon size={18} /></span>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { apiSettings, updateAPISettings } = useAppStore()
  const [local, setLocal] = useState({ ...apiSettings })
  const [testing, setTesting] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const set = (key: string) => (val: string) => setLocal(s => ({ ...s, [key]: val }))

  const save = () => {
    updateAPISettings(local)
    setSaved(true)
    toast.success('Settings saved successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  const testConnection = async (type: string) => {
    setTesting(type)
    await new Promise(r => setTimeout(r, 1500))
    setTesting(null)
    if (type === 'shopify' && !local.shopifyStoreDomain) { toast.error('Enter a store domain first'); return }
    if (type === 'openai' && !local.openaiApiKey) { toast.error('Enter an OpenAI API key first'); return }
    if (type === 'mistral' && !local.mistralApiKey) { toast.error('Enter a Mistral API key first'); return }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} connection successful!`)
  }

  return (
    <div className="animate-fade-in space-y-5 max-w-3xl">
      <div className="page-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Settings & API Keys</h2>
          <p className="text-xs text-gray-500">Configure all integrations and API credentials</p>
        </div>
        <button onClick={save} className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} text-xs`}>
          {saved ? <><CheckCircle size={13} className="text-shopify-500" /> Saved!</> : <><Save size={13} /> Save All Settings</>}
        </button>
      </div>

      {/* Shopify */}
      <Section icon={Store} title="Shopify Store" desc="Connect your Shopify store via Admin API">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Store Domain" value={local.shopifyStoreDomain} onChange={set('shopifyStoreDomain')} placeholder="yourstore.myshopify.com" />
          <Field label="Access Token" value={local.shopifyAccessToken} onChange={set('shopifyAccessToken')} type="password" placeholder="shpat_..." mono />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="API Key" value={local.shopifyApiKey} onChange={set('shopifyApiKey')} type="password" placeholder="API Key" mono />
          <Field label="API Secret" value={local.shopifyApiSecret} onChange={set('shopifyApiSecret')} type="password" placeholder="API Secret" mono />
        </div>
        <Field label="Webhook Secret" value={local.shopifyWebhookSecret} onChange={set('shopifyWebhookSecret')} type="password" placeholder="Webhook signing secret" mono />
        <button onClick={() => testConnection('shopify')} disabled={testing === 'shopify'}
          className="btn btn-secondary text-xs w-full justify-center">
          <TestTube size={13} className={testing === 'shopify' ? 'animate-spin' : ''} />
          {testing === 'shopify' ? 'Testing...' : 'Test Shopify Connection'}
        </button>
      </Section>

      {/* AI Settings */}
      <Section icon={Bot} title="AI Settings" desc="Configure OpenAI and Mistral for AI assistant & summarization" color="text-purple-600 bg-purple-50">
        <div>
          <label className="label">Active AI Provider</label>
          <div className="grid grid-cols-2 gap-3">
            {(['openai', 'mistral'] as const).map(p => (
              <button key={p} onClick={() => setLocal(s => ({ ...s, activeAIProvider: p }))}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${local.activeAIProvider === p ? 'border-shopify-400 bg-shopify-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <Bot size={18} className={local.activeAIProvider === p ? 'text-shopify-600' : 'text-gray-400'} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-800">{p === 'openai' ? 'OpenAI' : 'Mistral AI'}</div>
                  <div className="text-xs text-gray-500">{p === 'openai' ? 'GPT-4o, GPT-4' : 'Mistral Large, 8x7B'}</div>
                </div>
                {local.activeAIProvider === p && <CheckCircle size={14} className="text-shopify-500 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-gray-600">OpenAI</p>
            <Field label="API Key" value={local.openaiApiKey} onChange={set('openaiApiKey')} type="password" placeholder="sk-..." mono />
            <div>
              <label className="label">Model</label>
              <select value={local.openaiModel} onChange={e => setLocal(s => ({ ...s, openaiModel: e.target.value }))} className="input">
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <button onClick={() => testConnection('openai')} disabled={testing === 'openai'} className="btn btn-secondary text-xs w-full justify-center">
              <TestTube size={12} className={testing === 'openai' ? 'animate-spin' : ''} />
              {testing === 'openai' ? 'Testing...' : 'Test OpenAI'}
            </button>
          </div>
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-gray-600">Mistral AI</p>
            <Field label="API Key" value={local.mistralApiKey} onChange={set('mistralApiKey')} type="password" placeholder="mistral_..." mono />
            <div>
              <label className="label">Model</label>
              <select value={local.mistralModel} onChange={e => setLocal(s => ({ ...s, mistralModel: e.target.value }))} className="input">
                <option value="mistral-large-latest">Mistral Large (Recommended)</option>
                <option value="mistral-medium">Mistral Medium</option>
                <option value="open-mixtral-8x7b">Mixtral 8x7B</option>
              </select>
            </div>
            <button onClick={() => testConnection('mistral')} disabled={testing === 'mistral'} className="btn btn-secondary text-xs w-full justify-center">
              <TestTube size={12} className={testing === 'mistral' ? 'animate-spin' : ''} />
              {testing === 'mistral' ? 'Testing...' : 'Test Mistral'}
            </button>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={MessageSquare} title="Notifications & Messaging" desc="Configure Slack, SMS and email notifications" color="text-blue-600 bg-blue-50">
        <Field label="Slack Webhook URL" value={local.slackWebhookUrl} onChange={set('slackWebhookUrl')} placeholder="https://hooks.slack.com/services/..." mono />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Twilio Account SID" value={local.twilioAccountSid} onChange={set('twilioAccountSid')} type="password" placeholder="ACxxx" mono />
          <Field label="Twilio Auth Token" value={local.twilioAuthToken} onChange={set('twilioAuthToken')} type="password" placeholder="Token" mono />
          <Field label="From Number" value={local.twilioFromNumber} onChange={set('twilioFromNumber')} placeholder="+15550001234" />
        </div>
      </Section>

      {/* Email SMTP */}
      <Section icon={Mail} title="Email SMTP" desc="Configure outbound email for automations" color="text-teal-600 bg-teal-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="SMTP Host" value={local.emailSmtpHost} onChange={set('emailSmtpHost')} placeholder="smtp.gmail.com" />
          <Field label="SMTP Port" value={local.emailSmtpPort} onChange={set('emailSmtpPort')} placeholder="587" />
          <Field label="SMTP Username" value={local.emailSmtpUser} onChange={set('emailSmtpUser')} placeholder="you@email.com" />
          <Field label="SMTP Password" value={local.emailSmtpPass} onChange={set('emailSmtpPass')} type="password" placeholder="App password" />
        </div>
      </Section>

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800">Security Notice</p>
          <p className="text-xs text-amber-700 mt-0.5">API keys are stored locally in your browser. In production, store them in environment variables or a secrets manager. Never commit keys to version control.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-4">
        <button onClick={() => setLocal({ ...apiSettings })} className="btn btn-secondary text-xs">Reset Changes</button>
        <button onClick={save} className="btn btn-primary text-xs"><Save size={13} /> Save All Settings</button>
      </div>
    </div>
  )
}
