import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SCOPES = 'read_orders,read_products,read_customers,read_inventory,read_fulfillments';

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop');
  const apiKey = process.env.SHOPIFY_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!apiKey) {
    return NextResponse.json({ error: 'Shopify app not configured' }, { status: 500 });
  }
  if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.json({ error: 'Valid shop parameter required (e.g. mystore.myshopify.com)' }, { status: 400 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${appUrl}/api/shopify/callback`;
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  const res = NextResponse.redirect(installUrl);
  res.cookies.set('shopify_oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' });
  res.cookies.set('shopify_shop', shop, { httpOnly: true, maxAge: 600, path: '/' });
  return res;
}
