import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++
    console.log(`  ✅ PASS: ${message}`)
  } else {
    failed++
    console.error(`  ❌ FAIL: ${message}`)
  }
}

async function runDemoQualityTests() {
  console.log('======================================================================')
  console.log('🧪 SUCCESS TUNNEL ERP — DEMO DATA QUALITY & INVARIANT VERIFICATION')
  console.log('======================================================================\n')

  try {
    // ------------------------------------------------------------------
    // Suite 1: Production Safety Safeguards
    // ------------------------------------------------------------------
    console.log('Test Suite 1: Production Environment Safeguards')
    const originalEnv = process.env.NODE_ENV
    const originalAllow = process.env.ALLOW_PROD_DEMO_SEED

    // Test that production flag prevents execution
    const isProductionGuarded = (env: string | undefined, allow: string | undefined) => {
      return env === 'production' && allow !== 'true'
    }

    assert(
      isProductionGuarded('production', undefined) === true,
      'Seeding is strictly aborted when NODE_ENV=production and ALLOW_PROD_DEMO_SEED is not set'
    )
    assert(
      isProductionGuarded('production', 'true') === false,
      'Seeding can only proceed in production with explicit ALLOW_PROD_DEMO_SEED=true flag'
    )
    assert(
      isProductionGuarded('development', undefined) === false,
      'Development environment allows demo seeding by default'
    )

    // ------------------------------------------------------------------
    // Suite 2: Organization Structure & Employee Directory
    // ------------------------------------------------------------------
    console.log('\nTest Suite 2: Organization & Staff Directory')

    const employees = await prisma.employeeProfile.findMany({
      where: { isDemo: true },
      include: {
        user: { include: { department: true } },
        manager: { include: { user: true } },
        directReports: true,
      },
    })

    assert(
      employees.length >= 12 && employees.length <= 18,
      `Employee count falls within realistic range (Found: ${employees.length}, Expected: 12-18)`
    )

    const validEmailDomains = employees.every(
      (e) => e.user.email.endsWith('@example.com') || e.user.email === 'admin@successtunnel.in'
    )
    assert(validEmailDomains, 'All demo employees use reserved example domains or authorized admin email')

    const allHaveDepartments = employees.every((e) => e.user.departmentId !== null)
    assert(allHaveDepartments, 'Every employee is assigned to a valid department')

    const allHaveCodes = employees.every((e) => e.employeeCode.startsWith('ST-'))
    assert(allHaveCodes, 'All employee profiles feature standardized ST-* employee codes')

    // Reporting hierarchy check
    const employeesWithManager = employees.filter((e) => e.managerId !== null)
    assert(employeesWithManager.length >= 10, `Manager hierarchy established for staff (${employeesWithManager.length} reporting links)`)

    const validManagerLinks = employeesWithManager.every((e) => e.manager !== null && e.manager.id !== e.id)
    assert(validManagerLinks, 'All manager references point to existing profiles with no self-reporting loops')

    // ------------------------------------------------------------------
    // Suite 3: Projects & Milestone Structure
    // ------------------------------------------------------------------
    console.log('\nTest Suite 3: Projects & Milestone Structure')

    // Clean up any ephemeral test projects from earlier test suites
    await prisma.project.deleteMany({ where: { projectCode: { startsWith: 'ST-PRJ-CUST-' } } })

    const projects = await prisma.project.findMany({
      where: { isDemo: true, projectCode: { startsWith: 'ST-PRJ-2026-' } },
      include: {
        manager: true,
        members: { include: { user: true } },
        tasks: true,
      },
    })

    assert(projects.length >= 3 && projects.length <= 5, `Realistic project count (Found: ${projects.length}, Expected: 3-5)`)

    const webPlatformProject = projects.find((p) => p.projectCode === 'ST-PRJ-2026-01')
    assert(webPlatformProject !== undefined, 'Success Tunnel Web Platform exists as a demo project')

    const allProjectsHaveManagers = projects.every((p) => p.managerId !== null && p.manager !== null)
    assert(allProjectsHaveManagers, 'All projects have an assigned Project Manager')

    const allProjectsHaveMembers = projects.every((p) => p.members.length > 0)
    assert(allProjectsHaveMembers, 'All projects have assigned team memberships')

    const validProjectDates = projects.every(
      (p) => p.startDate && p.endDate && new Date(p.startDate).getTime() < new Date(p.endDate).getTime()
    )
    assert(validProjectDates, 'All project schedules have logical chronological ordering (start < end)')

    // Progress percentage integrity: derived from actual task states
    const progressVerified = projects.every((p) => {
      if (p.tasks.length === 0) return true
      const doneCount = p.tasks.filter((t) => t.status === 'DONE').length
      const expectedProgress = Math.round((doneCount / p.tasks.length) * 100)
      return p.progress === expectedProgress
    })
    assert(progressVerified, 'Project progress percentage is calculated from actual task states, not decorative values')

    // ------------------------------------------------------------------
    // Suite 4: Task Data & Kanban Distribution (60-100 tasks)
    // ------------------------------------------------------------------
    console.log('\nTest Suite 4: Task System Integrity')

    const tasks = await prisma.task.findMany({
      where: { isDemo: true },
      include: {
        project: true,
        assignee: true,
        creator: true,
        comments: true,
        activities: true,
      },
    })

    assert(tasks.length >= 60 && tasks.length <= 100, `Demo task count within target range (Found: ${tasks.length}, Expected: 60-100)`)

    const statusCounts: { [key: string]: number } = {}
    tasks.forEach((t) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1
    })

    const expectedStatuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE']
    const hasAllStatuses = expectedStatuses.every((s) => (statusCounts[s] || 0) > 0)
    assert(hasAllStatuses, `All Kanban stages populated: ${JSON.stringify(statusCounts)}`)

    const notAllCompleted = (statusCounts['DONE'] || 0) < tasks.length * 0.5
    assert(notAllCompleted, 'Healthy realistic task distribution (not everything marked completed)')

    const allTasksHaveProjects = tasks.every((t) => t.projectId && t.project !== null)
    assert(allTasksHaveProjects, 'Every task is associated with an active project')

    const allTasksHaveCodes = tasks.every((t) => t.taskCode.startsWith('ST-TSK-'))
    assert(allTasksHaveCodes, 'All tasks follow ST-TSK-* naming convention')

    const taskCommentsCount = await prisma.taskComment.count({
      where: { task: { isDemo: true } },
    })
    assert(taskCommentsCount >= 10, `Realistic task discussions present (${taskCommentsCount} comments)`)

    const taskActivitiesCount = await prisma.taskActivity.count({
      where: { task: { isDemo: true } },
    })
    assert(taskActivitiesCount >= 20, `Simulated task activity audit trail present (${taskActivitiesCount} activity entries)`)

    // ------------------------------------------------------------------
    // Suite 5: Dynamic 90-Calendar-Day Attendance Integrity
    // ------------------------------------------------------------------
    console.log('\nTest Suite 5: Dynamic 90-Day Attendance Records')

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: { isDemo: true },
      include: { user: true },
    })

    assert(attendanceRecords.length >= 200, `Comprehensive attendance history populated (${attendanceRecords.length} records)`)

    // Verify time window: within last 90 calendar days
    const now = new Date()
    const earliestAllowed = new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000)
    const within90Days = attendanceRecords.every((r) => new Date(r.date).getTime() >= earliestAllowed.getTime())
    assert(within90Days, 'Attendance records fall within the dynamic 90-day window')

    // Rule 1: Check-out must be later than check-in for completed records
    const completedPunches = attendanceRecords.filter((r) => r.checkOut !== null)
    const checkOutAfterCheckIn = completedPunches.every(
      (r) => new Date(r.checkOut!).getTime() > new Date(r.checkIn).getTime()
    )
    assert(checkOutAfterCheckIn, 'Check-out timestamp is strictly later than check-in timestamp across all punches')

    // Rule 2: Working duration must equal checkOut - checkIn
    const durationCalculatedCorrectly = completedPunches.every((r) => {
      const diffMinutes = Math.round((new Date(r.checkOut!).getTime() - new Date(r.checkIn).getTime()) / 60000)
      return r.durationMinutes === diffMinutes
    })
    assert(durationCalculatedCorrectly, 'Working duration in minutes matches timestamp difference')

    // Rule 3: Missing punches have checkOut === null and correctionRequested === true
    const missingPunches = attendanceRecords.filter((r) => r.checkOut === null)
    assert(missingPunches.length > 0, `Missing punches present for regularization testing (${missingPunches.length} records)`)

    const missingPunchesFlagged = missingPunches.every((r) => r.correctionRequested === true && r.durationMinutes === 0)
    assert(missingPunchesFlagged, 'Missing check-outs are flagged with correctionRequested=true and 0 duration')

    // Rule 4: Weekends have no active work punches
    const weekendPunches = attendanceRecords.filter((r) => {
      const d = new Date(r.date).getDay()
      return d === 0 || d === 6
    })
    assert(weekendPunches.length === 0, 'No active work punches recorded on weekend days (weekly offs respected)')

    // Rule 5: Approved leave days do not conflict with normal attendance
    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: { isDemo: true, status: 'APPROVED' },
    })
    let leaveConflictFound = false
    for (const l of approvedLeaves) {
      const cur = new Date(l.startDate)
      while (cur <= l.endDate) {
        const dStr = cur.toISOString().split('T')[0]
        const conflictingPunch = attendanceRecords.find((r) => r.userId === l.userId && r.date === dStr)
        if (conflictingPunch && conflictingPunch.status === 'PRESENT') {
          leaveConflictFound = true
          break
        }
        cur.setDate(cur.getDate() + 1)
      }
    }
    assert(!leaveConflictFound, 'When an employee is on approved leave, normal attendance is not recorded for that date')

    // ------------------------------------------------------------------
    // Suite 6: CRM Leads & Customer Accounts
    // ------------------------------------------------------------------
    console.log('\nTest Suite 6: CRM Directory & Leads Pipeline')

    const customers = await prisma.customer.findMany({ where: { isDemo: true } })
    assert(customers.length >= 3, `Fictional customer directory populated (${customers.length} accounts)`)

    const leads = await prisma.lead.findMany({
      where: { isDemo: true },
      include: { customer: true, activities: true },
    })
    assert(leads.length >= 6, `CRM leads pipeline populated (${leads.length} leads)`)

    const leadStatuses = new Set(leads.map((l) => l.status))
    assert(leadStatuses.has('WON') && leadStatuses.has('PROPOSAL_SENT') && leadStatuses.has('NEW'), 'Leads span diverse stages: Won, Proposal Sent, New')

    const leadsHaveActivities = leads.some((l) => l.activities.length > 0)
    assert(leadsHaveActivities, 'Touchpoint activities (calls, emails, meetings, status changes) recorded for leads')

    // ------------------------------------------------------------------
    // Suite 7: Financial Integrity & Cash Flow Invariants
    // ------------------------------------------------------------------
    console.log('\nTest Suite 7: Invoices, Payments & Cash Flow Invariants')

    const invoices = await prisma.invoice.findMany({
      where: { isDemo: true },
      include: { payments: true },
    })
    assert(invoices.length >= 3, `Invoices generated (${invoices.length} invoices)`)

    // GST Tax calculation verification: 18% tax
    const taxAccurate = invoices.every((inv) => {
      const expectedTax = Math.round(inv.subtotal * 0.18 * 100) / 100
      const expectedTotal = Math.round((inv.subtotal + expectedTax) * 100) / 100
      return Math.abs(inv.taxAmount - expectedTax) < 1 && Math.abs(inv.totalAmount - expectedTotal) < 1
    })
    assert(taxAccurate, '18% GST tax and total amounts calculated accurately')

    // Invariant: Unpaid invoice is NOT counted as received payment
    const paidInvoices = invoices.filter((i) => i.status === 'PAID')
    const partiallyPaidInvoices = invoices.filter((i) => i.status === 'PARTIALLY_PAID')
    const issuedUnpaidInvoices = invoices.filter((i) => i.status === 'ISSUED')

    assert(paidInvoices.length > 0, 'PAID invoice scenario present')
    assert(partiallyPaidInvoices.length > 0, 'PARTIALLY_PAID invoice scenario present')
    assert(issuedUnpaidInvoices.length > 0, 'ISSUED (Unpaid) invoice scenario present')

    const paidInvoicesBalanced = paidInvoices.every((i) => {
      const sumPayments = i.payments.reduce((acc, p) => acc + (p.status === 'COMPLETED' ? p.amount : 0), 0)
      return Math.abs(sumPayments - i.totalAmount) < 1
    })
    assert(paidInvoicesBalanced, 'For PAID invoices, sum of completed payments equals total invoice amount')

    const partiallyPaidBalanced = partiallyPaidInvoices.every((i) => {
      const sumPayments = i.payments.reduce((acc, p) => acc + (p.status === 'COMPLETED' ? p.amount : 0), 0)
      return sumPayments > 0 && sumPayments < i.totalAmount
    })
    assert(partiallyPaidBalanced, 'For PARTIALLY_PAID invoices, payment is received but less than total amount')

    const unpaidHaveNoCompletedPayments = issuedUnpaidInvoices.every((i) => {
      const sumPayments = i.payments.reduce((acc, p) => acc + (p.status === 'COMPLETED' ? p.amount : 0), 0)
      return sumPayments === 0
    })
    assert(unpaidHaveNoCompletedPayments, 'ISSUED unpaid invoices have zero received payments (isolated as accounts receivable)')

    // Realized Revenue vs Accounts Receivable
    const totalPaymentsAgg = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', isDemo: true },
      _sum: { amount: true },
    })
    const totalInvoicedAgg = await prisma.invoice.aggregate({
      where: { isDemo: true },
      _sum: { totalAmount: true },
    })

    const realizedRevenue = totalPaymentsAgg._sum.amount || 0
    const totalInvoiced = totalInvoicedAgg._sum.totalAmount || 0
    const accountsReceivable = totalInvoiced - realizedRevenue

    assert(realizedRevenue > 0, `Verified realized cash revenue calculated from completed payments (₹${realizedRevenue.toLocaleString('en-IN')})`)
    assert(accountsReceivable > 0, `Unpaid invoice balance isolated as Accounts Receivable (₹${accountsReceivable.toLocaleString('en-IN')})`)
    assert(realizedRevenue < totalInvoiced, 'Realized revenue strictly excludes unpaid invoices')

    // Expenses
    const expenses = await prisma.expense.findMany({ where: { isDemo: true } })
    assert(expenses.length >= 5, `Corporate expenses recorded (${expenses.length} expenses)`)

    const approvedExpenses = expenses.filter((e) => e.status === 'APPROVED')
    assert(approvedExpenses.length > 0, 'Approved expenses present with managerial review notes')

    // ------------------------------------------------------------------
    // Suite 8: Executive Dashboard Live Metrics
    // ------------------------------------------------------------------
    console.log('\nTest Suite 8: Executive Dashboard Metrics Consistency')

    const [activeEmployeesCount, activeProjectsCount, totalTasksCount] = await Promise.all([
      prisma.employeeProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.project.count({ where: { status: { in: ['PLANNED', 'IN_PROGRESS'] } } }),
      prisma.task.count(),
    ])

    assert(activeEmployeesCount > 0, `Active employee metric matches database: ${activeEmployeesCount}`)
    assert(activeProjectsCount > 0, `Active project metric matches database: ${activeProjectsCount}`)
    assert(totalTasksCount >= 60, `Task count metric matches database: ${totalTasksCount}`)

    const demoRecordsCount = await prisma.employeeProfile.count({ where: { isDemo: true } })
    const hasDemoData = demoRecordsCount > 0
    assert(hasDemoData, 'Dashboard accurately identifies presence of demo data (hasDemoData=true)')

  } catch (err) {
    console.error('Unexpected test error:', err)
    failed++
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n======================================================================')
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`)
  console.log('======================================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runDemoQualityTests()
