/**
 * Backend logger: writes UTC timestamps to a file and optionally to DB.
 * All timestamps are in UTC.
 */

import { prisma } from './prisma'
import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const ACTIVITY_FILE = path.join(LOG_DIR, 'activity.log')

function utcNow(): string {
  return new Date().toISOString() // UTC
}

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

function writeToFile(line: string) {
  try {
    ensureLogDir()
    fs.appendFileSync(ACTIVITY_FILE, line + '\n')
  } catch (e) {
    console.error('[Logger] File write failed:', e)
  }
}

export interface ActivityLogPayload {
  userId: string
  action: string
  resource?: string
  details?: string
  ip?: string
}

export async function logActivity(payload: ActivityLogPayload): Promise<void> {
  const ts = utcNow()
  const line = `[${ts}] ACTIVITY userId=${payload.userId} action=${payload.action} resource=${payload.resource ?? ''} details=${payload.details ?? ''} ip=${payload.ip ?? ''}`
  writeToFile(line)

  try {
    await prisma.activityLog.create({
      data: {
        userId: payload.userId,
        action: payload.action,
        resource: payload.resource ?? null,
        details: payload.details ?? null,
        ip: payload.ip ?? null,
      },
    })
  } catch (e) {
    console.error('[Logger] DB activity log failed:', e)
  }
}

export interface ChatLogPayload {
  userId: string
  role: 'user' | 'assistant'
  content: string
}

export async function logChat(payload: ChatLogPayload): Promise<void> {
  const ts = utcNow()
  const contentPreview = payload.content.slice(0, 100).replace(/\n/g, ' ')
  const line = `[${ts}] CHAT userId=${payload.userId} role=${payload.role} content="${contentPreview}..."`
  writeToFile(line)

  try {
    await prisma.chatLog.create({
      data: {
        userId: payload.userId,
        role: payload.role,
        content: payload.content,
      },
    })
  } catch (e) {
    console.error('[Logger] DB chat log failed:', e)
  }
}

export interface DashboardLogPayload {
  userId: string
  page: string
  action?: string
  metadata?: Record<string, unknown>
}

export async function logDashboard(payload: DashboardLogPayload): Promise<void> {
  const ts = utcNow()
  const line = `[${ts}] DASHBOARD userId=${payload.userId} page=${payload.page} action=${payload.action ?? 'view'}`
  writeToFile(line)

  try {
    await prisma.dashboardEvent.create({
      data: {
        userId: payload.userId,
        page: payload.page,
        action: payload.action ?? 'view',
        metadata: payload.metadata ?? undefined,
      },
    })
  } catch (e) {
    console.error('[Logger] DB dashboard log failed:', e)
  }
}
