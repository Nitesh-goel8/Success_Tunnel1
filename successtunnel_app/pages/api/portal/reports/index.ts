import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const exportType = req.query.export as string

      // If CSV export is requested:
      if (exportType === 'csv') {
        const reportModule = (req.query.module as string || 'employees').toLowerCase()

        if (reportModule === 'employees') {
          const employees = await prisma.user.findMany({
            include: { department: true, employeeProfile: true },
            orderBy: { id: 'asc' },
          })

          const rows = [
            ['Employee Code', 'Name', 'Email', 'Role', 'Department', 'Designation', 'Status', 'Location', 'Joining Date'],
            ...employees.map((e) => [
              `"${e.employeeProfile?.employeeCode || `ST-EMP-${e.id}`}"`,
              `"${e.name || ''}"`,
              `"${e.email}"`,
              `"${e.role}"`,
              `"${e.department?.name || 'Unassigned'}"`,
              `"${e.employeeProfile?.designation || 'Staff'}"`,
              `"${e.employeeProfile?.status || 'ACTIVE'}"`,
              `"${e.employeeProfile?.workLocation || 'Headquarters'}"`,
              `"${e.employeeProfile?.joiningDate ? new Date(e.employeeProfile.joiningDate).toISOString().split('T')[0] : ''}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Employees_Report.csv"')
          return res.status(200).send(csvContent)
        }

        if (reportModule === 'tasks') {
          const tasks = await prisma.task.findMany({
            include: { project: true, assignee: true },
            orderBy: { id: 'asc' },
          })

          const rows = [
            ['Task Code', 'Title', 'Project', 'Assignee', 'Priority', 'Status', 'Due Date'],
            ...tasks.map((t) => [
              `"${t.taskCode}"`,
              `"${t.title.replace(/"/g, '""')}"`,
              `"${t.project?.name || ''}"`,
              `"${t.assignee?.name || 'Unassigned'}"`,
              `"${t.priority}"`,
              `"${t.status}"`,
              `"${t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : ''}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Tasks_Report.csv"')
          return res.status(200).send(csvContent)
        }
      }

      // Default JSON Report Analytics
      const [
        departments,
        tasks,
        projects,
        leaves,
        expenses,
        attendanceRecords,
      ] = await Promise.all([
        prisma.department.findMany({
          select: { id: true, name: true, code: true, _count: { select: { members: true } } },
        }),
        prisma.task.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        prisma.project.findMany({
          select: { id: true, name: true, status: true, progress: true, budget: true },
        }),
        prisma.leaveRequest.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        prisma.expense.groupBy({
          by: ['status'],
          _sum: { amount: true },
          _count: { id: true },
        }),
        prisma.attendanceRecord.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
      ])

      return res.status(200).json({
        generatedAt: new Date().toISOString(),
        departments: departments.map((d) => ({
          name: d.name,
          code: d.code,
          count: d._count.members,
        })),
        taskDistribution: tasks.map((t) => ({
          status: t.status,
          count: t._count.id,
        })),
        projects,
        leaveDistribution: leaves.map((l) => ({
          status: l.status,
          count: l._count.id,
        })),
        expenses: expenses.map((e) => ({
          status: e.status,
          totalAmount: e._sum.amount || 0,
          count: e._count.id,
        })),
        attendance: attendanceRecords.map((a) => ({
          status: a.status,
          count: a._count.id,
        })),
      })
    } catch (error) {
      console.error('Failed to generate reports:', error)
      return res.status(500).json({ error: 'Failed to generate management reports' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
