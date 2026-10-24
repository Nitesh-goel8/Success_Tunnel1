import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDemo() {
  console.log('======================================================================')
  console.log('🧹 SUCCESS TUNNEL ERP — SAFE DEMO DATA RESET')
  console.log('======================================================================\n')

  // Production guard
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_DEMO_RESET !== 'true') {
    console.error('❌ ERROR: Refusing to reset demo data in production environment (NODE_ENV=production).')
    console.error('To override for staging/verification, set ALLOW_PROD_DEMO_RESET=true.\n')
    process.exit(1)
  }

  console.log('Purging demo records in foreign key dependency order...')

  // 1. Task Comments & Activities on demo tasks
  const demoTasks = await prisma.task.findMany({ where: { isDemo: true }, select: { id: true } })
  const demoTaskIds = demoTasks.map((t) => t.id)
  if (demoTaskIds.length > 0) {
    const deletedComments = await prisma.taskComment.deleteMany({ where: { taskId: { in: demoTaskIds } } })
    const deletedActivities = await prisma.taskActivity.deleteMany({ where: { taskId: { in: demoTaskIds } } })
    console.log(`  - Deleted ${deletedComments.count} demo task comments and ${deletedActivities.count} activities`)
  }

  // 2. Demo Tasks
  const deletedTasks = await prisma.task.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedTasks.count} demo tasks`)

  // 3. Demo Lead Activities & Leads
  const demoLeads = await prisma.lead.findMany({ where: { isDemo: true }, select: { id: true } })
  const demoLeadIds = demoLeads.map((l) => l.id)
  if (demoLeadIds.length > 0) {
    const deletedLeadActs = await prisma.leadActivity.deleteMany({ where: { leadId: { in: demoLeadIds } } })
    console.log(`  - Deleted ${deletedLeadActs.count} demo lead activities`)
  }
  const deletedLeads = await prisma.lead.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedLeads.count} demo CRM leads`)

  // 4. Demo Payments & Invoices
  const deletedPayments = await prisma.payment.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedPayments.count} demo financial payments`)

  const deletedInvoices = await prisma.invoice.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedInvoices.count} demo invoices`)

  // 5. Demo Expenses
  const deletedExpenses = await prisma.expense.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedExpenses.count} demo expense entries`)

  // 6. Demo Attendance & Leaves
  const deletedAttendance = await prisma.attendanceRecord.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedAttendance.count} demo attendance punch records`)

  const deletedLeaves = await prisma.leaveRequest.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedLeaves.count} demo leave applications`)

  // 7. Demo Documents
  const deletedDocs = await prisma.documentRecord.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedDocs.count} demo document records`)

  // 8. Demo Projects & Members
  const demoProjects = await prisma.project.findMany({ where: { isDemo: true }, select: { id: true } })
  const demoProjectIds = demoProjects.map((p) => p.id)
  if (demoProjectIds.length > 0) {
    const deletedMembers = await prisma.projectMember.deleteMany({ where: { projectId: { in: demoProjectIds } } })
    console.log(`  - Deleted ${deletedMembers.count} demo project memberships`)
  }
  const deletedProjects = await prisma.project.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedProjects.count} demo projects`)

  // 9. Demo Customers
  const deletedCustomers = await prisma.customer.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedCustomers.count} demo customer accounts`)

  // 10. Demo Employee Profiles & Example Users (Never delete primary admin@successtunnel.in)
  // First clear managerId self-references to avoid foreign key violations
  await prisma.employeeProfile.updateMany({
    where: { isDemo: true },
    data: { managerId: null },
  })
  const deletedProfiles = await prisma.employeeProfile.deleteMany({ where: { isDemo: true } })
  console.log(`  - Deleted ${deletedProfiles.count} demo employee profiles`)

  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: { endsWith: '@example.com' },
      NOT: { email: 'admin@successtunnel.in' },
    },
  })
  console.log(`  - Deleted ${deletedUsers.count} fictional demo users (@example.com)`)

  console.log('\n✅ DEMO RESET COMPLETE: All demo data cleanly purged without affecting production entities.\n')
}

resetDemo()
  .catch((e) => {
    console.error('Reset error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
