import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

async function runPhaseBTests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE B: WORKFORCE & ORG VERIFICATION')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-5)
  const testDeptCode = `DEPT-${timestamp}`

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Department Operations & Constraints
    // ----------------------------------------------------------------
    console.log('Test Group 1: Department Creation, Uniqueness & Hierarchy')

    const dept = await prisma.department.create({
      data: {
        name: `Automated Test Division ${timestamp}`,
        code: testDeptCode,
        description: 'Quality assurance and automated testing division',
      },
    })
    assert(dept.id > 0, `Department created with ID #${dept.id} [${dept.code}]`)

    // Duplicate code check
    let duplicateCaught = false
    try {
      await prisma.department.create({
        data: {
          name: `Another Division ${timestamp}`,
          code: testDeptCode,
        },
      })
    } catch {
      duplicateCaught = true
    }
    assert(duplicateCaught === true, 'Prisma unique constraint prevented duplicate department code')

    // Update department
    const updatedDept = await prisma.department.update({
      where: { id: dept.id },
      data: { description: 'Updated division description' },
    })
    assert(updatedDept.description === 'Updated division description', 'Department updated successfully')

    // ----------------------------------------------------------------
    // Test Group 2: Employee Hierarchy & Manager Assignment
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Employee Profiles, Roles & Hierarchy')

    const hashedPassword = await bcrypt.hash('Demo@2026!', 10)

    // 1. Create Senior Manager
    const mgrUser = await prisma.user.create({
      data: {
        name: `Manager User ${timestamp}`,
        email: `mgr.${timestamp}@example.com`,
        password: hashedPassword,
        role: 'project_manager',
        departmentId: dept.id,
        status: 'active',
      },
    })
    const mgrProfile = await prisma.employeeProfile.create({
      data: {
        userId: mgrUser.id,
        employeeCode: `ST-MGR-${timestamp}`,
        designation: 'Engineering Director',
        employmentType: 'Full-time',
        status: 'ACTIVE',
        isDemo: true,
      },
    })
    assert(mgrProfile.id > 0, `Manager profile created [${mgrProfile.employeeCode}]`)

    // Assign Manager as department head
    const deptWithHead = await prisma.department.update({
      where: { id: dept.id },
      data: { headId: mgrUser.id },
      include: { head: true },
    })
    assert(deptWithHead.head?.id === mgrUser.id, 'Department head successfully designated')

    // 2. Create Staff Employee reporting to Senior Manager
    const staffUser = await prisma.user.create({
      data: {
        name: `Staff Member ${timestamp}`,
        email: `staff.${timestamp}@example.com`,
        password: hashedPassword,
        role: 'employee',
        departmentId: dept.id,
        phone: '+91 98111 00000',
        status: 'active',
      },
    })
    const staffProfile = await prisma.employeeProfile.create({
      data: {
        userId: staffUser.id,
        employeeCode: `ST-EMP-${timestamp}`,
        designation: 'Senior QA Analyst',
        workLocation: 'Noida Development Centre',
        employmentType: 'Full-time',
        emergencyContact: 'Emergency Contact: +91 98222 33344',
        managerId: mgrProfile.id,
        status: 'PROBATION',
        isDemo: true,
      },
    })
    assert(staffProfile.id > 0, `Staff profile created [${staffProfile.employeeCode}]`)
    assert(staffProfile.managerId === mgrProfile.id, 'Staff profile successfully linked to reporting manager')

    // Verify Direct Reports relation
    const mgrWithReports = await prisma.employeeProfile.findUnique({
      where: { id: mgrProfile.id },
      include: { directReports: true },
    })
    assert(
      mgrWithReports?.directReports.some((r) => r.id === staffProfile.id) === true,
      'Manager directReports collection includes assigned staff member'
    )

    // ----------------------------------------------------------------
    // Test Group 3: Status Transitions & Soft Deactivation
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Status State Machine & Deactivation')

    // Transition from PROBATION to ACTIVE
    const confirmedStaff = await prisma.employeeProfile.update({
      where: { id: staffProfile.id },
      data: { status: 'ACTIVE' },
    })
    assert(confirmedStaff.status === 'ACTIVE', 'Employee status transitioned from PROBATION to ACTIVE')

    // Transition to NOTICE period
    const noticeStaff = await prisma.employeeProfile.update({
      where: { id: staffProfile.id },
      data: { status: 'NOTICE' },
    })
    assert(noticeStaff.status === 'NOTICE', 'Employee status transitioned to NOTICE period')

    // Soft-deactivation (INACTIVE)
    const deactivatedUser = await prisma.user.update({
      where: { id: staffUser.id },
      data: { status: 'inactive' },
    })
    const deactivatedProfile = await prisma.employeeProfile.update({
      where: { id: staffProfile.id },
      data: { status: 'INACTIVE' },
    })
    assert(deactivatedUser.status === 'inactive', 'User account marked inactive')
    assert(deactivatedProfile.status === 'INACTIVE', 'Profile status marked INACTIVE')

    // ----------------------------------------------------------------
    // Test Group 4: Search & Filtering Queries
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Directory Search & Filtering Query Correctness')

    // Query by department
    const deptMembers = await prisma.user.findMany({
      where: { departmentId: dept.id },
    })
    assert(deptMembers.length === 2, `Directory correctly returned 2 members in test department #${dept.id}`)

    // Query by employee code
    const foundByCode = await prisma.employeeProfile.findUnique({
      where: { employeeCode: mgrProfile.employeeCode },
      include: { user: true },
    })
    assert(foundByCode?.user.id === mgrUser.id, 'Search by employee code resolved accurate user profile')

    // ----------------------------------------------------------------
    // Test Group 5: Cleanup of Test Entities
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Cleanup Test Artifacts')

    // Remove staff
    await prisma.employeeProfile.delete({ where: { id: staffProfile.id } })
    await prisma.user.delete({ where: { id: staffUser.id } })

    // Unassign head and remove manager
    await prisma.department.update({
      where: { id: dept.id },
      data: { headId: null },
    })
    await prisma.employeeProfile.delete({ where: { id: mgrProfile.id } })
    await prisma.user.delete({ where: { id: mgrUser.id } })

    // Remove department
    await prisma.department.delete({ where: { id: dept.id } })
    assert(true, 'All Phase B test records cleaned up safely from database')

    console.log('\n======================================================')
    console.log(`🏁 PHASE B TEST FINISHED: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Phase B test execution failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runPhaseBTests()
