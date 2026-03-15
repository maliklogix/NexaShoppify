import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/logger';

function getAdminId(req: NextRequest): string | null {
  return req.headers.get('x-user-id') || null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminId = getAdminId(req);
  const admin = await requireAdmin(adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, username: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminId = getAdminId(req);
  const admin = await requireAdmin(adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { username, email, password, role } = body;
    const data: { username?: string; email?: string | null; password?: string; role?: 'ADMIN' | 'USER' } = {};
    if (username !== undefined) data.username = String(username).trim();
    if (email !== undefined) data.email = email ? String(email).trim() || null : null;
    if (role === 'ADMIN' || role === 'USER') data.role = role;
    if (password !== undefined && password !== '') {
      data.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({
      where: { id: params.id },
      data,
    });
    await logActivity({
      userId: admin.id,
      action: 'USER_UPDATE',
      resource: 'users',
      details: `Updated user ${user.username} (${user.id})`,
    });
    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminId = getAdminId(req);
  const admin = await requireAdmin(adminId);
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  if (params.id === admin.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }
  try {
    const user = await prisma.user.delete({
      where: { id: params.id },
    });
    await logActivity({
      userId: admin.id,
      action: 'USER_DELETE',
      resource: 'users',
      details: `Deleted user ${user.username} (${user.id})`,
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
