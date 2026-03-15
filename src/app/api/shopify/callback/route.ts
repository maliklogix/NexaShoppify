import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/logger';

const apiSecret = process.env.SHOPIFY_API_SECRET;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function verifyHmac(query: Record<string, string>, hmac: string): boolean {
  if (!apiSecret) return false;
  const sorted = Object.keys(query)
    .filter((k) => k !== 'hmac' && k !== 'signature')
    .sort()
    .map((k) => `${k}=${query[k]}`)
    .join('&');
  const hash = crypto.createHmac('sha256', apiSecret).update(sorted).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(hash, 'hex'));
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const hmac = searchParams.get('hmac');
  const state = searchParams.get('state');
  const stateCookie = req.cookies.get('shopify_oauth_state')?.value;
  const shopCookie = req.cookies.get('shopify_shop')?.value;

  const params: Record<string, string> = {};
  searchParams.forEach((v, k) => { params[k] = v; });

  if (!code || !shop || !hmac) {
    return NextResponse.redirect(`${appUrl}/login?error=shopify_callback_missing`);
  }
  if (!verifyHmac(params, hmac)) {
    return NextResponse.redirect(`${appUrl}/login?error=shopify_hmac_invalid`);
  }
  if (state !== stateCookie || shop !== shopCookie) {
    return NextResponse.redirect(`${appUrl}/login?error=shopify_state_invalid`);
  }

  try {
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });
    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Shopify token exchange failed:', err);
      return NextResponse.redirect(`${appUrl}/login?error=shopify_token_failed`);
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const shopDomain = shop;
    const username = `shopify_${shop.replace('.myshopify.com', '')}`;

    let user = await prisma.user.findFirst({
      where: {
        shopifyConnections: {
          some: { shopDomain },
        },
      },
      select: { id: true, username: true, role: true, email: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: null,
          role: 'USER',
          shopifyConnections: {
            create: {
              shopDomain,
              accessToken,
              scope: tokenData.scope || null,
            },
          },
        },
        select: { id: true, username: true, role: true, email: true },
      });
      await logActivity({
        userId: user.id,
        action: 'LOGIN',
        resource: 'auth',
        details: `Shopify login: ${shopDomain}`,
      });
    } else {
      await prisma.shopifyConnection.upsert({
        where: {
          userId_shopDomain: { userId: user.id, shopDomain },
        },
        create: { userId: user.id, shopDomain, accessToken, scope: tokenData.scope || null },
        update: { accessToken, scope: tokenData.scope || null },
      });
      await logActivity({
        userId: user.id,
        action: 'LOGIN',
        resource: 'auth',
        details: `Shopify login: ${shopDomain}`,
      });
    }

    const redirect = NextResponse.redirect(`${appUrl}/login`);
    redirect.cookies.delete('shopify_oauth_state');
    redirect.cookies.delete('shopify_shop');
    redirect.cookies.set('nexa_user', JSON.stringify({ id: user.id, username: user.username, role: user.role, email: user.email }), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return redirect;
  } catch (e) {
    console.error('Shopify callback error:', e);
    return NextResponse.redirect(`${appUrl}/login?error=shopify_callback_error`);
  }
}
