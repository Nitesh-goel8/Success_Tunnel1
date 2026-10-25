import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = req.query.secret || req.headers['x-admin-secret']
  if (
    secretKey !== 'ST_SUPER_ADMIN_2026' &&
    secretKey !== 'nitesh2005' &&
    secretKey !== process.env.JWT_SECRET
  ) {
    return res.status(403).json({ error: 'Unauthorized: admin secret required' })
  }

  try {
    const report: any = {
      userUpdated: null,
      departmentUpdated: null,
      augustAttendance: 0,
      septemberAttendance: 0,
      octoberAttendance: 0,
      totalAttendance: 0,
      augustTasks: 0,
      septemberTasks: 0,
      invoicesCreated: 0,
    }

    // 1. Get Nitesh Goel user
    const user = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })

    if (!user) {
      return res.status(404).json({ error: 'User niteshgoel@successtunnel.in not found' })
    }

    // 2. Ensure Engineering Department exists & assign Nitesh Goel
    let engDept = await prisma.department.findUnique({
      where: { code: 'ENG' },
    })

    if (!engDept) {
      engDept = await prisma.department.create({
        data: {
          code: 'ENG',
          name: 'Engineering & Technology',
          description: 'Software architecture, cloud infrastructure, and product engineering.',
        },
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        departmentId: engDept.id,
        role: 'super_admin',
        status: 'active',
      },
    })

    await prisma.department.update({
      where: { id: engDept.id },
      data: { headId: user.id },
    })

    const niteshProfile = await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: {
        employeeCode: 'ST-ENG-001',
        designation: 'Head of Engineering & Principal Solutions Architect',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
        managerId: null,
      },
      create: {
        userId: user.id,
        employeeCode: 'ST-ENG-001',
        designation: 'Head of Engineering & Principal Solutions Architect',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
      },
    })

    report.userUpdated = `Nitesh Goel (id ${user.id}) assigned to ENG as Head of Engineering (ST-ENG-001)`
    report.departmentUpdated = `Department ENG head set to ${user.id}`

    // 3. Generate Weekdays Helper (Year, Month 1-12)
    function getWeekdaysForMonth(year: number, monthIndex: number): string[] {
      const dates: string[] = []
      // monthIndex: 0 = Jan, 7 = Aug, 8 = Sep, 9 = Oct
      const totalDays = new Date(year, monthIndex + 1, 0).getDate()
      for (let day = 1; day <= totalDays; day++) {
        const d = new Date(Date.UTC(year, monthIndex, day))
        const dayOfWeek = d.getUTCDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Monday - Friday
          dates.push(d.toISOString().split('T')[0])
        }
      }
      return dates
    }

    // August 2026 (Month index 7)
    const augDates = getWeekdaysForMonth(2026, 7)
    // September 2026 (Month index 8)
    const sepDates = getWeekdaysForMonth(2026, 8)
    // October 2026 (Month index 9) up to day 24
    const octDates = getWeekdaysForMonth(2026, 9).filter((d) => parseInt(d.split('-')[2], 10) <= 24)

    const allDates = [
      { month: 'AUG', dates: augDates },
      { month: 'SEP', dates: sepDates },
      { month: 'OCT', dates: octDates },
    ]

    const shiftNotes = [
      'Executive Architectural Review & Sprint Sign-off',
      'Supabase Database Pooling & Connection Stress Test',
      'Three.js 3D WebGL Spatial Tunnel Performance Optimization',
      'Consortium Debt Syndication Milestone Scrutiny',
      'Enterprise RBAC & Security Audit Session',
      'Full-Stack API Pipeline Benchmarking',
      'Sprint Review & Cross-Pod Technology Governance',
      'Cloud Infrastructure High-Availability Profiling',
    ]

    for (const group of allDates) {
      for (let i = 0; i < group.dates.length; i++) {
        const dateStr = group.dates[i]
        const hash = (user.id * 43 + parseInt(dateStr.replace(/-/g, ''), 10)) % 100

        const inHour = 9
        const inMin = 10 + (hash % 16) // 9:10 to 9:26 AM
        const durationMinutes = 525 + (hash % 35) // ~9h 15m
        const status = hash > 92 ? 'LATE' : 'PRESENT'
        const note = shiftNotes[i % shiftNotes.length]

        const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
        const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

        await prisma.attendanceRecord.upsert({
          where: { userId_date: { userId: user.id, date: dateStr } },
          update: { checkIn, checkOut, durationMinutes, status, notes: note, isDemo: true },
          create: { userId: user.id, date: dateStr, checkIn, checkOut, durationMinutes, status, notes: note, isDemo: true },
        })

        if (group.month === 'AUG') report.augustAttendance++
        if (group.month === 'SEP') report.septemberAttendance++
        if (group.month === 'OCT') report.octoberAttendance++
        report.totalAttendance++
      }
    }

    // 4. Seed August & September Completed Tasks
    const defaultPrj = await prisma.project.findFirst({
      where: { projectCode: 'ST-PRJ-2026-01' },
    })
    const prjId = defaultPrj ? defaultPrj.id : 1

    const historicTasks = [
      {
        taskCode: 'ST-TSK-AUG-01',
        title: 'Formulate Q3 Enterprise Technology Architecture Strategy',
        desc: 'Defined high-concurrency architecture parameters, microservices boundaries, and data models.',
        status: 'DONE',
        priority: 'CRITICAL',
        dueDate: new Date('2026-08-14T17:00:00.000Z'),
      },
      {
        taskCode: 'ST-TSK-AUG-02',
        title: 'Architect Panipat Industrial Commercial Land Title Protocol',
        desc: 'Validated statutory land clearances and lease covenant templates for corporate commercial assets.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date('2026-08-21T17:00:00.000Z'),
      },
      {
        taskCode: 'ST-TSK-AUG-03',
        title: 'Sign Off MCA & Statutory Corporate Compliance Audit File',
        desc: 'Conducted mandatory corporate financial disclosures and statutory secretarial filings.',
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: new Date('2026-08-28T17:00:00.000Z'),
      },
      {
        taskCode: 'ST-TSK-SEP-01',
        title: 'Validate Three.js 3D WebGL Spatial Tunnel Physics Engine',
        desc: 'Implemented procedural geometric framing, smooth camera easing, and shader particle trails.',
        status: 'DONE',
        priority: 'CRITICAL',
        dueDate: new Date('2026-09-11T17:00:00.000Z'),
      },
      {
        taskCode: 'ST-TSK-SEP-02',
        title: 'Structure Institutional Debt Consortium Security Package',
        desc: 'Finalized debt covenants, credit facility term sheets, and institutional security charges.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date('2026-09-18T17:00:00.000Z'),
      },
      {
        taskCode: 'ST-TSK-SEP-03',
        title: 'Deploy Enterprise JWT RBAC & Sliding Session Guards',
        desc: 'Audited authentication middleware, HttpOnly cookies, and role-based permissions matrix.',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: new Date('2026-09-25T17:00:00.000Z'),
      },
    ]

    for (const ht of historicTasks) {
      await prisma.task.upsert({
        where: { taskCode: ht.taskCode },
        update: {
          title: ht.title,
          description: ht.desc,
          status: ht.status,
          priority: ht.priority,
          assigneeId: user.id,
          creatorId: user.id,
          projectId: prjId,
          dueDate: ht.dueDate,
        },
        create: {
          taskCode: ht.taskCode,
          title: ht.title,
          description: ht.desc,
          status: ht.status,
          priority: ht.priority,
          assigneeId: user.id,
          creatorId: user.id,
          projectId: prjId,
          dueDate: ht.dueDate,
        },
      })
      if (ht.taskCode.includes('AUG')) report.augustTasks++
      if (ht.taskCode.includes('SEP')) report.septemberTasks++
    }

    // 5. Seed Invoices across August, September, October
    const cust = await prisma.customer.findFirst()
    if (cust) {
      const historicInvoices = [
        {
          invoiceNumber: 'ST-INV-2026-AUG-01',
          customerId: cust.id,
          projectId: prjId,
          subtotal: 580000,
          taxAmount: 104400,
          totalAmount: 684400,
          status: 'PAID',
          issueDate: new Date('2026-08-10T10:00:00.000Z'),
          dueDate: new Date('2026-08-25T17:00:00.000Z'),
        },
        {
          invoiceNumber: 'ST-INV-2026-SEP-01',
          customerId: cust.id,
          projectId: prjId,
          subtotal: 750000,
          taxAmount: 135000,
          totalAmount: 885000,
          status: 'PAID',
          issueDate: new Date('2026-09-08T10:00:00.000Z'),
          dueDate: new Date('2026-09-23T17:00:00.000Z'),
        },
      ]

      for (const inv of historicInvoices) {
        await prisma.invoice.upsert({
          where: { invoiceNumber: inv.invoiceNumber },
          update: inv,
          create: inv,
        })
        report.invoicesCreated++
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Embedded 3 months of comprehensive data (August, September, October 2026)',
      report,
    })
  } catch (error: any) {
    console.error('Failed to seed 3-month data:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
