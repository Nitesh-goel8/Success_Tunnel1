import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const projectId = parseInt(req.query.id as string)
  if (isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project identifier' })
  }

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          department: true,
          manager: {
            select: { id: true, name: true, email: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true },
              },
            },
          },
          tasks: {
            include: {
              assignee: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { dueDate: 'asc' },
          },
          expenses: {
            select: { id: true, amount: true, category: true, status: true },
          },
        },
      })

      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Calculate progress
      const totalTasks = project.tasks.length
      let calculatedProgress = project.progress
      if (totalTasks > 0) {
        const doneTasks = project.tasks.filter((t) => t.status === 'DONE').length
        calculatedProgress = Math.round((doneTasks / totalTasks) * 100)
      }

      return res.status(200).json({
        ...project,
        progress: calculatedProgress,
      })
    } catch (error) {
      console.error('Failed to get project:', error)
      return res.status(500).json({ error: 'Failed to retrieve project details' })
    }
  }

  if (req.method === 'PUT') {
    const isLeadOrAdmin =
      auth.role === 'super_admin' || auth.role === 'project_manager' || auth.role === 'admin'
    if (!isLeadOrAdmin) {
      return res.status(403).json({ error: 'Unauthorized to modify project properties' })
    }

    const {
      name,
      description,
      businessObjective,
      status,
      priority,
      budget,
      startDate,
      endDate,
      managerId,
    } = req.body

    try {
      const updateData: any = {}
      if (name) updateData.name = name.trim()
      if (description !== undefined) updateData.description = description ? description.trim() : null
      if (businessObjective !== undefined) updateData.businessObjective = businessObjective ? businessObjective.trim() : null
      if (status) updateData.status = status
      if (priority) updateData.priority = priority
      if (budget !== undefined) updateData.budget = parseFloat(budget)
      if (startDate) updateData.startDate = new Date(startDate)
      if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
      if (managerId) updateData.managerId = parseInt(managerId)

      const updated = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
      })

      await logAuditAction({
        userId: auth.id,
        action: 'PROJECT_UPDATED',
        entityType: 'Project',
        entityId: projectId,
        details: { fields: Object.keys(updateData) },
        req,
      })

      return res.status(200).json({ ok: true, project: updated })
    } catch (error: any) {
      console.error('Failed to update project:', error)
      return res.status(500).json({ error: error.message || 'Failed to update project' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
