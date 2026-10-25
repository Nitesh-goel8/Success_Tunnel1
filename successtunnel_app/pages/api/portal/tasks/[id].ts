import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const taskId = parseInt(req.query.id as string)
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task identifier' })
  }

  if (req.method === 'GET') {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
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
          comments: {
            include: {
              author: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          activities: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }

      return res.status(200).json(task)
    } catch (error) {
      console.error('Failed to get task:', error)
      return res.status(500).json({ error: 'Failed to retrieve task' })
    }
  }

  // Update task (Status transition, assignee, priority, etc.)
  if (req.method === 'PUT') {
    const { status, priority, assigneeId, title, description, dueDate } = req.body

    try {
      const current = await prisma.task.findUnique({ where: { id: taskId } })
      if (!current) {
        return res.status(404).json({ error: 'Task not found' })
      }

      const updateData: any = {}
      const activityNotes: string[] = []

      if (status && status !== current.status) {
        updateData.status = status
        activityNotes.push(`Changed status from ${current.status} to ${status}`)
      }
      if (priority && priority !== current.priority) {
        updateData.priority = priority
        activityNotes.push(`Changed priority to ${priority}`)
      }
      if (assigneeId !== undefined && assigneeId !== current.assigneeId) {
        updateData.assigneeId = assigneeId ? parseInt(assigneeId) : null
        activityNotes.push(`Reassigned task`)
      }
      if (title) updateData.title = title.trim()
      if (description !== undefined) updateData.description = description ? description.trim() : null
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null

      const updated = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: {
          assignee: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      })

      // Log TaskActivity
      if (activityNotes.length > 0) {
        await prisma.taskActivity.create({
          data: {
            taskId: updated.id,
            userId: auth.id,
            action: 'TASK_UPDATED',
            details: activityNotes.join('; '),
          },
        })
      }

      // Recompute project progress percentage if status changed
      if (status && status !== current.status) {
        const total = await prisma.task.count({ where: { projectId: updated.projectId } })
        const done = await prisma.task.count({ where: { projectId: updated.projectId, status: 'DONE' } })
        const newProgress = total > 0 ? Math.round((done / total) * 100) : 0

        await prisma.project.update({
          where: { id: updated.projectId },
          data: { progress: newProgress },
        })
      }

      return res.status(200).json({ ok: true, task: updated })
    } catch (error: any) {
      console.error('Failed to update task:', error)
      return res.status(500).json({ error: error.message || 'Failed to update task' })
    }
  }

  // Add Comment to Task
  if (req.method === 'POST') {
    const { content } = req.body
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' })
    }

    try {
      const comment = await prisma.taskComment.create({
        data: {
          taskId,
          authorId: auth.id,
          content: content.trim(),
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      })

      await prisma.taskActivity.create({
        data: {
          taskId,
          userId: auth.id,
          action: 'COMMENT_ADDED',
          details: `Comment added by ${auth.name || auth.email}`,
        },
      })

      return res.status(201).json({ ok: true, comment })
    } catch (error) {
      console.error('Failed to post comment:', error)
      return res.status(500).json({ error: 'Failed to post comment' })
    }
  }

  // Delete Task
  if (req.method === 'DELETE') {
    if (auth.role !== 'super_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: admin access required' })
    }
    try {
      await prisma.task.delete({ where: { id: taskId } })
      return res.status(200).json({ ok: true, message: `Task ${taskId} deleted successfully` })
    } catch (error: any) {
      console.error('Failed to delete task:', error)
      return res.status(500).json({ error: error.message || 'Failed to delete task' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
