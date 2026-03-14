import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return NextResponse.json({ 
            success: true, 
            user: { id: user.id, username: user.username, role: user.role } 
          });
        }
      }
    } catch (dbError) {
      console.warn('Database connection failed, falling back to local auth:', dbError);
      
      // Fallback for demo/development when DB is unreachable
      if (username === 'admin' && password === 'admin') {
        return NextResponse.json({ 
          success: true, 
          user: { id: 'fallback-admin-id', username: 'admin', role: 'ADMIN' } 
        });
      }
    }

    // If we get here, either DB worked but credentials were wrong, or DB failed and fallback credentials were wrong
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
