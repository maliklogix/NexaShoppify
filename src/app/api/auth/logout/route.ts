import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/logger';

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: true });
    }
    const ip = getClientIp(req);
    await logActivity({
      userId,
      action: 'LOGOUT',
      resource: 'auth',
      details: 'User logged out',
      ip,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
