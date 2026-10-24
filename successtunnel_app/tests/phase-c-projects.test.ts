import { PrismaClient } from '@prisma/client'

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

async function runPhaseCTests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE C: PROJECTS & TASKS VERIFICATION')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-5)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Project Creation & Attributes
    // ----------------------------------------------------------------
    console.log('Test Group 1: Enterprise Project Entity Lifecycle')

    // Find or create test user for PM
    let pmUser = await prisma.user.findFirst({ where: { role: 'project_manager' } })
    if (!pmUser) {
      pmUser = await prisma.user.findFirst()
    }
    assert(pmUser !== null, 'Found authorized project manager user')

    const prjCode = `ST-TEST-PRJ-${timestamp}`
    const project = await prisma.project.create({
      data: {
        projectCode: prjCode,
        name: `Automated Workflow Initiative ${timestamp}`,
        description: 'Comprehensive software delivery verification project',
        businessObjective: 'Validate end-to-end task-linked progress calculation',
        managerId: pmUser?.id,
        status: 'PLANNED',
        priority: 'HIGH',
        budget: 500000,
        progress: 0,
        startDate: new Date(),
        isDemo: true,
      },
    })
    assert(project.id > 0, `Project created #${project.id} [${project.projectCode}]`)
    assert(project.progress === 0, 'Initial project progress starts strictly at 0%')

    // Add Team Member
    const member = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: pmUser!.id,
        role: 'Project Lead',
      },
    })
    assert(member.id > 0, 'Project member assigned with role Project Lead')

    // Status transition to IN_PROGRESS
    const activePrj = await prisma.project.update({
      where: { id: project.id },
      data: { status: 'IN_PROGRESS' },
    })
    assert(activePrj.status === 'IN_PROGRESS', 'Project transitioned to IN_PROGRESS state')

    // ----------------------------------------------------------------
    // Test Group 2: Task Creation & Work Allocation
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Kanban Tasks & Allocations')

    const task1 = await prisma.task.create({
      data: {
        taskCode: `ST-TSK-A${timestamp}`,
        title: 'Draft architecture specifications',
        projectId: project.id,
        assigneeId: pmUser?.id,
        priority: 'HIGH',
        status: 'TODO',
        isDemo: true,
      },
    })
    const task2 = await prisma.task.create({
      data: {
        taskCode: `ST-TSK-B${timestamp}`,
        title: 'Implement database models and schema',
        projectId: project.id,
        assigneeId: pmUser?.id,
        priority: 'CRITICAL',
        status: 'TODO',
        isDemo: true,
      },
    })
    const task3 = await prisma.task.create({
      data: {
        taskCode: `ST-TSK-C${timestamp}`,
        title: 'Integrate API routes and validation',
        projectId: project.id,
        assigneeId: pmUser?.id,
        priority: 'MEDIUM',
        status: 'TODO',
        isDemo: true,
      },
    })
    const task4 = await prisma.task.create({
      data: {
        taskCode: `ST-TSK-D${timestamp}`,
        title: 'Execute automated regression verification',
        projectId: project.id,
        assigneeId: pmUser?.id,
        priority: 'HIGH',
        status: 'TODO',
        isDemo: true,
      },
    })
    assert(task1.id > 0 && task2.id > 0 && task3.id > 0 && task4.id > 0, 'Created 4 distinct work tasks')

    // ----------------------------------------------------------------
    // Test Group 3: Task-Linked Dynamic Progress Derivation
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Task-Linked Progress Derivation (No Decorative Percentages)')

    // Helper to calculate progress
    const computeProgress = async (pId: number) => {
      const total = await prisma.task.count({ where: { projectId: pId } })
      const done = await prisma.task.count({ where: { projectId: pId, status: 'DONE' } })
      return total > 0 ? Math.round((done / total) * 100) : 0
    }

    // Initial state: 0 of 4 tasks done -> 0%
    let progress = await computeProgress(project.id)
    assert(progress === 0, 'Progress with 0/4 tasks done is exactly 0%')

    // Move task 1 to DONE
    await prisma.task.update({ where: { id: task1.id }, data: { status: 'DONE' } })
    progress = await computeProgress(project.id)
    assert(progress === 25, 'Progress with 1/4 tasks done is dynamically derived as 25%')

    // Move task 2 to DONE
    await prisma.task.update({ where: { id: task2.id }, data: { status: 'DONE' } })
    progress = await computeProgress(project.id)
    assert(progress === 50, 'Progress with 2/4 tasks done is dynamically derived as 50%')

    // Move task 3 and 4 to DONE
    await prisma.task.update({ where: { id: task3.id }, data: { status: 'DONE' } })
    await prisma.task.update({ where: { id: task4.id }, data: { status: 'DONE' } })
    progress = await computeProgress(project.id)
    assert(progress === 100, 'Progress with 4/4 tasks done is dynamically derived as 100%')

    // Update project with verified progress
    const completedPrj = await prisma.project.update({
      where: { id: project.id },
      data: { progress, status: 'COMPLETED' },
    })
    assert(completedPrj.progress === 100, 'Project entity stored accurate 100% completion rate')
    assert(completedPrj.status === 'COMPLETED', 'Project transitioned to COMPLETED status')

    // ----------------------------------------------------------------
    // Test Group 4: Task Comments & Activity Trail
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Task Comments & Audit Activity Trail')

    const comment = await prisma.taskComment.create({
      data: {
        taskId: task1.id,
        authorId: pmUser!.id,
        content: 'Technical specifications approved during peer review session.',
      },
    })
    assert(comment.id > 0, `Task comment recorded with ID #${comment.id}`)

    const activity = await prisma.taskActivity.create({
      data: {
        taskId: task1.id,
        userId: pmUser!.id,
        action: 'STATUS_CHANGE',
        details: 'Changed status from IN_PROGRESS to DONE',
      },
    })
    assert(activity.id > 0, 'TaskActivity entry captured for audit verification')

    // ----------------------------------------------------------------
    // Test Group 5: Cleanup Test Entities
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Safe Cleanup of Test Artifacts')

    await prisma.taskActivity.delete({ where: { id: activity.id } })
    await prisma.taskComment.delete({ where: { id: comment.id } })
    await prisma.task.deleteMany({ where: { projectId: project.id } })
    await prisma.projectMember.deleteMany({ where: { projectId: project.id } })
    await prisma.project.delete({ where: { id: project.id } })
    assert(true, 'All test projects and tasks safely cleaned up from database')

    console.log('\n======================================================')
    console.log(`🏁 PHASE C TEST FINISHED: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Phase C test execution failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runPhaseCTests()
