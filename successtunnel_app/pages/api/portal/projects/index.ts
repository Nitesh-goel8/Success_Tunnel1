import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const status = req.query.status as string
      const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined

      const where: any = {}
      if (status && status !== 'ALL') {
        where.status = status
      }
      if (departmentId) {
        where.departmentId = departmentId
      }

      const projects = await prisma.project.findMany({
        where,
        include: {
          department: {
            select: { id: true, name: true, code: true },
          },
          manager: {
            select: { id: true, name: true, email: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          tasks: {
            select: { id: true, status: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      })

      // Calculate accurate progress derived from tasks if tasks exist
      const enriched = projects.map((prj) => {
        const totalTasks = prj.tasks.length
        let calculatedProgress = prj.progress
        if (totalTasks > 0) {
          const doneTasks = prj.tasks.filter((t) => t.status === 'DONE').length
          calculatedProgress = Math.round((doneTasks / totalTasks) * 100)
        }

        return {
          ...prj,
          progress: calculatedProgress,
          taskStats: {
            total: totalTasks,
            done: prj.tasks.filter((t) => t.status === 'DONE').length,
            inProgress: prj.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
          },
        }
      })

      return res.status(200).json(enriched)
    } catch (error) {
      console.error('Failed to list projects:', error)
      return res.status(500).json({ error: 'Failed to retrieve projects' })
    }
  }

  if (req.method === 'POST') {
    if (auth.role !== 'super_admin' && auth.role !== 'project_manager' && auth.role !== 'hr_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Project Managers and Administrators can initiate projects' })
    }

    const {
      name,
      description,
      businessObjective,
      departmentId,
      managerId,
      status,
      priority,
      startDate,
      endDate,
      budget,
    } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' })
    }

    try {
      const count = await prisma.project.count()
      const projectCode = `ST-PRJ-${new Date().getFullYear()}-${String(count + 1).padStart(2, '0')}`

      const project = await prisma.project.create({
        data: {
          projectCode,
          name: name.trim(),
          description: description?.trim() || null,
          businessObjective: businessObjective?.trim() || null,
          departmentId: departmentId ? parseInt(departmentId) : null,
          managerId: managerId ? parseInt(managerId) : auth.id,
          status: status || 'PLANNED',
          priority: priority || 'MEDIUM',
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          budget: budget ? parseFloat(budget) : 0,
          progress: 0,
          isDemo: false,
        },
      })

      // Add creator as member
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: auth.id,
          role: auth.role === 'project_manager' ? 'Project Lead' : 'Administrator',
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'PROJECT_CREATED',
        entityType: 'Project',
        entityId: project.id,
        details: { projectCode: project.projectCode, name: project.name },
        req,
      })

      return res.status(201).json({ ok: true, project })
    } catch (error: any) {
      console.error('Failed to create project:', error)
      return res.status(500).json({ error: error.message || 'Failed to create project' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
