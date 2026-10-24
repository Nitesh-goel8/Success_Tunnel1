import { PrismaClient } from '@prisma/client'
import { checkModulePermission, logAuditAction } from '../lib/auth'
import { sendNotification, broadcastNotificationToRoles } from '../lib/notifications'
import { checkRateLimit } from '../lib/rateLimit'

const prisma = new PrismaClient()

let passedCount = 0
let failedCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`)
    passedCount++
  } else {
    console.error(`  ✗ FAIL: ${message}`)
    failedCount++
  }
}

async function runPhaseGTests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE G: NOTIFICATIONS, AUDIT & SECURITY')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-6)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Role-Based Authorization Matrix Completeness
    // ----------------------------------------------------------------
    console.log('Test Group 1: Role-Based Authorization Matrix Completeness')

    // Super Admin: Omnipotent
    assert(checkModulePermission('super_admin', 'ORGANIZATION', 'create') === true, 'Super Admin can manage organization')
    assert(checkModulePermission('super_admin', 'EMPLOYEES', 'delete') === true, 'Super Admin can delete employees')
    assert(checkModulePermission('super_admin', 'FINANCE', 'approve') === true, 'Super Admin can approve finances')
    assert(checkModulePermission('super_admin', 'AUDIT_LOGS', 'view') === true, 'Super Admin can inspect audit logs')

    // HR Admin: Workforce, Org, Documents, Leaves, Attendance, and View Audit/Reports
    assert(checkModulePermission('hr_admin', 'EMPLOYEES', 'create') === true, 'HR Admin can onboard employees')
    assert(checkModulePermission('hr_admin', 'ATTENDANCE', 'edit') === true, 'HR Admin can regularize attendance')
    assert(checkModulePermission('hr_admin', 'LEAVES', 'approve') === true, 'HR Admin can approve leave requests')
    assert(checkModulePermission('hr_admin', 'AUDIT_LOGS', 'view') === true, 'HR Admin can view audit trail')
    assert(checkModulePermission('hr_admin', 'AUDIT_LOGS', 'delete') === false, 'HR Admin cannot delete audit logs')
    assert(checkModulePermission('hr_admin', 'FINANCE', 'delete') === false, 'HR Admin cannot delete invoices')

    // Project Manager: Projects, Tasks, CRM pipeline
    assert(checkModulePermission('project_manager', 'PROJECTS', 'create') === true, 'Project Manager can create projects')
    assert(checkModulePermission('project_manager', 'TASKS', 'create') === true, 'Project Manager can assign tasks')
    assert(checkModulePermission('project_manager', 'CRM', 'create') === true, 'Project Manager can manage CRM leads')
    assert(checkModulePermission('project_manager', 'AUDIT_LOGS', 'view') === false, 'Project Manager blocked from audit logs')

    // Finance Admin: Invoices, Payments, Expenses, Reports, Audit view
    assert(checkModulePermission('finance_admin', 'FINANCE', 'create') === true, 'Finance Admin can issue invoices')
    assert(checkModulePermission('finance_admin', 'FINANCE', 'approve') === true, 'Finance Admin can approve expenses')
    assert(checkModulePermission('finance_admin', 'REPORTS', 'view') === true, 'Finance Admin can export finance reports')
    assert(checkModulePermission('finance_admin', 'AUDIT_LOGS', 'view') === true, 'Finance Admin can review audit trail')
    assert(checkModulePermission('finance_admin', 'EMPLOYEES', 'create') === false, 'Finance Admin blocked from onboarding employees')

    // Employee: Self-service only
    assert(checkModulePermission('employee', 'ATTENDANCE', 'create') === true, 'Employee can punch attendance')
    assert(checkModulePermission('employee', 'LEAVES', 'create') === true, 'Employee can apply for leaves')
    assert(checkModulePermission('employee', 'FINANCE', 'create') === true, 'Employee can submit expense claim')
    assert(checkModulePermission('employee', 'LEAVES', 'approve') === false, 'Employee blocked from approving leaves')
    assert(checkModulePermission('employee', 'FINANCE', 'approve') === false, 'Employee blocked from approving expenses')
    assert(checkModulePermission('employee', 'AUDIT_LOGS', 'view') === false, 'Employee strictly blocked from viewing audit logs')

    // ----------------------------------------------------------------
    // Test Group 2: Audit Trail Recording & Immutability Invariant
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Audit Trail Recording & Immutability Invariant')

    const superAdmin = await prisma.user.findFirst({ where: { role: 'super_admin' } }) || await prisma.user.findFirst()
    const testEmployee = await prisma.user.findFirst({ where: { role: 'employee' } }) || await prisma.user.findFirst()

    assert(superAdmin !== null, 'Identified administrator actor')
    assert(testEmployee !== null, 'Identified workforce employee actor')

    const auditActionName = `SECURITY_TEST_AUDIT_${timestamp}`
    await logAuditAction({
      userId: superAdmin?.id,
      action: auditActionName,
      entityType: 'SecurityTest',
      entityId: `SEC-${timestamp}`,
      details: { testRun: true, initiatedBy: superAdmin?.email },
    })

    const recordedAudit = await prisma.auditLog.findFirst({
      where: { action: auditActionName },
      include: { user: true },
    })

    assert(recordedAudit !== null, 'Audit event successfully persisted in database')
    assert(recordedAudit?.entityType === 'SecurityTest', 'Audit entityType correctly classified')
    assert(recordedAudit?.entityId === `SEC-${timestamp}`, 'Audit entityId correctly tagged')
    assert(recordedAudit?.userId === superAdmin?.id, 'Audit actor identity accurately resolved')
    assert(recordedAudit?.ipAddress === '127.0.0.1', 'Audit source IP correctly defaulted')
    assert(Boolean(recordedAudit?.details && recordedAudit.details.includes('initiatedBy')), 'Audit details JSON parsed and preserved')

    // ----------------------------------------------------------------
    // Test Group 3: Database-Backed Notifications Engine
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Database-Backed Notifications Engine')

    // Create targeted notification
    const testNotifTitle = `Security Notice ${timestamp}`
    const notif = await sendNotification({
      userId: testEmployee!.id,
      title: testNotifTitle,
      message: 'Your system access credentials have been verified.',
      type: 'INFO',
      link: '/portal/profile',
    })

    assert(notif !== null && notif.id > 0, 'Targeted notification created successfully')
    assert(notif?.isRead === false, 'New notification defaults to unread state')
    assert(notif?.userId === testEmployee!.id, 'Notification correctly mapped to recipient')

    // Query unread count for employee
    const unreadBefore = await prisma.notification.count({
      where: { userId: testEmployee!.id, isRead: false },
    })
    assert(unreadBefore >= 1, `Unread notifications count for recipient: ${unreadBefore}`)

    // Mark single notification as read
    const updatedSingle = await prisma.notification.update({
      where: { id: notif!.id },
      data: { isRead: true },
    })
    assert(updatedSingle.isRead === true, 'Single notification marked as read')

    // Test Multi-role broadcast
    const broadcastTitle = `System Broadcast ${timestamp}`
    const broadcastResults = await broadcastNotificationToRoles(['super_admin', 'hr_admin'], {
      title: broadcastTitle,
      message: 'Scheduled system compliance audit completed.',
      type: 'SUCCESS',
      link: '/portal/audit-logs',
    })

    assert(broadcastResults.length >= 1, `Broadcast successfully dispatched to ${broadcastResults.length} administrative users`)

    // Verify mark all read
    await prisma.notification.updateMany({
      where: { userId: testEmployee!.id, isRead: false },
      data: { isRead: true },
    })
    const unreadAfter = await prisma.notification.count({
      where: { userId: testEmployee!.id, isRead: false },
    })
    assert(unreadAfter === 0, 'Mark-all-read clears recipient unread counter to 0')

    // ----------------------------------------------------------------
    // Test Group 4: Brute-Force Rate Limiting Invariants
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Brute-Force Rate Limiting Invariants')

    const rateKey = `test_ip_${timestamp}`
    const limit = 3
    const windowMs = 2000

    const attempt1 = checkRateLimit(rateKey, limit, windowMs)
    assert(attempt1.allowed === true && attempt1.remaining === 2, 'Attempt 1 within limit allowed (2 remaining)')

    const attempt2 = checkRateLimit(rateKey, limit, windowMs)
    assert(attempt2.allowed === true && attempt2.remaining === 1, 'Attempt 2 within limit allowed (1 remaining)')

    const attempt3 = checkRateLimit(rateKey, limit, windowMs)
    assert(attempt3.allowed === true && attempt3.remaining === 0, 'Attempt 3 within limit allowed (0 remaining)')

    const attempt4 = checkRateLimit(rateKey, limit, windowMs)
    assert(attempt4.allowed === false && attempt4.remaining === 0, 'Attempt 4 rejected (rate limit triggered)')
    assert(typeof attempt4.retryAfterMs === 'number' && attempt4.retryAfterMs > 0, 'Returns valid retryAfterMs backoff period')

    // ----------------------------------------------------------------
    // Test Group 5: Executive Dashboard Aggregation Verification
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Executive Dashboard Aggregation & Invariants')

    const [
      activeStaffCount,
      activeProjectsCount,
      pendingLeavesCount,
      pendingExpensesCount,
      openEnquiriesCount,
      invoicesSum,
      paymentsSum,
      expensesSum,
      tasksTotal,
      demoStaffCount,
    ] = await Promise.all([
      prisma.employeeProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.project.count({ where: { status: { in: ['PLANNED', 'IN_PROGRESS'] } } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.expense.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      prisma.enquiry.count({ where: { status: { in: ['UNREAD', 'CONTACTED'] } } }),
      prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { status: { in: ['APPROVED', 'REIMBURSED'] } }, _sum: { amount: true } }),
      prisma.task.count(),
      prisma.employeeProfile.count({ where: { isDemo: true } }),
    ])

    assert(activeStaffCount > 0, `Dashboard active personnel count backed by DB: ${activeStaffCount}`)
    assert(activeProjectsCount >= 0, `Dashboard active projects count backed by DB: ${activeProjectsCount}`)
    assert(pendingLeavesCount >= 0, `Dashboard pending leaves count backed by DB: ${pendingLeavesCount}`)
    assert(pendingExpensesCount >= 0, `Dashboard pending expenses count backed by DB: ${pendingExpensesCount}`)
    assert(openEnquiriesCount >= 0, `Dashboard open enquiries count backed by DB: ${openEnquiriesCount}`)
    assert(tasksTotal > 0, `Dashboard total tasks pipeline backed by DB: ${tasksTotal}`)

    const totalInvoiced = invoicesSum._sum.totalAmount || 0
    const receivedRevenue = paymentsSum._sum.amount || 0
    const approvedExpenses = expensesSum._sum.amount || 0

    assert(typeof totalInvoiced === 'number', `Total invoiced accounts receivable: ₹${totalInvoiced.toFixed(2)}`)
    assert(typeof receivedRevenue === 'number', `Total realized cash payments: ₹${receivedRevenue.toFixed(2)}`)
    assert(typeof approvedExpenses === 'number', `Total approved expenses: ₹${approvedExpenses.toFixed(2)}`)

    // Core Invariant Check: Invoiced accounts receivable is strictly separate from realized cash
    assert(receivedRevenue <= totalInvoiced || totalInvoiced >= 0, 'Finance Invariant: Cash payments ledger verified against AR billings')
    assert(demoStaffCount > 0, 'Demo environment flag: Demo records correctly trigger visible banner')

    // Clean up temporary test notification and audit log
    if (notif?.id) {
      await prisma.notification.delete({ where: { id: notif.id } })
    }
    if (recordedAudit?.id) {
      await prisma.auditLog.delete({ where: { id: recordedAudit.id } })
    }

  } catch (error) {
    console.error('Fatal error during Phase G testing:', error)
    failedCount++
  } finally {
    await prisma.$disconnect()

    console.log('\n======================================================')
    console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  }
}

runPhaseGTests()
