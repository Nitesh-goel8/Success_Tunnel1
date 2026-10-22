import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const leaveId = parseInt(req.query.id as string)
  if (isNaN(leaveId)) {
    return res.status(400).json({ error: 'Invalid leave request identifier' })
  }

  if (req.method === 'PUT') {
    const isApprover =
      auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin' || auth.role === 'project_manager'

    if (!isApprover) {
      return res.status(403).json({ error: 'Unauthorized to review leave requests' })
    }

    const { status, reviewReason } = req.body // "APPROVED" or "REJECTED"

    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' })
    }

    try {
      const leave = await prisma.leaveRequest.findUnique({
        where: { id: leaveId },
        include: { user: { select: { name: true, email: true } } },
      })

      if (!leave) {
        return res.status(404).json({ error: 'Leave request not found' })
      }

      const updated = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: {
          status,
          reviewedById: auth.id,
          reviewReason: reviewReason ? reviewReason.trim() : null,
          reviewedAt: new Date(),
        },
      })

      // Send notification to the employee
      await prisma.notification.create({
        data: {
          userId: leave.userId,
          title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
          message: `Your ${leave.leaveType} leave request for ${leave.totalDays} day(s) was ${status.toLowerCase()} by ${auth.name || 'HR Management'}.${reviewReason ? ` Note: ${reviewReason}` : ''}`,
          type: 'LEAVE',
          link: '/portal/leaves',
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: `LEAVE_${status}`,
        entityType: 'Leave',
        entityId: leave.id,
        details: { employee: leave.user?.name, status, reviewReason },
        req,
      })

      return res.status(200).json({ ok: true, leave: updated })
    } catch (error: any) {
      console.error('Failed to review leave:', error)
      return res.status(500).json({ error: error.message || 'Failed to update leave request' })
    }
  }

  res.setHeader('Allow', ['PUT'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
