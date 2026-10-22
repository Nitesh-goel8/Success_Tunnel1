import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const isPrivileged =
        auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin' || auth.role === 'project_manager'

      // Fetch leave policies
      const policies = await prisma.leavePolicy.findMany({
        where: { isActive: true },
      })

      // Fetch user's approved leaves this year to compute balances
      const currentYear = new Date().getFullYear()
      const yearStart = new Date(currentYear, 0, 1)

      const myApprovedLeaves = await prisma.leaveRequest.findMany({
        where: {
          userId: auth.id,
          status: 'APPROVED',
          startDate: { gte: yearStart },
        },
      })

      const balances = policies.map((p) => {
        const used = myApprovedLeaves
          .filter((l) => l.leaveType === p.leaveType)
          .reduce((sum, l) => sum + l.totalDays, 0)
        return {
          ...p,
          usedDays: used,
          remainingDays: Math.max(0, p.totalDaysPerYear - used),
        }
      })

      // Fetch requests
      const where: any = {}
      if (!isPrivileged) {
        where.userId = auth.id
      }

      const requests = await prisma.leaveRequest.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, department: { select: { name: true } } },
          },
          reviewedBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json({
        policies: balances,
        requests,
      })
    } catch (error) {
      console.error('Failed to list leaves:', error)
      return res.status(500).json({ error: 'Failed to retrieve leave information' })
    }
  }

  if (req.method === 'POST') {
    const { leaveType, startDate, endDate, reason } = req.body

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'Leave type, start date, end date, and reason are required' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be prior to start date' })
    }

    // Calculate business days
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    try {
      const request = await prisma.leaveRequest.create({
        data: {
          userId: auth.id,
          leaveType,
          startDate: start,
          endDate: end,
          totalDays: diffDays,
          reason: reason.trim(),
          status: 'PENDING',
          isDemo: false,
        },
        include: {
          user: { select: { name: true } },
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'LEAVE_SUBMITTED',
        entityType: 'Leave',
        entityId: request.id,
        details: { leaveType, totalDays: diffDays, startDate, endDate },
        req,
      })

      return res.status(201).json({ ok: true, request })
    } catch (error: any) {
      console.error('Failed to submit leave:', error)
      return res.status(500).json({ error: error.message || 'Failed to submit leave request' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
