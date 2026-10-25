import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const { action, notes } = req.body // "checkin" or "checkout"
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
  const now = new Date()

  try {
    const existing = await prisma.attendanceRecord.findUnique({
      where: { userId_date: { userId: auth.id, date: todayStr } },
    })

    if (action === 'checkin') {
      if (existing) {
        return res.status(400).json({ error: 'You have already checked in for today.' })
      }

      const record = await prisma.attendanceRecord.create({
        data: {
          userId: auth.id,
          date: todayStr,
          checkIn: now,
          status: 'PRESENT',
          notes: notes ? notes.trim() : null,
          isDemo: false,
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'ATTENDANCE_CHECKIN',
        entityType: 'Attendance',
        entityId: record.id,
        details: { date: todayStr, time: now.toISOString() },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Check-in recorded successfully', record })
    }

    if (action === 'checkout') {
      if (!existing) {
        return res.status(400).json({ error: 'Cannot check out: No active check-in found for today.' })
      }

      if (existing.checkOut) {
        return res.status(400).json({ error: 'You have already completed check-out for today.' })
      }

      const durationMs = now.getTime() - new Date(existing.checkIn).getTime()
      const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)))

      const record = await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          checkOut: now,
          durationMinutes,
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'ATTENDANCE_CHECKOUT',
        entityType: 'Attendance',
        entityId: record.id,
        details: { durationMinutes, time: now.toISOString() },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Check-out recorded successfully', record })
    }

    return res.status(400).json({ error: 'Invalid action. Must be "checkin" or "checkout"' })
  } catch (error: any) {
    console.error('Attendance error:', error)
    return res.status(500).json({ error: error.message || 'Failed to process attendance' })
  }
}
