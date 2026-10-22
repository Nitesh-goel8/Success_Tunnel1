import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res, ['super_admin', 'hr_admin', 'finance_admin', 'admin'])
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
      const entityType = (req.query.entityType as string || '').trim()
      const search = (req.query.search as string || '').trim()

      const where: any = {}
      if (entityType && entityType !== 'ALL') {
        where.entityType = entityType
      }
      if (search) {
        where.OR = [
          { action: { contains: search } },
          { details: { contains: search } },
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
        ]
      }

      const [total, logs] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ])

      return res.status(200).json({
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error('Failed to list audit logs:', error)
      return res.status(500).json({ error: 'Failed to retrieve audit trail' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
