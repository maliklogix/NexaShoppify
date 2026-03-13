// NexaShoppify — Shopify API Integration
// Replace static dashboard data with live Shopify Admin API calls

const SHOPIFY_CONFIG = {
  store: process.env.SHOPIFY_STORE || 'your-store.myshopify.com',
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
};

const BASE_URL = `https://${SHOPIFY_CONFIG.store}/admin/api/${SHOPIFY_CONFIG.apiVersion}`;

const headers = {
  'X-Shopify-Access-Token': SHOPIFY_CONFIG.accessToken,
  'Content-Type': 'application/json',
};

// Fetch recent orders
async function getRecentOrders(limit = 10) {
  const res = await fetch(`${BASE_URL}/orders.json?limit=${limit}&status=any`, { headers });
  const data = await res.json();
  return data.orders;
}

// Fetch revenue for last N days
async function getRevenueLast7Days() {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const results = await Promise.all(dates.map(async (date) => {
    const res = await fetch(
      `${BASE_URL}/orders.json?created_at_min=${date}T00:00:00&created_at_max=${date}T23:59:59&financial_status=paid`,
      { headers }
    );
    const data = await res.json();
    const total = (data.orders || []).reduce((sum, o) => sum + parseFloat(o.total_price), 0);
    return { date, total: Math.round(total) };
  }));

  return results;
}

// Fetch products sorted by sales
async function getTopProducts(limit = 5) {
  const res = await fetch(`${BASE_URL}/products.json?limit=${limit}`, { headers });
  const data = await res.json();
  return data.products;
}

// Fetch inventory levels
async function getLowStockProducts(threshold = 10) {
  const res = await fetch(`${BASE_URL}/inventory_levels.json`, { headers });
  const data = await res.json();
  return (data.inventory_levels || []).filter(item => item.available <= threshold);
}

// Register a webhook
async function registerWebhook(topic, address) {
  const res = await fetch(`${BASE_URL}/webhooks.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ webhook: { topic, address, format: 'json' } }),
  });
  return res.json();
}

// Fetch all registered webhooks
async function getWebhooks() {
  const res = await fetch(`${BASE_URL}/webhooks.json`, { headers });
  const data = await res.json();
  return data.webhooks;
}

module.exports = {
  getRecentOrders,
  getRevenueLast7Days,
  getTopProducts,
  getLowStockProducts,
  registerWebhook,
  getWebhooks,
};
