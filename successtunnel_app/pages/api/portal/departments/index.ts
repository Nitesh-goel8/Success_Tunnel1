import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const departments = await prisma.department.findMany({
        include: {
          head: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      })

      return res.status(200).json(departments)
    } catch (error) {
      console.error('Failed to query departments:', error)
      return res.status(500).json({ error: 'Failed to retrieve departments' })
    }
  }

  if (req.method === 'POST') {
    if (auth.role !== 'super_admin' && auth.role !== 'hr_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Administrators and HR Managers can add departments' })
    }

    const { name, code, description, headId } = req.body

    if (!name || !code) {
      return res.status(400).json({ error: 'Department name and code are required' })
    }

    try {
      const cleanCode = code.trim().toUpperCase()
      const existing = await prisma.department.findFirst({
        where: {
          OR: [{ code: cleanCode }, { name: name.trim() }],
        },
      })

      if (existing) {
        return res.status(400).json({ error: 'A department with this name or code already exists' })
      }

      const dept = await prisma.department.create({
        data: {
          name: name.trim(),
          code: cleanCode,
          description: description?.trim() || null,
          headId: headId ? parseInt(headId) : null,
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'DEPARTMENT_CREATED',
        entityType: 'Department',
        entityId: dept.id,
        details: { name: dept.name, code: dept.code },
        req,
      })

      return res.status(201).json({ ok: true, department: dept })
    } catch (error: any) {
      console.error('Failed to create department:', error)
      return res.status(500).json({ error: error.message || 'Failed to create department' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
