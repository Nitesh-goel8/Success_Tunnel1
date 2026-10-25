import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  // POST: Submit a correction request
  if (req.method === 'POST') {
    const { date, checkIn, checkOut, reason } = req.body

    if (!date || !reason) {
      return res.status(400).json({ error: 'Date and reason for correction are required' })
    }

    try {
      const parsedCheckIn = checkIn ? new Date(checkIn) : new Date(`${date}T09:00:00Z`)
      const parsedCheckOut = checkOut ? new Date(checkOut) : new Date(`${date}T17:00:00Z`)
      const durationMs = Math.max(0, parsedCheckOut.getTime() - parsedCheckIn.getTime())
      const durationMinutes = Math.round(durationMs / (1000 * 60))

      const existing = await prisma.attendanceRecord.findUnique({
        where: { userId_date: { userId: auth.id, date: String(date) } },
      })

      let record
      if (existing) {
        record = await prisma.attendanceRecord.update({
          where: { id: existing.id },
          data: {
            correctionRequested: true,
            correctionReason: String(reason).trim(),
          },
        })
      } else {
        record = await prisma.attendanceRecord.create({
          data: {
            userId: auth.id,
            date: String(date),
            checkIn: parsedCheckIn,
            checkOut: parsedCheckOut,
            durationMinutes,
            status: 'REGULARIZED',
            correctionRequested: true,
            correctionReason: String(reason).trim(),
            isDemo: false,
          },
        })
      }

      await logAuditAction({
        userId: auth.id,
        action: 'ATTENDANCE_CORRECTION_REQUESTED',
        entityType: 'Attendance',
        entityId: record.id,
        details: { date, reason },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Correction request submitted for HR approval', record })
    } catch (error: any) {
      console.error('Correction request error:', error)
      return res.status(500).json({ error: error.message || 'Failed to submit correction request' })
    }
  }

  // PUT: Review & approve/reject correction request (HR / Admin only)
  if (req.method === 'PUT') {
    const isHRorAdmin =
      auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin'

    if (!isHRorAdmin) {
      return res.status(403).json({ error: 'Only HR Administrators can approve attendance regularizations' })
    }

    const { attendanceId, action = 'APPROVE', checkIn, checkOut } = req.body

    if (!attendanceId) {
      return res.status(400).json({ error: 'attendanceId is required' })
    }

    try {
      const existing = await prisma.attendanceRecord.findUnique({
        where: { id: parseInt(String(attendanceId), 10) },
        include: { user: { select: { id: true, name: true, email: true } } },
      })

      if (!existing) {
        return res.status(404).json({ error: 'Attendance record not found' })
      }

      if (action === 'REJECT') {
        const updated = await prisma.attendanceRecord.update({
          where: { id: existing.id },
          data: {
            correctionRequested: false,
            correctionReason: `[REJECTED] ${existing.correctionReason || ''}`,
          },
        })

        await prisma.notification.create({
          data: {
            userId: existing.userId,
            title: 'Attendance Regularization Rejected',
            message: `Your attendance correction request for ${existing.date} was rejected by HR.`,
            type: 'ATTENDANCE',
            link: '/portal/attendance',
          },
        })

        return res.status(200).json({ ok: true, message: 'Correction rejected', record: updated })
      }

      // Approved
      const newCheckIn = checkIn ? new Date(checkIn) : existing.checkIn
      const newCheckOut = checkOut ? new Date(checkOut) : existing.checkOut || new Date()
      const durationMs = Math.max(0, newCheckOut.getTime() - newCheckIn.getTime())
      const durationMinutes = Math.round(durationMs / (1000 * 60))

      const updated = await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          checkIn: newCheckIn,
          checkOut: newCheckOut,
          durationMinutes,
          status: 'REGULARIZED',
          correctionRequested: false,
          correctionApprovedBy: auth.id,
        },
      })

      await prisma.notification.create({
        data: {
          userId: existing.userId,
          title: 'Attendance Regularization Approved',
          message: `Your attendance correction for ${existing.date} was approved. Duration recorded: ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m.`,
          type: 'ATTENDANCE',
          link: '/portal/attendance',
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'ATTENDANCE_CORRECTION_APPROVED',
        entityType: 'Attendance',
        entityId: updated.id,
        details: { date: updated.date, durationMinutes, approvedBy: auth.name },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Attendance correction approved and regularized', record: updated })
    } catch (error: any) {
      console.error('Error approving correction:', error)
      return res.status(500).json({ error: error.message || 'Failed to update correction' })
    }
  }

  res.setHeader('Allow', ['POST', 'PUT'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
