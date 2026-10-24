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
            ['Employee Code', 'Name', 'Email', 'Role', 'Department', 'Designation', 'Status', 'Location', 'Joining Date', 'Environment'],
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
              `"${e.employeeProfile?.isDemo ? 'DEMO DATA' : 'PRODUCTION'}"`,
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
            ['Task Code', 'Title', 'Project', 'Assignee', 'Priority', 'Status', 'Due Date', 'Environment'],
            ...tasks.map((t) => [
              `"${t.taskCode}"`,
              `"${t.title.replace(/"/g, '""')}"`,
              `"${t.project?.name || ''}"`,
              `"${t.assignee?.name || 'Unassigned'}"`,
              `"${t.priority}"`,
              `"${t.status}"`,
              `"${t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : ''}"`,
              `"${t.isDemo ? 'DEMO DATA' : 'PRODUCTION'}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Tasks_Report.csv"')
          return res.status(200).send(csvContent)
        }

        if (reportModule === 'invoices') {
          const invoices = await prisma.invoice.findMany({
            include: { customer: true, project: true },
            orderBy: { issueDate: 'desc' },
          })

          const rows = [
            ['Invoice Number', 'Customer', 'Project', 'Issue Date', 'Due Date', 'Subtotal', 'Tax (18%)', 'Total Amount', 'Status', 'Environment'],
            ...invoices.map((inv) => [
              `"${inv.invoiceNumber}"`,
              `"${inv.customer?.name || inv.customer?.company || 'Direct Client'}"`,
              `"${inv.project?.name || '-'}"`,
              `"${new Date(inv.issueDate).toISOString().split('T')[0]}"`,
              `"${new Date(inv.dueDate).toISOString().split('T')[0]}"`,
              inv.subtotal.toFixed(2),
              inv.taxAmount.toFixed(2),
              inv.totalAmount.toFixed(2),
              `"${inv.status}"`,
              `"${inv.isDemo ? 'DEMO DATA' : 'PRODUCTION'}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Invoices_Report.csv"')
          return res.status(200).send(csvContent)
        }

        if (reportModule === 'payments') {
          const payments = await prisma.payment.findMany({
            include: { customer: true, invoice: true, project: true },
            orderBy: { paymentDate: 'desc' },
          })

          const rows = [
            ['Payment Number', 'Invoice Number', 'Customer', 'Project', 'Amount (INR)', 'Payment Date', 'Method', 'Transaction Ref', 'Status', 'Environment'],
            ...payments.map((p) => [
              `"${p.paymentNumber}"`,
              `"${p.invoice?.invoiceNumber || '-'}"`,
              `"${p.customer?.name || p.customer?.company || '-'}"`,
              `"${p.project?.name || '-'}"`,
              p.amount.toFixed(2),
              `"${new Date(p.paymentDate).toISOString().split('T')[0]}"`,
              `"${p.paymentMethod}"`,
              `"${p.transactionReference || '-'}"`,
              `"${p.status}"`,
              `"${p.isDemo ? 'DEMO DATA' : 'PRODUCTION'}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Payments_Report.csv"')
          return res.status(200).send(csvContent)
        }

        if (reportModule === 'audit-logs' || reportModule === 'audit') {
          // Restricted to administrative roles
          const isAdminRole = ['super_admin', 'admin', 'hr_admin', 'finance_admin'].includes(auth.role)
          if (!isAdminRole) {
            return res.status(403).json({ error: 'Access denied. Audit logs export requires administrative privileges.' })
          }

          const logs = await prisma.auditLog.findMany({
            include: { user: { select: { name: true, email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            take: 2000,
          })

          const rows = [
            ['Log ID', 'Timestamp (UTC)', 'Actor Name', 'Actor Email', 'Actor Role', 'Action', 'Module', 'Entity ID', 'Details', 'IP Origin'],
            ...logs.map((l) => [
              l.id,
              `"${l.createdAt.toISOString()}"`,
              `"${l.user?.name || 'System'}"`,
              `"${l.user?.email || '-'}"`,
              `"${l.user?.role || '-'}"`,
              `"${l.action}"`,
              `"${l.entityType}"`,
              `"${l.entityId || '-'}"`,
              `"${(l.details || '').replace(/"/g, '""')}"`,
              `"${l.ipAddress || '127.0.0.1'}"`,
            ]),
          ]

          const csvContent = rows.map((r) => r.join(',')).join('\n')
          res.setHeader('Content-Type', 'text/csv; charset=utf-8')
          res.setHeader('Content-Disposition', 'attachment; filename="Success_Tunnel_Audit_Logs_Report.csv"')
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
        invoicesAgg,
        paymentsAgg,
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
        prisma.invoice.aggregate({
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ])

      const totalReceivedRevenue = paymentsAgg._sum.amount || 0
      const totalInvoiced = invoicesAgg._sum.totalAmount || 0
      const approvedExpenses = expenses
        .filter((e) => e.status === 'APPROVED' || e.status === 'REIMBURSED')
        .reduce((acc, curr) => acc + (curr._sum.amount || 0), 0)

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
        financialMetrics: {
          totalInvoiced,
          totalReceivedRevenue,
          approvedExpenses,
          netOperatingFlow: totalReceivedRevenue - approvedExpenses,
          invoicesCount: invoicesAgg._count.id,
          paymentsCount: paymentsAgg._count.id,
          currency: 'INR',
        },
      })
    } catch (error) {
      console.error('Failed to generate reports:', error)
      return res.status(500).json({ error: 'Failed to generate management reports' })
    }
  }

  res.setHeader('Allow', ['GET'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
