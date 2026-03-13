// NexaShoppify — Shopify API Client + Mock Data

export const MOCK_ORDERS = [
  { id: '#5042', customer: 'Sarah K.', email: 'sarah.k@email.com', amount: 129.00, status: 'paid', fulfillment: 'unfulfilled', items: 2, date: '2026-03-13', country: 'US' },
  { id: '#5041', customer: 'James M.', email: 'james.m@email.com', amount: 87.50, status: 'paid', fulfillment: 'fulfilled', items: 1, date: '2026-03-13', country: 'UK' },
  { id: '#5040', customer: 'Priya S.', email: 'priya.s@email.com', amount: 214.00, status: 'pending', fulfillment: 'unfulfilled', items: 3, date: '2026-03-13', country: 'IN' },
  { id: '#5039', customer: 'Luca R.', email: 'luca.r@email.com', amount: 56.00, status: 'refunded', fulfillment: 'returned', items: 1, date: '2026-03-12', country: 'IT' },
  { id: '#5038', customer: 'Hana W.', email: 'hana.w@email.com', amount: 310.00, status: 'paid', fulfillment: 'fulfilled', items: 4, date: '2026-03-12', country: 'JP' },
  { id: '#5037', customer: 'Omar B.', email: 'omar.b@email.com', amount: 75.00, status: 'paid', fulfillment: 'in_transit', items: 1, date: '2026-03-12', country: 'AE' },
  { id: '#5036', customer: 'Chen L.', email: 'chen.l@email.com', amount: 450.00, status: 'paid', fulfillment: 'fulfilled', items: 5, date: '2026-03-11', country: 'CN' },
  { id: '#5035', customer: 'Maria G.', email: 'maria.g@email.com', amount: 98.00, status: 'cancelled', fulfillment: 'restocked', items: 2, date: '2026-03-11', country: 'ES' },
]

export const MOCK_CUSTOMERS = [
  { id: 'C001', name: 'Sarah K.', email: 'sarah.k@email.com', orders: 12, spent: 1840.00, tag: 'VIP', joinDate: '2024-01-15', location: 'New York, US', status: 'active' },
  { id: 'C002', name: 'James M.', email: 'james.m@email.com', orders: 5, spent: 430.00, tag: 'Regular', joinDate: '2024-06-22', location: 'London, UK', status: 'active' },
  { id: 'C003', name: 'Priya S.', email: 'priya.s@email.com', orders: 8, spent: 920.00, tag: 'VIP', joinDate: '2024-03-10', location: 'Mumbai, IN', status: 'active' },
  { id: 'C004', name: 'Luca R.', email: 'luca.r@email.com', orders: 2, spent: 143.00, tag: 'New', joinDate: '2026-01-05', location: 'Rome, IT', status: 'at_risk' },
  { id: 'C005', name: 'Hana W.', email: 'hana.w@email.com', orders: 19, spent: 3200.00, tag: 'VIP', joinDate: '2023-11-01', location: 'Tokyo, JP', status: 'active' },
]

export const MOCK_PRODUCTS = [
  { id: 'P001', title: 'Classic Hoodie', sku: 'HOOD-001', price: 59.99, inventory: 8, sold: 142, revenue: 8518.58, status: 'active', category: 'Apparel' },
  { id: 'P002', title: 'Tote Bag', sku: 'BAG-002', price: 24.99, inventory: 45, sold: 87, revenue: 2174.13, status: 'active', category: 'Accessories' },
  { id: 'P003', title: 'Snapback Cap', sku: 'CAP-003', price: 34.99, inventory: 23, sold: 64, revenue: 2239.36, status: 'active', category: 'Accessories' },
  { id: 'P004', title: 'Slim Tee', sku: 'TEE-004', price: 29.99, inventory: 112, sold: 201, revenue: 6027.99, status: 'active', category: 'Apparel' },
  { id: 'P005', title: 'Denim Jacket', sku: 'JKT-005', price: 119.99, inventory: 4, sold: 28, revenue: 3359.72, status: 'low_stock', category: 'Apparel' },
  { id: 'P006', title: 'Canvas Sneakers', sku: 'SNK-006', price: 79.99, inventory: 0, sold: 55, revenue: 4399.45, status: 'out_of_stock', category: 'Footwear' },
]

export const MOCK_TICKETS = [
  { id: 'T-1001', customer: 'Sarah K.', email: 'sarah.k@email.com', subject: 'Where is my order #5042?', status: 'open', priority: 'high', channel: 'email', created: '2026-03-13 10:22', assigned: 'Agent Maya', messages: 2 },
  { id: 'T-1002', customer: 'Luca R.', email: 'luca.r@email.com', subject: 'Refund not received after 7 days', status: 'pending', priority: 'urgent', channel: 'chat', created: '2026-03-13 09:15', assigned: 'Agent Alex', messages: 5 },
  { id: 'T-1003', customer: 'Chen L.', email: 'chen.l@email.com', subject: 'Wrong size delivered', status: 'open', priority: 'medium', channel: 'email', created: '2026-03-12 18:40', assigned: 'Unassigned', messages: 1 },
  { id: 'T-1004', customer: 'Omar B.', email: 'omar.b@email.com', subject: 'Request for bulk discount code', status: 'resolved', priority: 'low', channel: 'chat', created: '2026-03-12 14:10', assigned: 'Agent Maya', messages: 8 },
  { id: 'T-1005', customer: 'Maria G.', email: 'maria.g@email.com', subject: 'Cancel order #5035', status: 'resolved', priority: 'medium', channel: 'email', created: '2026-03-11 11:00', assigned: 'Agent Alex', messages: 3 },
]

export const REVENUE_DATA = [
  { day: 'Mon', revenue: 3100, orders: 28 },
  { day: 'Tue', revenue: 4200, orders: 35 },
  { day: 'Wed', revenue: 3800, orders: 31 },
  { day: 'Thu', revenue: 5100, orders: 42 },
  { day: 'Fri', revenue: 4600, orders: 38 },
  { day: 'Sat', revenue: 6200, orders: 51 },
  { day: 'Sun', revenue: 4821, orders: 47 },
]

export const MONTHLY_DATA = [
  { month: 'Sep', revenue: 28400 },
  { month: 'Oct', revenue: 33200 },
  { month: 'Nov', revenue: 41800 },
  { month: 'Dec', revenue: 58600 },
  { month: 'Jan', revenue: 35200 },
  { month: 'Feb', revenue: 39100 },
  { month: 'Mar', revenue: 28500 },
]

// Shopify API Client
export class ShopifyClient {
  private domain: string
  private token: string

  constructor(domain: string, token: string) {
    this.domain = domain
    this.token = token
  }

  private async request(endpoint: string, method = 'GET', body?: object) {
    const res = await fetch(`https://${this.domain}/admin/api/2024-01${endpoint}`, {
      method,
      headers: {
        'X-Shopify-Access-Token': this.token,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`Shopify API error: ${res.status}`)
    return res.json()
  }

  async getOrders(params = '') { return this.request(`/orders.json?limit=50&status=any${params}`) }
  async getOrder(id: string) { return this.request(`/orders/${id}.json`) }
  async updateOrder(id: string, data: object) { return this.request(`/orders/${id}.json`, 'PUT', data) }
  async getProducts(params = '') { return this.request(`/products.json?limit=50${params}`) }
  async getProduct(id: string) { return this.request(`/products/${id}.json`) }
  async getCustomers(params = '') { return this.request(`/customers.json?limit=50${params}`) }
  async getInventoryLevels() { return this.request('/inventory_levels.json') }
  async getWebhooks() { return this.request('/webhooks.json') }
  async createWebhook(topic: string, address: string) {
    return this.request('/webhooks.json', 'POST', { webhook: { topic, address, format: 'json' } })
  }
  async getShop() { return this.request('/shop.json') }
  async cancelOrder(id: string) { return this.request(`/orders/${id}/cancel.json`, 'POST') }
  async refundOrder(id: string) { return this.request(`/orders/${id}/refunds.json`, 'POST') }
  async createDiscountCode(data: object) { return this.request('/price_rules.json', 'POST', { price_rule: data }) }
}

// AI Summarization
export async function generateAISummary(prompt: string, settings: { provider: string; openaiKey: string; mistralKey: string; openaiModel: string; mistralModel: string }) {
  if (settings.provider === 'openai' && settings.openaiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.openaiKey}` },
      body: JSON.stringify({ model: settings.openaiModel || 'gpt-4o', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || 'No response'
  }
  if (settings.provider === 'mistral' && settings.mistralKey) {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.mistralKey}` },
      body: JSON.stringify({ model: settings.mistralModel || 'mistral-large-latest', messages: [{ role: 'user', content: prompt }], max_tokens: 500 }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || 'No response'
  }
  return null
}
