import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/logger';

function getAdminId(req: NextRequest): string | null {
  return req.headers.get('x-user-id') || req.nextUrl.searchParams.get('adminUserId') || null;
}

export async function GET(req: NextRequest) {
  const adminId = getAdminId(req);
  const admin = await requireAdmin(adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (e) {
    console.error('Users list error:', e);
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminId = getAdminId(req);
  const admin = await requireAdmin(adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { username, password, email, role } = body;
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const user = await prisma.user.create({
      data: {
        username: String(username).trim(),
        email: email ? String(email).trim() || null : null,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
    });
    await logActivity({
      userId: admin.id,
      action: 'USER_CREATE',
      resource: 'users',
      details: `Created user ${user.username} (${user.id})`,
    });
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002'
      ? 'Username already exists'
      : 'Failed to create user';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
