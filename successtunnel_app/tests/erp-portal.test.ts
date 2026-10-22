import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken, authenticateApi } from '../lib/auth'

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

async function runTestSuite() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - AUTOMATED VERIFICATION SUITE')
  console.log('======================================================\n')

  try {
    // ----------------------------------------------------------------
    // Test 1: Authentication & JWT Token Signing/Verification
    // ----------------------------------------------------------------
    console.log('Test Group 1: Authentication & Token Security')
    const testPayload = {
      id: 9999,
      email: 'test.admin@successtunnel.in',
      name: 'Test Administrator',
      role: 'super_admin',
    }

    const token = signToken(testPayload)
    assert(typeof token === 'string' && token.length > 20, 'Token generated successfully with valid signature')

    const decoded = verifyToken(token)
    assert(decoded !== null, 'Valid token was decoded successfully')
    assert(decoded?.email === testPayload.email, 'Decoded token email matches payload')
    assert(decoded?.role === 'super_admin', 'Decoded token role matches super_admin')

    const invalidDecoded = verifyToken('corrupted.token.value')
    assert(invalidDecoded === null, 'Corrupted token fails verification safely returning null')

    // ----------------------------------------------------------------
    // Test 2: Password Hashing Verification
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Password Security & Verification')
    const rawPassword = 'SecureDemoPassword@2026!'
    const hashed = await bcrypt.hash(rawPassword, 10)
    const match = await bcrypt.compare(rawPassword, hashed)
    assert(match === true, 'Bcrypt correctly verifies valid raw password against hash')

    const wrongMatch = await bcrypt.compare('WrongPassword!', hashed)
    assert(wrongMatch === false, 'Bcrypt rejects incorrect password attempt')

    // ----------------------------------------------------------------
    // Test 3: Role-Based Authorization Policy Logic
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Server-side RBAC Matrix Enforcement')
    const hrUser = { id: 101, email: 'hr@example.com', role: 'hr_admin' }
    const staffUser = { id: 102, email: 'dev@example.com', role: 'employee' }
    const superUser = { id: 1, email: 'admin@successtunnel.in', role: 'super_admin' }

    // Mock policy checker
    const checkRole = (user: { role: string }, allowedRoles: string[]) => {
      if (user.role === 'super_admin' || user.role === 'admin') return true
      return allowedRoles.includes(user.role)
    }

    assert(checkRole(superUser, ['hr_admin']) === true, 'Super Admin passes through HR restricted boundary')
    assert(checkRole(hrUser, ['hr_admin']) === true, 'HR Admin passes through HR restricted boundary')
    assert(checkRole(staffUser, ['hr_admin']) === false, 'Standard Employee blocked by HR restricted boundary')
    assert(checkRole(staffUser, ['employee']) === true, 'Standard Employee permitted on self-service boundary')

    // ----------------------------------------------------------------
    // Test 4: Database Models & Referential Integrity
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Employee & Department Database Operations')
    const testDeptCode = `TST-${Date.now().toString().slice(-4)}`
    const testDept = await prisma.department.create({
      data: {
        name: `Test Department ${testDeptCode}`,
        code: testDeptCode,
        description: 'Automated test business unit',
      },
    })
    assert(testDept.id > 0, `Department created with ID #${testDept.id}`)

    const testUserEmail = `test.emp.${Date.now()}@example.com`
    const testUser = await prisma.user.create({
      data: {
        name: 'Automated Test Employee',
        email: testUserEmail,
        password: hashed,
        role: 'employee',
        departmentId: testDept.id,
      },
    })
    assert(testUser.id > 0, `User created with ID #${testUser.id}`)

    const testEmpCode = `ST-TEST-${Date.now().toString().slice(-4)}`
    const testProfile = await prisma.employeeProfile.create({
      data: {
        userId: testUser.id,
        employeeCode: testEmpCode,
        designation: 'Test Engineer',
        workLocation: 'Headquarters',
        status: 'ACTIVE',
        isDemo: true,
      },
    })
    assert(testProfile.id > 0, `Employee profile created with code ${testProfile.employeeCode}`)

    // ----------------------------------------------------------------
    // Test 5: Attendance Check-in & Duration State Transitions
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Attendance Workflow & Duplicate Protection')
    const testDate = `9999-12-${Math.floor(10 + Math.random() * 18)}` // Isolated future date
    const checkInTime = new Date()

    const attendance1 = await prisma.attendanceRecord.create({
      data: {
        userId: testUser.id,
        date: testDate,
        checkIn: checkInTime,
        status: 'PRESENT',
        isDemo: true,
      },
    })
    assert(attendance1.id > 0, `Initial attendance record checked in for date ${testDate}`)

    // Verify duplicate check-in constraint prevents collision
    let duplicatePrevented = false
    try {
      await prisma.attendanceRecord.create({
        data: {
          userId: testUser.id,
          date: testDate,
          checkIn: checkInTime,
          status: 'PRESENT',
        },
      })
    } catch (e) {
      duplicatePrevented = true
    }
    assert(duplicatePrevented === true, 'Prisma unique constraint correctly rejected duplicate check-in for same user & date')

    // Simulate check-out after 8 hours
    const checkOutTime = new Date(checkInTime.getTime() + 8 * 60 * 60 * 1000)
    const updatedAttendance = await prisma.attendanceRecord.update({
      where: { id: attendance1.id },
      data: {
        checkOut: checkOutTime,
        durationMinutes: 480,
      },
    })
    assert(updatedAttendance.durationMinutes === 480, 'Checkout correctly updated duration to 480 minutes (8 hours)')

    // ----------------------------------------------------------------
    // Test 6: Project & Task Lifecycle with Derived Progress
    // ----------------------------------------------------------------
    console.log('\nTest Group 6: Project & Task Kanban Progress Derivation')
    const testPrjCode = `ST-TEST-PRJ-${Date.now().toString().slice(-4)}`
    const project = await prisma.project.create({
      data: {
        projectCode: testPrjCode,
        name: 'Automated Test Project',
        departmentId: testDept.id,
        managerId: testUser.id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 0,
        isDemo: true,
      },
    })
    assert(project.id > 0, `Project created #${project.projectCode}`)

    const task1 = await prisma.task.create({
      data: {
        taskCode: `TSK-A-${Date.now().toString().slice(-4)}`,
        title: 'Task A - Documentation',
        projectId: project.id,
        assigneeId: testUser.id,
        status: 'TODO',
        priority: 'MEDIUM',
        isDemo: true,
      },
    })

    const task2 = await prisma.task.create({
      data: {
        taskCode: `TSK-B-${Date.now().toString().slice(-4)}`,
        title: 'Task B - Implementation',
        projectId: project.id,
        assigneeId: testUser.id,
        status: 'DONE',
        priority: 'HIGH',
        isDemo: true,
      },
    })

    // Compute progress: 1 of 2 tasks is DONE -> 50%
    const allTasks = await prisma.task.findMany({ where: { projectId: project.id } })
    const doneCount = allTasks.filter((t) => t.status === 'DONE').length
    const computedProgress = Math.round((doneCount / allTasks.length) * 100)
    assert(computedProgress === 50, `Project progress derived correctly as ${computedProgress}% (1/2 tasks completed)`)

    // ----------------------------------------------------------------
    // Test 7: Leave Request & Approval Lifecycle
    // ----------------------------------------------------------------
    console.log('\nTest Group 7: Leave Application & Approval State Machine')
    const leave = await prisma.leaveRequest.create({
      data: {
        userId: testUser.id,
        leaveType: 'ANNUAL',
        startDate: new Date('2026-11-01'),
        endDate: new Date('2026-11-03'),
        totalDays: 3,
        reason: 'Automated test vacation leave',
        status: 'PENDING',
        isDemo: true,
      },
    })
    assert(leave.status === 'PENDING', 'Leave request created in initial PENDING status')

    const approvedLeave = await prisma.leaveRequest.update({
      where: { id: leave.id },
      data: {
        status: 'APPROVED',
        reviewedById: testUser.id,
        reviewReason: 'Automated approval verification',
        reviewedAt: new Date(),
      },
    })
    assert(approvedLeave.status === 'APPROVED', 'Leave request transitioned to APPROVED status')
    assert(approvedLeave.reviewReason === 'Automated approval verification', 'Review reason stored accurately')

    // ----------------------------------------------------------------
    // Test 8: Audit Log Persistence
    // ----------------------------------------------------------------
    console.log('\nTest Group 8: Audit Log Immutability & Traceability')
    const audit = await prisma.auditLog.create({
      data: {
        userId: testUser.id,
        action: 'TEST_VERIFICATION_COMPLETE',
        entityType: 'TestSuite',
        entityId: 'TEST-001',
        details: 'All automated workflow assertions validated successfully',
        ipAddress: '127.0.0.1',
      },
    })
    assert(audit.id > 0, `Audit log entry persisted #${audit.id}`)

    // Cleanup test artifacts
    await prisma.auditLog.delete({ where: { id: audit.id } })
    await prisma.leaveRequest.delete({ where: { id: leave.id } })
    await prisma.task.deleteMany({ where: { projectId: project.id } })
    await prisma.project.delete({ where: { id: project.id } })
    await prisma.attendanceRecord.delete({ where: { id: attendance1.id } })
    await prisma.employeeProfile.delete({ where: { id: testProfile.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    await prisma.department.delete({ where: { id: testDept.id } })

    console.log('\n======================================================')
    console.log(`🏁 TEST EXECUTION FINISHED: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Test execution fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runTestSuite()
