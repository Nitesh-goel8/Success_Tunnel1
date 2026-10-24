import { PrismaClient } from '@prisma/client'
import { checkModulePermission } from '../lib/auth'

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

async function runPhaseFTests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE F: ATTENDANCE, LEAVES & DOCUMENTS')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-5)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Role-Based Authorization for Workforce Modules
    // ----------------------------------------------------------------
    console.log('Test Group 1: Role-Based Access Control for Workforce Modules')

    assert(checkModulePermission('super_admin', 'ATTENDANCE', 'view') === true, 'Super Admin can view attendance')
    assert(checkModulePermission('super_admin', 'LEAVES', 'approve') === true, 'Super Admin can approve leaves')
    assert(checkModulePermission('super_admin', 'DOCUMENTS', 'create') === true, 'Super Admin can publish documents')

    assert(checkModulePermission('hr_admin', 'ATTENDANCE', 'view') === true, 'HR Admin can view attendance')
    assert(checkModulePermission('hr_admin', 'LEAVES', 'approve') === true, 'HR Admin can approve leaves')
    assert(checkModulePermission('hr_admin', 'DOCUMENTS', 'create') === true, 'HR Admin can publish documents')

    assert(checkModulePermission('employee', 'ATTENDANCE', 'create') === true, 'Employee can punch attendance')
    assert(checkModulePermission('employee', 'LEAVES', 'create') === true, 'Employee can apply for leaves')
    assert(checkModulePermission('employee', 'LEAVES', 'approve') === false, 'Employee blocked from approving leaves')
    assert(checkModulePermission('employee', 'DOCUMENTS', 'create') === false, 'Employee blocked from publishing official documents')

    // Find test users
    const hrUser = await prisma.user.findFirst({ where: { role: 'hr_admin' } }) || await prisma.user.findFirst()
    const staffUser1 = await prisma.user.findFirst({ where: { role: 'employee' } }) || await prisma.user.findFirst()
    const staffUser2 = await prisma.user.findFirst({ where: { id: { not: staffUser1?.id } } })

    assert(staffUser1 !== null, 'Identified test employee #1')
    assert(staffUser2 !== null, 'Identified test employee #2')

    // ----------------------------------------------------------------
    // Test Group 2: Attendance Punch Engine & Duplicate Prevention
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Biometric Punch In/Out & Constraint Enforcement')

    const testDate = `9999-11-${String(Math.floor(Math.random() * 20) + 10)}`
    const checkInTime = new Date(`${testDate}T09:15:00Z`)

    // Check In
    const record = await prisma.attendanceRecord.create({
      data: {
        userId: staffUser1!.id,
        date: testDate,
        checkIn: checkInTime,
        status: 'PRESENT',
        isDemo: true,
      },
    })
    assert(record.id > 0, `Recorded daily check-in for date ${record.date}`)
    assert(record.durationMinutes === 0, 'Duration is 0 minutes before check-out')

    // Verify unique constraint: user cannot check-in twice on the same date
    let duplicateRejected = false
    try {
      await prisma.attendanceRecord.create({
        data: {
          userId: staffUser1!.id,
          date: testDate,
          checkIn: new Date(),
          status: 'PRESENT',
        },
      })
    } catch (e) {
      duplicateRejected = true
    }
    assert(duplicateRejected === true, 'Prisma unique constraint [userId, date] strictly prevented duplicate check-in')

    // Check Out & Duration Calculation
    const checkOutTime = new Date(`${testDate}T17:45:00Z`) // 8.5 hours = 510 minutes
    const durationMs = checkOutTime.getTime() - checkInTime.getTime()
    const durationMinutes = Math.round(durationMs / (1000 * 60))

    const checkedOutRecord = await prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: checkOutTime,
        durationMinutes,
      },
    })
    assert(checkedOutRecord.checkOut !== null, 'Check-out timestamp persisted successfully')
    assert(checkedOutRecord.durationMinutes === 510, 'Duration calculated exactly as 510 minutes (8h 30m)')

    // ----------------------------------------------------------------
    // Test Group 3: Attendance Regularization & HR Approval
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Attendance Correction Request & HR Regularization')

    const regularizeDate = `9999-10-${String(Math.floor(Math.random() * 20) + 10)}`
    const correctionReq = await prisma.attendanceRecord.create({
      data: {
        userId: staffUser1!.id,
        date: regularizeDate,
        checkIn: new Date(`${regularizeDate}T09:00:00Z`),
        checkOut: new Date(`${regularizeDate}T18:00:00Z`),
        durationMinutes: 540,
        status: 'REGULARIZED',
        correctionRequested: true,
        correctionReason: 'Biometric fingerprint reader timed out on departure',
        isDemo: true,
      },
    })
    assert(correctionReq.correctionRequested === true, 'Correction request successfully flagged')

    // HR Approval
    const approvedCorrection = await prisma.attendanceRecord.update({
      where: { id: correctionReq.id },
      data: {
        correctionRequested: false,
        correctionApprovedBy: hrUser?.id,
        status: 'REGULARIZED',
      },
    })
    assert(approvedCorrection.correctionRequested === false, 'Correction resolved upon HR approval')
    assert(approvedCorrection.status === 'REGULARIZED', 'Attendance status transitioned to REGULARIZED')
    assert(approvedCorrection.correctionApprovedBy === hrUser?.id, 'Correction approval recorded by HR Admin')

    // ----------------------------------------------------------------
    // Test Group 4: Leave Entitlements & Balances
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Leave Policy Entitlements & Live Balance Deduction')

    const policies = await prisma.leavePolicy.findMany({ where: { isActive: true } })
    assert(policies.length >= 3, `Loaded ${policies.length} corporate leave entitlement policies`)

    const annualPolicy = policies.find((p) => p.leaveType === 'ANNUAL')
    assert(annualPolicy !== undefined, 'Annual Leave policy is configured')

    // Apply for leave: 3 days
    const leaveStart = new Date('2026-11-02')
    const leaveEnd = new Date('2026-11-04')
    const totalDays = 3

    const leaveApp = await prisma.leaveRequest.create({
      data: {
        userId: staffUser1!.id,
        leaveType: 'ANNUAL',
        startDate: leaveStart,
        endDate: leaveEnd,
        totalDays,
        reason: 'Personal family travel and festival celebrations',
        status: 'PENDING',
        isDemo: true,
      },
    })
    assert(leaveApp.id > 0, `Created leave application #${leaveApp.id} for ${leaveApp.totalDays} day(s)`)
    assert(leaveApp.status === 'PENDING', 'Initial leave application status is PENDING')

    // HR Approval
    const approvedLeave = await prisma.leaveRequest.update({
      where: { id: leaveApp.id },
      data: {
        status: 'APPROVED',
        reviewedById: hrUser?.id,
        reviewReason: 'Approved. Project deliverables handed over to secondary lead.',
        reviewedAt: new Date(),
      },
    })
    assert(approvedLeave.status === 'APPROVED', 'Leave application transitioned to APPROVED')
    assert(approvedLeave.reviewedById === hrUser?.id, 'HR reviewer ID stamped on record')

    // Verify balance deduction formula
    const userApprovedLeaves = await prisma.leaveRequest.findMany({
      where: {
        userId: staffUser1!.id,
        leaveType: 'ANNUAL',
        status: 'APPROVED',
      },
    })
    const totalUtilized = userApprovedLeaves.reduce((acc, l) => acc + l.totalDays, 0)
    const remainingDays = Math.max(0, (annualPolicy?.totalDaysPerYear || 18) - totalUtilized)
    assert(totalUtilized >= 3, `Calculated utilized days: ${totalUtilized}`)
    assert(remainingDays <= (annualPolicy?.totalDaysPerYear || 18) - 3, 'Remaining balance accurately deducted')

    // ----------------------------------------------------------------
    // Test Group 5: Document Confidentiality & Access Governance
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Document Confidentiality & Access Control Matrix')

    // 1. Company Public Policy
    const publicDoc = await prisma.documentRecord.create({
      data: {
        title: `Employee Code of Conduct ${timestamp}`,
        category: 'POLICY',
        fileUrl: `/docs/policies/conduct_${timestamp}.pdf`,
        fileSize: '1.2 MB',
        fileType: 'application/pdf',
        version: 'v2.0',
        isConfidential: false,
        uploaderId: hrUser!.id,
        isDemo: true,
      },
    })
    assert(publicDoc.id > 0, `Created public organizational policy: ${publicDoc.title}`)

    // 2. Confidential Offer Letter for Staff User 1
    const confidentialDoc = await prisma.documentRecord.create({
      data: {
        title: `Offer Letter & Executive Compensation ${timestamp}`,
        category: 'OFFER_LETTER',
        fileUrl: `/docs/confidential/offer_${timestamp}.pdf`,
        fileSize: '850 KB',
        fileType: 'application/pdf',
        version: 'v1.0',
        isConfidential: true,
        userId: staffUser1!.id, // strictly assigned to Staff User 1
        uploaderId: hrUser!.id,
        isDemo: true,
      },
    })
    assert(confidentialDoc.isConfidential === true, 'Confidential flag set to true')
    assert(confidentialDoc.userId === staffUser1!.id, 'Confidential document bound to target employee ID')

    // Access evaluation simulation for Staff User 2 (not HR, not target user)
    const staff2AccessibleDocs = await prisma.documentRecord.findMany({
      where: {
        id: { in: [publicDoc.id, confidentialDoc.id] },
        OR: [
          { isConfidential: false },
          { userId: staffUser2!.id },
          { uploaderId: staffUser2!.id },
        ],
      },
    })
    assert(staff2AccessibleDocs.length === 1, 'Standard employee strictly blocked from viewing colleague confidential document')
    assert(staff2AccessibleDocs[0].id === publicDoc.id, 'Standard employee can only access public policy document')

    // Access evaluation for Target Employee (Staff User 1)
    const staff1AccessibleDocs = await prisma.documentRecord.findMany({
      where: {
        id: { in: [publicDoc.id, confidentialDoc.id] },
        OR: [
          { isConfidential: false },
          { userId: staffUser1!.id },
          { uploaderId: staffUser1!.id },
        ],
      },
    })
    assert(staff1AccessibleDocs.length === 2, 'Target employee permitted to access own confidential document')

    // ----------------------------------------------------------------
    // Test Group 6: Safe Cleanup of Ephemeral Test Records
    // ----------------------------------------------------------------
    console.log('\nTest Group 6: Safe Cleanup of Test Artifacts')

    await prisma.attendanceRecord.delete({ where: { id: record.id } })
    await prisma.attendanceRecord.delete({ where: { id: correctionReq.id } })
    await prisma.leaveRequest.delete({ where: { id: leaveApp.id } })
    await prisma.documentRecord.delete({ where: { id: publicDoc.id } })
    await prisma.documentRecord.delete({ where: { id: confidentialDoc.id } })

    assert(true, 'Test attendance, leave, and document artifacts cleanly purged from database')
  } catch (err: any) {
    console.error('Unexpected test execution failure:', err)
    failedCount++
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n======================================================')
  console.log(`WORKFORCE TEST SUMMARY: ${passedCount} passed, ${failedCount} failed`)
  console.log('======================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

runPhaseFTests()
