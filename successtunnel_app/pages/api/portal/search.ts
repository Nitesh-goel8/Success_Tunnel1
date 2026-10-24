import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authenticateApi } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  const auth = await authenticateApi(req, res)
  if (!auth) return

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''

  if (!query || query.length < 2) {
    return res.status(200).json({
      query: '',
      navigation: [],
      projects: [],
      tasks: [],
      employees: [],
      leads: [],
      customers: [],
    })
  }

  const isSuperAdmin = auth.role === 'super_admin' || auth.role === 'admin'
  const isHrAdmin = isSuperAdmin || auth.role === 'hr_admin'
  const isFinanceAdmin = isSuperAdmin || auth.role === 'finance_admin'

  try {
    // 1. Navigation items matching
    const navModules = [
      { label: 'Executive Dashboard', href: '/portal/dashboard', category: 'Navigation', icon: 'view-grid' },
      { label: 'Employee Directory', href: '/portal/employees', category: 'HR & Directory', icon: 'users' },
      { label: 'Departments & Org', href: '/portal/departments', category: 'HR & Directory', icon: 'office-building' },
      { label: 'Project Roadmaps', href: '/portal/projects', category: 'Projects', icon: 'clipboard-list' },
      { label: 'Task Kanban Board', href: '/portal/tasks', category: 'Projects', icon: 'clipboard-check' },
      { label: 'Engineering Hub & Git Ledger', href: '/portal/engineering', category: 'Projects', icon: 'code' },
      { label: 'CRM & Lead Pipeline', href: '/portal/crm', category: 'Sales & CRM', icon: 'user-group' },
      { label: 'Customer Directory', href: '/portal/crm?tab=customers', category: 'Sales & CRM', icon: 'users' },
      { label: 'Website Enquiries', href: '/portal/crm?tab=enquiries', category: 'Sales & CRM', icon: 'mail' },
      { label: 'Workforce Attendance', href: '/portal/attendance', category: 'Workforce', icon: 'clock' },
      { label: 'Leaves & Holidays', href: '/portal/leaves', category: 'Workforce', icon: 'calendar' },
      { label: 'Corporate Documents', href: '/portal/documents', category: 'Documents', icon: 'document-text' },
      { label: 'Expense Management', href: '/portal/finance', category: 'Finance', icon: 'cash' },
      { label: 'Reports & Analytics', href: '/portal/reports', category: 'Insights', icon: 'chart-bar' },
      ...(isSuperAdmin || isHrAdmin || isFinanceAdmin
        ? [{ label: 'Audit Trail', href: '/portal/audit-logs', category: 'Compliance', icon: 'shield-check' }]
        : []),
    ]

    const matchedNav = navModules.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )

    // 2. Query Projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { projectCode: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        projectCode: true,
        name: true,
        status: true,
        progress: true,
      },
      take: 5,
    })

    // 3. Query Tasks
    const taskWhere: any = {
      OR: [
        { title: { contains: query } },
        { taskCode: { contains: query } },
      ],
    }
    if (!isSuperAdmin && auth.role === 'employee') {
      taskWhere.assigneeId = auth.id
    }

    const tasks = await prisma.task.findMany({
      where: taskWhere,
      select: {
        id: true,
        taskCode: true,
        title: true,
        status: true,
        priority: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5,
    })

    // 4. Query Employees
    const employees = await prisma.user.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
          { employeeProfile: { employeeCode: { contains: query } } },
          { employeeProfile: { designation: { contains: query } } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: { select: { name: true } },
        employeeProfile: {
          select: {
            employeeCode: true,
            designation: true,
          },
        },
      },
      take: 5,
    })

    // 5. Query CRM Leads
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { leadCode: { contains: query } },
          { contactName: { contains: query } },
          { company: { contains: query } },
        ],
      },
      select: {
        id: true,
        leadCode: true,
        title: true,
        contactName: true,
        status: true,
        estimatedValue: true,
      },
      take: 5,
    })

    // 6. Query Customers
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { customerCode: { contains: query } },
          { company: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: {
        id: true,
        customerCode: true,
        name: true,
        company: true,
        status: true,
      },
      take: 5,
    })

    return res.status(200).json({
      query,
      navigation: matchedNav,
      projects: projects.map((p) => ({
        id: p.id,
        code: p.projectCode,
        title: p.name,
        status: p.status,
        progress: p.progress,
        href: `/portal/projects`,
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        code: t.taskCode,
        title: t.title,
        status: t.status,
        priority: t.priority,
        projectName: t.project.name,
        href: `/portal/tasks?search=${encodeURIComponent(t.taskCode)}`,
      })),
      employees: employees.map((e) => ({
        id: e.id,
        name: e.name || e.email,
        email: e.email,
        designation: e.employeeProfile?.designation || e.role,
        department: e.department?.name || 'General',
        employeeCode: e.employeeProfile?.employeeCode || `ST-EMP-${e.id}`,
        href: `/portal/employees?search=${encodeURIComponent(e.email)}`,
      })),
      leads: leads.map((l) => ({
        id: l.id,
        code: l.leadCode,
        title: l.title,
        contactName: l.contactName,
        status: l.status,
        value: l.estimatedValue,
        href: `/portal/crm?leadId=${l.id}`,
      })),
      customers: customers.map((c) => ({
        id: c.id,
        code: c.customerCode,
        name: c.name,
        company: c.company || '',
        status: c.status,
        href: `/portal/crm?tab=customers&search=${encodeURIComponent(c.customerCode)}`,
      })),
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return res.status(500).json({ error: 'Failed to execute search query' })
  }
}
