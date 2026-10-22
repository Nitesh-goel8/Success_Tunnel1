import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0]

    const [
      activeEmployeesCount,
      activeProjectsCount,
      pendingLeavesCount,
      tasks,
      projects,
      recentAuditLogs,
      departments,
      myAttendanceToday,
      demoRecordsCount,
    ] = await Promise.all([
      prisma.employeeProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.project.count({ where: { status: { in: ['PLANNED', 'IN_PROGRESS'] } } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.task.findMany({
        select: {
          id: true,
          taskCode: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          assignee: {
            select: { name: true, email: true },
          },
          project: {
            select: { name: true, projectCode: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.project.findMany({
        where: { status: { in: ['PLANNED', 'IN_PROGRESS'] } },
        select: {
          id: true,
          projectCode: true,
          name: true,
          status: true,
          priority: true,
          progress: true,
          manager: {
            select: { name: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),
      prisma.department.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          _count: {
            select: { members: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.attendanceRecord.findFirst({
        where: {
          userId: auth.id,
          date: todayStr,
        },
      }),
      prisma.employeeProfile.count({ where: { isDemo: true } }),
    ])

    // Compute task counts by status
    const tasksByStatus: { [key: string]: number } = {
      BACKLOG: 0,
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
      BLOCKED: 0,
    }

    tasks.forEach((t) => {
      const s = t.status || 'TODO'
      if (tasksByStatus[s] !== undefined) {
        tasksByStatus[s]++
      } else {
        tasksByStatus['TODO']++
      }
    })

    // Compute upcoming deadlines (due today or in future, or overdue)
    const upcomingDeadlines = tasks
      .filter((t) => t.dueDate && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5)

    return res.status(200).json({
      metrics: {
        activeEmployees: activeEmployeesCount,
        activeProjects: activeProjectsCount,
        pendingLeaves: pendingLeavesCount,
        totalTasks: tasks.length,
        tasksByStatus,
      },
      projects,
      recentAuditLogs,
      departmentDistribution: departments.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        memberCount: d._count.members,
      })),
      upcomingDeadlines,
      myAttendanceToday,
      hasDemoData: demoRecordsCount > 0,
    })
  } catch (error) {
    console.error('Failed to compute dashboard stats:', error)
    return res.status(500).json({ error: 'Failed to retrieve dashboard metrics' })
  }
}
