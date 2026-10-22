import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const isPrivileged =
        auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin'
      const targetUserId = req.query.userId ? parseInt(req.query.userId as string) : undefined
      const month = req.query.month as string // e.g. "2026-10"

      const where: any = {}

      // Non-admins can only see their own attendance
      if (!isPrivileged) {
        where.userId = auth.id
      } else if (targetUserId) {
        where.userId = targetUserId
      }

      if (month && month.length === 7) {
        where.date = { startsWith: month }
      }

      const records = await prisma.attendanceRecord.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: { select: { name: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
      })

      return res.status(200).json(records)
    } catch (error) {
      console.error('Failed to list attendance records:', error)
      return res.status(500).json({ error: 'Failed to retrieve attendance logs' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
