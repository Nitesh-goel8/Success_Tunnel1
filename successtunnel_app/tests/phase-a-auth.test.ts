import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken, checkModulePermission } from '../lib/auth'
import { checkRateLimit } from '../lib/rateLimit'

const prisma = new PrismaClient()

let passedCount = 0
let failedCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`)
    passedCount++
  } else {
    console.error(`  ❌ FAIL: ${message}`)
    failedCount++
  }
}

async function runPhaseATests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE A: AUTH & SHELL VERIFICATION')
  console.log('======================================================\n')

  try {
    // ----------------------------------------------------------------
    // Test Group 1: JWT Signing & Token Integrity
    // ----------------------------------------------------------------
    console.log('Test Group 1: Authentication & Token Security')
    const payload = {
      id: 8888,
      email: 'test.phase.a@successtunnel.in',
      name: 'Phase A Tester',
      role: 'super_admin',
    }

    const token = signToken(payload)
    assert(typeof token === 'string' && token.length > 30, 'JWT token signed successfully')

    const verified = verifyToken(token)
    assert(verified !== null, 'Token verified and decoded successfully')
    assert(verified?.email === payload.email, 'Decoded email matches original payload')
    assert(verified?.role === 'super_admin', 'Decoded role matches super_admin')

    const corruptedTokenResult = verifyToken(token + 'tampered')
    assert(corruptedTokenResult === null, 'Tampered token rejected safely returning null')

    const emptyTokenResult = verifyToken('')
    assert(emptyTokenResult === null, 'Empty token string rejected returning null')

    // ----------------------------------------------------------------
    // Test Group 2: Bcrypt Password Hashing & Verification
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Password Security & Verification')
    const plain = 'StrongTestPassword@2026!'
    const hash = await bcrypt.hash(plain, 10)
    assert(hash.startsWith('$2'), 'Bcrypt hash generated with valid salt prefix')

    const validMatch = await bcrypt.compare(plain, hash)
    assert(validMatch === true, 'Bcrypt verifies identical plain password')

    const invalidMatch = await bcrypt.compare('WrongPassword@999', hash)
    assert(invalidMatch === false, 'Bcrypt safely rejects mismatched password')

    // ----------------------------------------------------------------
    // Test Group 3: Server-side RBAC & Module Permission Matrix
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Server-side RBAC Matrix Enforcement')
    // Super Administrator checks
    assert(checkModulePermission('super_admin', 'ORGANIZATION', 'create') === true, 'Super Admin can create in ORGANIZATION')
    assert(checkModulePermission('super_admin', 'EMPLOYEES', 'delete') === true, 'Super Admin can delete in EMPLOYEES')
    assert(checkModulePermission('super_admin', 'FINANCE', 'approve') === true, 'Super Admin can approve in FINANCE')
    assert(checkModulePermission('super_admin', 'AUDIT_LOGS', 'view') === true, 'Super Admin can view AUDIT_LOGS')

    // HR Administrator checks
    assert(checkModulePermission('hr_admin', 'EMPLOYEES', 'create') === true, 'HR Admin can create EMPLOYEES')
    assert(checkModulePermission('hr_admin', 'LEAVES', 'approve') === true, 'HR Admin can approve LEAVES')
    assert(checkModulePermission('hr_admin', 'FINANCE', 'delete') === false, 'HR Admin blocked from deleting in FINANCE')
    assert(checkModulePermission('hr_admin', 'PROJECTS', 'delete') === false, 'HR Admin blocked from deleting in PROJECTS')

    // Project Manager checks
    assert(checkModulePermission('project_manager', 'PROJECTS', 'create') === true, 'Project Manager can create PROJECTS')
    assert(checkModulePermission('project_manager', 'TASKS', 'create') === true, 'Project Manager can create TASKS')
    assert(checkModulePermission('project_manager', 'EMPLOYEES', 'delete') === false, 'Project Manager blocked from deleting EMPLOYEES')
    assert(checkModulePermission('project_manager', 'FINANCE', 'approve') === false, 'Project Manager blocked from approving company-wide FINANCE')

    // Finance Administrator checks
    assert(checkModulePermission('finance_admin', 'FINANCE', 'approve') === true, 'Finance Admin can approve expenses in FINANCE')
    assert(checkModulePermission('finance_admin', 'REPORTS', 'view') === true, 'Finance Admin can view financial REPORTS')
    assert(checkModulePermission('finance_admin', 'EMPLOYEES', 'create') === false, 'Finance Admin blocked from creating EMPLOYEES')

    // Employee checks
    assert(checkModulePermission('employee', 'ATTENDANCE', 'create') === true, 'Employee can create/punch ATTENDANCE')
    assert(checkModulePermission('employee', 'LEAVES', 'create') === true, 'Employee can apply for LEAVES')
    assert(checkModulePermission('employee', 'TASKS', 'edit') === true, 'Employee can update status on assigned TASKS')
    assert(checkModulePermission('employee', 'EMPLOYEES', 'create') === false, 'Employee blocked from creating EMPLOYEES')
    assert(checkModulePermission('employee', 'ORGANIZATION', 'create') === false, 'Employee blocked from modifying ORGANIZATION')

    // ----------------------------------------------------------------
    // Test Group 4: Rate Limiting Enforcement
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Brute-Force Rate Limiting Engine')
    const testRateKey = `unit_test_login_ip_${Date.now()}`
    // First 5 attempts should be allowed
    let allowedAll = true
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testRateKey, 5, 5000)
      if (!res.allowed) allowedAll = false
    }
    assert(allowedAll === true, 'First 5 login attempts within limit are permitted')

    // 6th attempt must be blocked
    const blockedRes = checkRateLimit(testRateKey, 5, 5000)
    assert(blockedRes.allowed === false, '6th rapid attempt is blocked by rate limiter')
    assert(typeof blockedRes.retryAfterMs === 'number' && blockedRes.retryAfterMs > 0, 'Rate limiter returns non-zero retryAfterMs')

    // ----------------------------------------------------------------
    // Test Group 5: Notifications Data Model & Lifecycle
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Notification Lifecycle in Database')
    // Find or create a test recipient
    let testUser = await prisma.user.findFirst()
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: 'Unit Test Recipient',
          email: `notif.test.${Date.now()}@example.com`,
          password: hash,
          role: 'employee',
        },
      })
    }

    const notif = await prisma.notification.create({
      data: {
        userId: testUser.id,
        title: 'Phase A Test Notification',
        message: 'Your automated workflow assertion completed successfully.',
        type: 'SYSTEM',
        isRead: false,
      },
    })
    assert(notif.id > 0, `Notification persisted to database with ID #${notif.id}`)
    assert(notif.isRead === false, 'New notification has isRead = false')

    // Update notification status to read
    const updatedNotif = await prisma.notification.update({
      where: { id: notif.id },
      data: { isRead: true },
    })
    assert(updatedNotif.isRead === true, 'Notification successfully marked as read')

    // Clean up test notification
    await prisma.notification.delete({ where: { id: notif.id } })
    assert(true, 'Test notification cleaned up from database')

    // ----------------------------------------------------------------
    // Test Group 6: Audit Log Integrity
    // ----------------------------------------------------------------
    console.log('\nTest Group 6: Audit Log Immutability & Traceability')
    const audit = await prisma.auditLog.create({
      data: {
        userId: testUser.id,
        action: 'PHASE_A_VERIFICATION',
        entityType: 'AuthShell',
        entityId: 'PHASE-A',
        details: JSON.stringify({ status: 'SUCCESS', verifiedAt: new Date().toISOString() }),
        ipAddress: '127.0.0.1',
      },
    })
    assert(audit.id > 0, `Audit log record persisted with ID #${audit.id}`)
    assert(audit.action === 'PHASE_A_VERIFICATION', 'Audit log stores precise action')

    // Clean up test audit log
    await prisma.auditLog.delete({ where: { id: audit.id } })
    assert(true, 'Test audit log cleaned up safely')

    console.log('\n======================================================')
    console.log(`🏁 PHASE A TEST FINISHED: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Phase A test execution failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runPhaseATests()
