import { prisma } from './prisma'

export async function requireAdmin(userId: string | null): Promise<{ id: string; username: string; role: string } | null> {
  if (!userId) return null
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, role: true },
  })
  if (!user || user.role !== 'ADMIN') return null
  return user
}
