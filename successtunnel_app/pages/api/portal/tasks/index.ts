import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'private, max-age=10, stale-while-revalidate=20')
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined
      const assigneeId = req.query.assigneeId ? parseInt(req.query.assigneeId as string) : undefined
      const status = (req.query.status as string || '').trim().toUpperCase()
      const priority = (req.query.priority as string || '').trim().toUpperCase()
      const search = (req.query.search as string || '').trim()

      const where: any = {}
      if (projectId) where.projectId = projectId
      if (assigneeId) where.assigneeId = assigneeId
      if (status && status !== 'ALL') where.status = status
      if (priority && priority !== 'ALL') where.priority = priority

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
          { taskCode: { contains: search } },
        ]
      }

      const tasks = await prisma.task.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true, projectCode: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      })

      return res.status(200).json(tasks)
    } catch (error) {
      console.error('Failed to list tasks:', error)
      return res.status(500).json({ error: 'Failed to retrieve tasks' })
    }
  }

  if (req.method === 'POST') {
    const {
      title,
      description,
      projectId,
      assigneeId,
      priority,
      status,
      dueDate,
    } = req.body

    if (!title || !title.trim() || !projectId) {
      return res.status(400).json({ error: 'Title and project selection are required' })
    }

    try {
      const taskCount = await prisma.task.count()
      const taskCode = `ST-TSK-${100 + taskCount + 1}`

      const task = await prisma.task.create({
        data: {
          taskCode,
          title: title.trim(),
          description: description?.trim() || null,
          projectId: parseInt(projectId),
          assigneeId: assigneeId ? parseInt(assigneeId) : null,
          creatorId: auth.id,
          priority: priority || 'MEDIUM',
          status: status || 'TODO',
          dueDate: dueDate ? new Date(dueDate) : null,
          isDemo: false,
        },
        include: {
          project: { select: { name: true } },
          assignee: { select: { name: true } },
        },
      })

      // Record task activity
      await prisma.taskActivity.create({
        data: {
          taskId: task.id,
          userId: auth.id,
          action: 'TASK_CREATED',
          details: `Task created and assigned to ${task.assignee?.name || 'Unassigned'}`,
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'TASK_CREATED',
        entityType: 'Task',
        entityId: task.id,
        details: { taskCode: task.taskCode, title: task.title },
        req,
      })

      return res.status(201).json({ ok: true, task })
    } catch (error: any) {
      console.error('Failed to create task:', error)
      return res.status(500).json({ error: error.message || 'Failed to create task' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
