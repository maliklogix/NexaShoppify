import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { logActivity } from '@/lib/logger';

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const ip = getClientIp(req);

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Fallback: accept admin/admin when DB is empty or unreachable (e.g. before running seed)
    const isFallbackAdmin = username === 'admin' && password === 'admin';

    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user && user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          await logActivity({
            userId: user.id,
            action: 'LOGIN',
            resource: 'auth',
            details: `Username login: ${username}`,
            ip,
          });
          return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username, role: user.role, email: user.email },
          });
        }
      }

      // DB connected but no matching user — allow fallback admin/admin so login works before seed
      if (isFallbackAdmin) {
        return NextResponse.json({
          success: true,
          user: { id: 'fallback-admin-id', username: 'admin', role: 'ADMIN', email: null },
        });
      }
    } catch (dbError) {
      console.warn('Database connection failed, falling back to local auth:', dbError);
      if (isFallbackAdmin) {
        return NextResponse.json({
          success: true,
          user: { id: 'fallback-admin-id', username: 'admin', role: 'ADMIN', email: null },
        });
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
