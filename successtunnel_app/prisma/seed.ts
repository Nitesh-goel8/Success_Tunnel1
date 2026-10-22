import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { samplePosts, sampleProperties, sampleServices } from '../lib/sampleData'
import { EDUCATION_FALLBACK_CONTENT } from '../lib/educationContent'

const prisma = new PrismaClient()

const consultancySubservices = [
  { title: 'Income Tax', slug: 'income-tax', content: 'Income tax filing, planning and compliance support.' },
  { title: 'GST', slug: 'gst', content: 'GST registration, return filing and compliance workflow.' },
  { title: 'MSME Registration', slug: 'msme-registration', content: 'Guided MSME registration support for eligible businesses.' },
  { title: 'Trademark', slug: 'trademark', content: 'Trademark filing and brand protection guidance.' },
]

async function main() {
  console.log('Seeding Success Tunnel ERP database...')

  const defaultPassword = await bcrypt.hash('Demo@2026!', 10)
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Demo@2026!', 10)

  // 1. Seed Core Departments
  console.log('Seeding departments...')
  const departmentsData = [
    { code: 'ENG', name: 'Engineering & Technology', description: 'Software architecture, cloud infrastructure, and product engineering.' },
    { code: 'HR', name: 'Human Resources', description: 'Talent acquisition, employee welfare, performance, and organizational culture.' },
    { code: 'FIN', name: 'Finance & Accounts', description: 'Financial reporting, tax planning, payroll compliance, and treasury operations.' },
    { code: 'OPS', name: 'Operations & Facilities', description: 'Operational workflows, logistics, client workspace administration, and facility management.' },
    { code: 'CNS', name: 'Client Advisory & Consulting', description: 'Strategic business advisory, taxation consulting, and enterprise client relations.' },
  ]

  const departments: { [code: string]: any } = {}
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, description: dept.description },
      create: dept,
    })
    departments[dept.code] = record
  }

  // 2. Seed Users & Employee Profiles across all 5 RBAC roles
  console.log('Seeding users and employee profiles...')
  const demoUsers = [
    {
      name: 'Super Administrator',
      email: 'admin@successtunnel.in',
      password: adminPassword,
      role: 'super_admin',
      departmentCode: 'ENG',
      phone: '+91 98765 43210',
      employeeCode: 'ST-DIR-001',
      designation: 'Managing Director & Principal Architect',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: defaultPassword,
      role: 'hr_admin',
      departmentCode: 'HR',
      phone: '+91 98111 22334',
      employeeCode: 'ST-HR-101',
      designation: 'Senior HR Director',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Rohit Verma',
      email: 'rohit.verma@example.com',
      password: defaultPassword,
      role: 'project_manager',
      departmentCode: 'ENG',
      phone: '+91 98222 33445',
      employeeCode: 'ST-PM-201',
      designation: 'Principal Project Manager',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      password: defaultPassword,
      role: 'finance_admin',
      departmentCode: 'FIN',
      phone: '+91 98333 44556',
      employeeCode: 'ST-FIN-301',
      designation: 'Finance Controller & Tax Advisor',
      workLocation: 'Corporate Tower - Gurugram',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'ENG',
      phone: '+91 98444 55667',
      employeeCode: 'ST-DEV-401',
      designation: 'Senior Full Stack Engineer',
      workLocation: 'Remote - Bengaluru',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'OPS',
      phone: '+91 98555 66778',
      employeeCode: 'ST-OPS-501',
      designation: 'Operations Specialist',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'CNS',
      phone: '+91 98666 77889',
      employeeCode: 'ST-CNS-601',
      designation: 'Corporate Tax & GST Associate',
      workLocation: 'Branch Office - Mumbai',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
  ]

  const seededUsers: { [email: string]: any } = {}

  for (const u of demoUsers) {
    const dept = departments[u.departmentCode]
    const userRecord = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        password: u.password,
        role: u.role,
        departmentId: dept ? dept.id : null,
        phone: u.phone,
        status: 'active',
      },
      create: {
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        departmentId: dept ? dept.id : null,
        phone: u.phone,
        status: 'active',
      },
    })
    seededUsers[u.email] = userRecord

    await prisma.employeeProfile.upsert({
      where: { userId: userRecord.id },
      update: {
        employeeCode: u.employeeCode,
        designation: u.designation,
        workLocation: u.workLocation,
        employmentType: u.employmentType,
        status: u.status,
        isDemo: true,
      },
      create: {
        userId: userRecord.id,
        employeeCode: u.employeeCode,
        designation: u.designation,
        workLocation: u.workLocation,
        employmentType: u.employmentType,
        status: u.status,
        isDemo: true,
      },
    })
  }

  // Assign department heads
  if (departments['HR'] && seededUsers['priya.sharma@example.com']) {
    await prisma.department.update({
      where: { id: departments['HR'].id },
      data: { headId: seededUsers['priya.sharma@example.com'].id },
    })
  }
  if (departments['FIN'] && seededUsers['sneha.patel@example.com']) {
    await prisma.department.update({
      where: { id: departments['FIN'].id },
      data: { headId: seededUsers['sneha.patel@example.com'].id },
    })
  }
  if (departments['ENG'] && seededUsers['rohit.verma@example.com']) {
    await prisma.department.update({
      where: { id: departments['ENG'].id },
      data: { headId: seededUsers['rohit.verma@example.com'].id },
    })
  }

  // 3. Seed Leave Policies
  console.log('Seeding leave policies...')
  const leavePolicies = [
    { leaveType: 'ANNUAL', title: 'Annual Paid Leave', totalDaysPerYear: 18, carryForwardMax: 5, description: 'Standard paid annual leave for rest and vacation.' },
    { leaveType: 'SICK', title: 'Medical / Sick Leave', totalDaysPerYear: 10, carryForwardMax: 0, description: 'Leaves granted for medical recovery and health appointments.' },
    { leaveType: 'CASUAL', title: 'Casual Leave', totalDaysPerYear: 8, carryForwardMax: 0, description: 'Short-notice leaves for urgent personal and family affairs.' },
    { leaveType: 'UNPAID', title: 'Leave Without Pay (LWP)', totalDaysPerYear: 30, carryForwardMax: 0, description: 'Unpaid leaves subject to administrative approval.' },
  ]

  for (const pol of leavePolicies) {
    await prisma.leavePolicy.upsert({
      where: { leaveType: pol.leaveType },
      update: pol,
      create: pol,
    })
  }

  // 4. Seed Demo Projects & Team Members
  console.log('Seeding projects...')
  const pmUser = seededUsers['rohit.verma@example.com']
  const devUser = seededUsers['amit.kumar@example.com']
  const opsUser = seededUsers['vikram.singh@example.com']

  const demoProjects = [
    {
      projectCode: 'ST-PRJ-2026-01',
      name: 'Enterprise ERP Management Portal',
      description: 'Unified business platform combining HR, Attendance, Leave, Projects, and Financial operations.',
      businessObjective: 'Eliminate disjointed spreadsheets and manual approvals across Success Tunnel business verticals.',
      departmentId: departments['ENG']?.id,
      managerId: pmUser?.id,
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      budget: 450000.0,
      progress: 68,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-02',
      name: 'GST & Compliance Automation Suite',
      description: 'Automated tax report generator and filing checklist for MSME and corporate consultancy clients.',
      businessObjective: 'Accelerate client turnaround time by 40% for quarterly tax filings.',
      departmentId: departments['CNS']?.id,
      managerId: pmUser?.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      budget: 320000.0,
      progress: 42,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-03',
      name: 'Workplace Facility & Space Expansion',
      description: 'Expansion of managed rental coworking hubs with IoT-based access and power management.',
      businessObjective: 'Open 50 additional workstations for startup clients in Delhi NCR.',
      departmentId: departments['OPS']?.id,
      managerId: opsUser?.id,
      status: 'PLANNED',
      priority: 'MEDIUM',
      budget: 750000.0,
      progress: 15,
      isDemo: true,
    },
  ]

  const seededProjects: { [code: string]: any } = {}
  for (const prj of demoProjects) {
    const record = await prisma.project.upsert({
      where: { projectCode: prj.projectCode },
      update: prj,
      create: prj,
    })
    seededProjects[prj.projectCode] = record

    // Project membership
    if (pmUser) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: record.id, userId: pmUser.id } },
        update: { role: 'Project Lead' },
        create: { projectId: record.id, userId: pmUser.id, role: 'Project Lead' },
      })
    }
    if (devUser) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: record.id, userId: devUser.id } },
        update: { role: 'Lead Developer' },
        create: { projectId: record.id, userId: devUser.id, role: 'Lead Developer' },
      })
    }
  }

  // 5. Seed Tasks
  console.log('Seeding tasks...')
  const erpPrj = seededProjects['ST-PRJ-2026-01']
  if (erpPrj && devUser && pmUser) {
    const tasks = [
      {
        taskCode: 'ST-TSK-101',
        title: 'Design Normalized Database Schema & Migrations',
        description: 'Complete schema for Users, EmployeeProfiles, Projects, Tasks, Attendance, and Leaves.',
        projectId: erpPrj.id,
        assigneeId: devUser.id,
        creatorId: pmUser.id,
        priority: 'CRITICAL',
        status: 'DONE',
        isDemo: true,
      },
      {
        taskCode: 'ST-TSK-102',
        title: 'Implement Dark Navy Sidebar & Corporate Shell',
        description: 'Responsive collapsible left sidebar with breadcrumbs, role-based navigation, and profile menu.',
        projectId: erpPrj.id,
        assigneeId: devUser.id,
        creatorId: pmUser.id,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        isDemo: true,
      },
      {
        taskCode: 'ST-TSK-103',
        title: 'Build Interactive Kanban Board for Project Tasks',
        description: 'Drag-and-drop or status-click task board with priority badges and assignee filtering.',
        projectId: erpPrj.id,
        assigneeId: devUser.id,
        creatorId: pmUser.id,
        priority: 'HIGH',
        status: 'TODO',
        isDemo: true,
      },
      {
        taskCode: 'ST-TSK-104',
        title: 'Employee Attendance Check-in Engine',
        description: 'Daily check-in and checkout button with working duration calculator and duplicate protection.',
        projectId: erpPrj.id,
        assigneeId: devUser.id,
        creatorId: pmUser.id,
        priority: 'MEDIUM',
        status: 'TODO',
        isDemo: true,
      },
      {
        taskCode: 'ST-TSK-105',
        title: 'Automated Leave Approval and Entitlement Tracking',
        description: 'Validation against employee leave balance and team calendar conflict check.',
        projectId: erpPrj.id,
        assigneeId: devUser.id,
        creatorId: pmUser.id,
        priority: 'MEDIUM',
        status: 'BACKLOG',
        isDemo: true,
      },
    ]

    for (const t of tasks) {
      await prisma.task.upsert({
        where: { taskCode: t.taskCode },
        update: t,
        create: t,
      })
    }
  }

  // 6. Seed Attendance Records for Today
  console.log('Seeding demo attendance records...')
  const todayStr = new Date().toISOString().split('T')[0]
  if (devUser) {
    const checkInTime = new Date()
    checkInTime.setHours(9, 15, 0, 0)
    await prisma.attendanceRecord.upsert({
      where: { userId_date: { userId: devUser.id, date: todayStr } },
      update: {
        checkIn: checkInTime,
        status: 'PRESENT',
        isDemo: true,
      },
      create: {
        userId: devUser.id,
        date: todayStr,
        checkIn: checkInTime,
        status: 'PRESENT',
        isDemo: true,
      },
    })
  }

  // 7. Seed Demo Documents
  console.log('Seeding demo documents...')
  if (seededUsers['admin@successtunnel.in']) {
    const adminId = seededUsers['admin@successtunnel.in'].id
    const docs = [
      {
        title: 'Success Tunnel Corporate Code of Conduct 2026',
        category: 'POLICY',
        fileUrl: '/docs/demo/code_of_conduct_2026.pdf',
        fileSize: '1.4 MB',
        fileType: 'application/pdf',
        version: 'v2.1',
        uploaderId: adminId,
        isDemo: true,
      },
      {
        title: 'Standard Employee Non-Disclosure Agreement (NDA)',
        category: 'AGREEMENT',
        fileUrl: '/docs/demo/standard_employee_nda.pdf',
        fileSize: '840 KB',
        fileType: 'application/pdf',
        version: 'v1.0',
        uploaderId: adminId,
        isDemo: true,
      },
      {
        title: 'New Hire Orientation & IT Security Checklist',
        category: 'ONBOARDING',
        fileUrl: '/docs/demo/onboarding_security_checklist.pdf',
        fileSize: '420 KB',
        fileType: 'application/pdf',
        version: 'v1.2',
        uploaderId: adminId,
        isDemo: true,
      },
    ]

    for (const d of docs) {
      const existing = await prisma.documentRecord.findFirst({ where: { title: d.title } })
      if (!existing) {
        await prisma.documentRecord.create({ data: d })
      }
    }
  }

  // 8. Seed Demo Leave Requests
  console.log('Seeding demo leave requests...')
  if (devUser && seededUsers['priya.sharma@example.com']) {
    const hrId = seededUsers['priya.sharma@example.com'].id
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekEnd = new Date()
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 9)

    const existingLeave = await prisma.leaveRequest.findFirst({ where: { userId: devUser.id, reason: 'Family engagement & travel' } })
    if (!existingLeave) {
      await prisma.leaveRequest.create({
        data: {
          userId: devUser.id,
          leaveType: 'ANNUAL',
          startDate: nextWeek,
          endDate: nextWeekEnd,
          totalDays: 3,
          reason: 'Family engagement & travel',
          status: 'PENDING',
          isDemo: true,
        },
      })
    }
  }

  // 9. Seed Demo Audit Log
  if (seededUsers['admin@successtunnel.in']) {
    await prisma.auditLog.create({
      data: {
        userId: seededUsers['admin@successtunnel.in'].id,
        action: 'SYSTEM_SEEDED',
        entityType: 'System',
        entityId: 'SEED-INIT',
        details: 'Initial demo ERP database seed executed successfully with 5 RBAC roles and realistic department structure.',
        ipAddress: '127.0.0.1',
      },
    })
  }

  // 10. Existing website CMS seed data (Services, Subservices, Properties, Blogs, Education)
  console.log('Seeding public website CMS content...')
  for (const service of sampleServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        excerpt: service.excerpt,
        icon: service.icon
      },
      create: {
        title: service.title,
        slug: service.slug,
        excerpt: service.excerpt,
        icon: service.icon
      }
    })
  }

  const consultancy = await prisma.service.findUniqueOrThrow({ where: { slug: 'consultancy' } })

  for (const subservice of consultancySubservices) {
    await prisma.subservice.upsert({
      where: { slug: subservice.slug },
      update: {
        title: subservice.title,
        content: subservice.content,
        serviceId: consultancy.id
      },
      create: {
        ...subservice,
        serviceId: consultancy.id
      }
    })
  }

  for (const property of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {
        title: property.title,
        type: property.type,
        city: property.city,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        images: '[]'
      },
      create: {
        title: property.title,
        slug: property.slug,
        type: property.type,
        city: property.city,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        images: '[]'
      }
    })
  }

  for (const post of samplePosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: new Date()
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: new Date()
      }
    })
  }

  for (const item of EDUCATION_FALLBACK_CONTENT) {
    const seedItem = item as any
    await prisma.educationContent.upsert({
      where: { slug: seedItem.slug },
      update: {
        title: seedItem.title,
        contentType: seedItem.contentType,
        category: seedItem.category,
        excerpt: seedItem.excerpt,
        body: seedItem.body,
        thumbnailUrl: seedItem.thumbnailUrl || null,
        assetUrl: seedItem.assetUrl || null,
        externalUrl: seedItem.externalUrl || null,
        ctaLabel: seedItem.ctaLabel || null,
        isPublished: true,
        isFeatured: !!seedItem.isFeatured,
        showOnHomePopup: !!seedItem.showOnHomePopup,
        publishedAt: new Date(),
      },
      create: {
        title: seedItem.title,
        slug: seedItem.slug,
        contentType: seedItem.contentType,
        category: seedItem.category || null,
        excerpt: seedItem.excerpt || null,
        body: seedItem.body || null,
        thumbnailUrl: seedItem.thumbnailUrl || null,
        assetUrl: seedItem.assetUrl || null,
        externalUrl: seedItem.externalUrl || null,
        ctaLabel: seedItem.ctaLabel || null,
        isPublished: true,
        isFeatured: !!seedItem.isFeatured,
        showOnHomePopup: !!seedItem.showOnHomePopup,
        publishedAt: new Date(),
      }
    })
  }

  console.log('✅ Success Tunnel ERP database seeding successfully completed.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
