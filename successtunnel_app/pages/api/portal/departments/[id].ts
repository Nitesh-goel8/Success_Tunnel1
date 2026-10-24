import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const departmentId = parseInt(req.query.id as string)
  if (isNaN(departmentId)) {
    return res.status(400).json({ error: 'Invalid department identifier' })
  }

  if (req.method === 'GET') {
    try {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          head: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              employeeProfile: {
                select: {
                  employeeCode: true,
                  designation: true,
                  status: true,
                },
              },
            },
          },
          projects: {
            select: {
              id: true,
              projectCode: true,
              name: true,
              status: true,
              progress: true,
            },
          },
        },
      })

      if (!department) {
        return res.status(404).json({ error: 'Department not found' })
      }

      return res.status(200).json(department)
    } catch (error) {
      console.error('Failed to get department details:', error)
      return res.status(500).json({ error: 'Failed to retrieve department details' })
    }
  }

  if (req.method === 'PUT') {
    if (auth.role !== 'super_admin' && auth.role !== 'hr_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Administrators and HR Managers can update departments' })
    }

    const { name, code, description, headId } = req.body

    try {
      const updateData: any = {}
      if (name) updateData.name = name.trim()
      if (code) updateData.code = code.trim().toUpperCase()
      if (description !== undefined) updateData.description = description ? description.trim() : null
      if (headId !== undefined) updateData.headId = headId ? parseInt(headId) : null

      const updated = await prisma.department.update({
        where: { id: departmentId },
        data: updateData,
        include: {
          head: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'DEPARTMENT_UPDATED',
        entityType: 'Department',
        entityId: departmentId,
        details: { fields: Object.keys(updateData) },
        req,
      })

      return res.status(200).json({ ok: true, department: updated })
    } catch (error: any) {
      console.error('Failed to update department:', error)
      return res.status(500).json({ error: error.message || 'Failed to update department' })
    }
  }

  if (req.method === 'DELETE') {
    if (auth.role !== 'super_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Super Administrators can remove departments' })
    }

    try {
      const count = await prisma.user.count({ where: { departmentId } })
      if (count > 0) {
        return res.status(400).json({
          error: `Cannot delete department: ${count} active personnel are still assigned to this department. Reassign them first.`,
        })
      }

      await prisma.department.delete({ where: { id: departmentId } })

      await logAuditAction({
        userId: auth.id,
        action: 'DEPARTMENT_DELETED',
        entityType: 'Department',
        entityId: departmentId,
        req,
      })

      return res.status(200).json({ ok: true, message: 'Department removed successfully' })
    } catch (error) {
      console.error('Failed to delete department:', error)
      return res.status(500).json({ error: 'Failed to delete department' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
