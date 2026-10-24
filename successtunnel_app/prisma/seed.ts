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
  console.log('======================================================================')
  console.log('🚀 SEEDING SUCCESS TUNNEL ERP — REALISTIC DEMO DATA')
  console.log('   Dynamic 90-Day Timeframe, 85+ Tasks, Full Reporting Hierarchy')
  console.log('======================================================================\n')

  // Production environment safeguard
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_DEMO_SEED !== 'true') {
    console.error('❌ ERROR: Refusing to seed demo data into production environment (NODE_ENV=production).')
    console.error('To override for staging/verification, set ALLOW_PROD_DEMO_SEED=true.\n')
    process.exit(1)
  }

  const defaultPassword = await bcrypt.hash('Demo@2026!', 10)
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Demo@2026!', 10)

  // ------------------------------------------------------------------
  // 1. Seed Core Departments
  // ------------------------------------------------------------------
  console.log('Step 1/11: Seeding functional departments...')
  const departmentsData = [
    { code: 'ENG', name: 'Engineering & Technology', description: 'Software architecture, cloud infrastructure, and product engineering.' },
    { code: 'PRD', name: 'Product and Design', description: 'Product strategy, user research, wireframing, and interactive UI design.' },
    { code: 'HR', name: 'Human Resources & People', description: 'Talent acquisition, employee welfare, performance, and organizational culture.' },
    { code: 'FIN', name: 'Finance and Administration', description: 'Financial reporting, tax planning, payroll compliance, and treasury operations.' },
    { code: 'OPS', name: 'Business Operations', description: 'Operational workflows, logistics, client workspace administration, and facility management.' },
    { code: 'SLS', name: 'Sales and Customer Success', description: 'Lead generation, client onboarding, account management, and enterprise success.' },
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

  // ------------------------------------------------------------------
  // 2. Seed 16 Fictional Demo Employees with Reserved Domains
  // ------------------------------------------------------------------
  console.log('Step 2/11: Seeding 16 staff personnel with strict example domains...')
  const demoUsers = [
    // Executive Leadership
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
      joiningDate: new Date('2024-01-15'),
    },
    // HR & People
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
      joiningDate: new Date('2024-03-01'),
    },
    {
      name: 'Kavita Nair',
      email: 'kavita.nair@example.com',
      password: defaultPassword,
      role: 'hr_admin',
      departmentCode: 'HR',
      phone: '+91 98111 88990',
      employeeCode: 'ST-HR-102',
      designation: 'Talent Acquisition & Culture Lead',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-02-10'),
    },
    // Engineering & Technology
    {
      name: 'Rohit Verma',
      email: 'rohit.verma@example.com',
      password: defaultPassword,
      role: 'project_manager',
      departmentCode: 'ENG',
      phone: '+91 98222 33445',
      employeeCode: 'ST-PM-201',
      designation: 'Engineering Lead & Principal Project Manager',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-06-15'),
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
      joiningDate: new Date('2024-08-01'),
    },
    {
      name: 'Pooja Mehta',
      email: 'pooja.mehta@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'ENG',
      phone: '+91 98444 99887',
      employeeCode: 'ST-DEV-402',
      designation: 'Frontend UI/UX Specialist',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-01-20'),
    },
    {
      name: 'Siddharth Rao',
      email: 'siddharth.rao@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'ENG',
      phone: '+91 98444 11223',
      employeeCode: 'ST-DEV-403',
      designation: 'Cloud Infrastructure & DevOps Lead',
      workLocation: 'Remote - Hyderabad',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-11-10'),
    },
    {
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'ENG',
      phone: '+91 98444 33445',
      employeeCode: 'ST-DEV-404',
      designation: 'QA Automation Engineer',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-04-05'),
    },
    // Product & Design
    {
      name: 'Rajesh Menon',
      email: 'rajesh.menon@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'PRD',
      phone: '+91 98777 11223',
      employeeCode: 'ST-PRD-701',
      designation: 'Senior Product Designer & UI/UX Lead',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-07-01'),
    },
    // Finance & Administration
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
      joiningDate: new Date('2024-04-12'),
    },
    {
      name: 'Manish Joshi',
      email: 'manish.joshi@example.com',
      password: defaultPassword,
      role: 'finance_admin',
      departmentCode: 'FIN',
      phone: '+91 98333 77889',
      employeeCode: 'ST-FIN-302',
      designation: 'Senior Accountant & Payroll Analyst',
      workLocation: 'Corporate Tower - Gurugram',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-03-01'),
    },
    {
      name: 'Deepak Chawla',
      email: 'deepak.chawla@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'FIN',
      phone: '+91 98333 22110',
      employeeCode: 'ST-FIN-303',
      designation: 'Audit & Compliance Associate',
      workLocation: 'Corporate Tower - Gurugram',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-07-15'),
    },
    // Business Operations
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'OPS',
      phone: '+91 98555 66778',
      employeeCode: 'ST-OPS-501',
      designation: 'Business Operations Specialist',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-09-01'),
    },
    {
      name: 'Rahul Iyer',
      email: 'rahul.iyer@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'OPS',
      phone: '+91 98555 99001',
      employeeCode: 'ST-OPS-502',
      designation: 'Workspace & Facility Coordinator',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2025-05-18'),
    },
    // Sales and Customer Success
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@example.com',
      password: defaultPassword,
      role: 'employee',
      departmentCode: 'SLS',
      phone: '+91 98666 77889',
      employeeCode: 'ST-SLS-601',
      designation: 'Corporate Account Executive',
      workLocation: 'Branch Office - Mumbai',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-10-01'),
    },
    {
      name: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      password: defaultPassword,
      role: 'project_manager',
      departmentCode: 'SLS',
      phone: '+91 98666 11223',
      employeeCode: 'ST-SLS-602',
      designation: 'Head of Sales & Customer Success',
      workLocation: 'Branch Office - Mumbai',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-05-20'),
    },
  ]

  const seededUsers: { [email: string]: any } = {}
  const seededProfiles: { [email: string]: any } = {}

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
        status: u.status.toLowerCase(),
      },
      create: {
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        departmentId: dept ? dept.id : null,
        phone: u.phone,
        status: u.status.toLowerCase(),
      },
    })
    seededUsers[u.email] = userRecord

    const profileRecord = await prisma.employeeProfile.upsert({
      where: { userId: userRecord.id },
      update: {
        employeeCode: u.employeeCode,
        designation: u.designation,
        workLocation: u.workLocation,
        employmentType: u.employmentType,
        joiningDate: u.joiningDate,
        status: u.status,
        isDemo: true,
      },
      create: {
        userId: userRecord.id,
        employeeCode: u.employeeCode,
        designation: u.designation,
        workLocation: u.workLocation,
        employmentType: u.employmentType,
        joiningDate: u.joiningDate,
        status: u.status,
        isDemo: true,
      },
    })
    seededProfiles[u.email] = profileRecord
  }

  // Setup Organizational Reporting Hierarchy (managerId links between EmployeeProfiles)
  const adminProfile = seededProfiles['admin@successtunnel.in']
  const priyaProfile = seededProfiles['priya.sharma@example.com']
  const rohitProfile = seededProfiles['rohit.verma@example.com']
  const snehaProfile = seededProfiles['sneha.patel@example.com']
  const vikramProfile = seededProfiles['vikram.singh@example.com']
  const arjunProfile = seededProfiles['arjun.kapoor@example.com']

  // Department Heads report to Managing Director
  const deptHeads = [priyaProfile, rohitProfile, snehaProfile, vikramProfile, arjunProfile]
  for (const head of deptHeads) {
    if (head && adminProfile) {
      await prisma.employeeProfile.update({
        where: { id: head.id },
        data: { managerId: adminProfile.id },
      })
    }
  }

  // Engineering & Product Team report to Rohit Verma
  const engTeam = [
    seededProfiles['amit.kumar@example.com'],
    seededProfiles['pooja.mehta@example.com'],
    seededProfiles['siddharth.rao@example.com'],
    seededProfiles['neha.gupta@example.com'],
    seededProfiles['rajesh.menon@example.com'],
  ]
  for (const emp of engTeam) {
    if (emp && rohitProfile) {
      await prisma.employeeProfile.update({
        where: { id: emp.id },
        data: { managerId: rohitProfile.id },
      })
    }
  }

  // Finance Team report to Sneha Patel
  const finTeam = [
    seededProfiles['manish.joshi@example.com'],
    seededProfiles['deepak.chawla@example.com'],
  ]
  for (const emp of finTeam) {
    if (emp && snehaProfile) {
      await prisma.employeeProfile.update({
        where: { id: emp.id },
        data: { managerId: snehaProfile.id },
      })
    }
  }

  // HR Team report to Priya Sharma
  if (seededProfiles['kavita.nair@example.com'] && priyaProfile) {
    await prisma.employeeProfile.update({
      where: { id: seededProfiles['kavita.nair@example.com'].id },
      data: { managerId: priyaProfile.id },
    })
  }

  // Operations Team report to Vikram Singh
  if (seededProfiles['rahul.iyer@example.com'] && vikramProfile) {
    await prisma.employeeProfile.update({
      where: { id: seededProfiles['rahul.iyer@example.com'].id },
      data: { managerId: vikramProfile.id },
    })
  }

  // Sales Team report to Arjun Kapoor
  if (seededProfiles['ananya.deshmukh@example.com'] && arjunProfile) {
    await prisma.employeeProfile.update({
      where: { id: seededProfiles['ananya.deshmukh@example.com'].id },
      data: { managerId: arjunProfile.id },
    })
  }

  // Assign department head references
  if (departments['HR'] && seededUsers['priya.sharma@example.com']) {
    await prisma.department.update({ where: { id: departments['HR'].id }, data: { headId: seededUsers['priya.sharma@example.com'].id } })
  }
  if (departments['FIN'] && seededUsers['sneha.patel@example.com']) {
    await prisma.department.update({ where: { id: departments['FIN'].id }, data: { headId: seededUsers['sneha.patel@example.com'].id } })
  }
  if (departments['ENG'] && seededUsers['rohit.verma@example.com']) {
    await prisma.department.update({ where: { id: departments['ENG'].id }, data: { headId: seededUsers['rohit.verma@example.com'].id } })
  }
  if (departments['PRD'] && seededUsers['rajesh.menon@example.com']) {
    await prisma.department.update({ where: { id: departments['PRD'].id }, data: { headId: seededUsers['rajesh.menon@example.com'].id } })
  }
  if (departments['OPS'] && seededUsers['vikram.singh@example.com']) {
    await prisma.department.update({ where: { id: departments['OPS'].id }, data: { headId: seededUsers['vikram.singh@example.com'].id } })
  }
  if (departments['SLS'] && seededUsers['arjun.kapoor@example.com']) {
    await prisma.department.update({ where: { id: departments['SLS'].id }, data: { headId: seededUsers['arjun.kapoor@example.com'].id } })
  }
  if (departments['CNS'] && seededUsers['arjun.kapoor@example.com']) {
    await prisma.department.update({ where: { id: departments['CNS'].id }, data: { headId: seededUsers['arjun.kapoor@example.com'].id } })
  }

  // ------------------------------------------------------------------
  // 3. Seed Corporate Leave Policies
  // ------------------------------------------------------------------
  console.log('Step 3/11: Seeding corporate leave entitlement policies...')
  const leavePolicies = [
    { leaveType: 'ANNUAL', title: 'Annual Paid Leave', totalDaysPerYear: 18, carryForwardMax: 5, description: 'Standard paid annual leave for rest, vacation, and personal time.' },
    { leaveType: 'SICK', title: 'Medical / Sick Leave', totalDaysPerYear: 10, carryForwardMax: 0, description: 'Leaves granted for health appointments and medical recuperation.' },
    { leaveType: 'CASUAL', title: 'Casual Leave', totalDaysPerYear: 8, carryForwardMax: 0, description: 'Short-notice leaves for urgent personal and domestic matters.' },
    { leaveType: 'UNPAID', title: 'Leave Without Pay (LWP)', totalDaysPerYear: 30, carryForwardMax: 0, description: 'Unpaid leaves requiring department head authorization.' },
  ]

  for (const pol of leavePolicies) {
    await prisma.leavePolicy.upsert({
      where: { leaveType: pol.leaveType },
      update: pol,
      create: pol,
    })
  }

  // ------------------------------------------------------------------
  // 4. Seed Dynamic Leave Requests (Spanning Dynamic 90-Day Range)
  // ------------------------------------------------------------------
  console.log('Step 4/11: Seeding leave requests across the active dynamic period...')
  const now = new Date()

  // Generate dynamic dates: 60 days ago, 45 days ago, 25 days ago, 10 days ago, 5 days ahead
  const dAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const dAhead = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  const leaveData = [
    {
      userEmail: 'amit.kumar@example.com',
      leaveType: 'ANNUAL',
      startDate: dAgo(65),
      endDate: dAgo(63),
      totalDays: 3,
      reason: 'Annual family festival & travel back to hometown',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Deliverables delegated to Siddharth.',
      reviewedAt: dAgo(67),
    },
    {
      userEmail: 'sneha.patel@example.com',
      leaveType: 'CASUAL',
      startDate: dAgo(50),
      endDate: dAgo(49),
      totalDays: 2,
      reason: 'Personal legal registration & family commitment',
      status: 'APPROVED',
      reviewedByEmail: 'admin@successtunnel.in',
      reviewReason: 'Approved. Tax schedule on track.',
      reviewedAt: dAgo(52),
    },
    {
      userEmail: 'vikram.singh@example.com',
      leaveType: 'SICK',
      startDate: dAgo(35),
      endDate: dAgo(35),
      totalDays: 1,
      reason: 'Medical recovery following outpatient surgery',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Rest well.',
      reviewedAt: dAgo(35),
    },
    {
      userEmail: 'rohit.verma@example.com',
      leaveType: 'ANNUAL',
      startDate: dAgo(20),
      endDate: dAgo(17),
      totalDays: 4,
      reason: 'Annual paid leave for personal rest and trekking',
      status: 'APPROVED',
      reviewedByEmail: 'admin@successtunnel.in',
      reviewReason: 'Approved. Handover confirmed.',
      reviewedAt: dAgo(23),
    },
    {
      userEmail: 'pooja.mehta@example.com',
      leaveType: 'SICK',
      startDate: dAgo(12),
      endDate: dAgo(11),
      totalDays: 2,
      reason: 'Prescribed medical rest and recuperation',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Medical certificate noted on file.',
      reviewedAt: dAgo(12),
    },
    {
      userEmail: 'amit.kumar@example.com',
      leaveType: 'ANNUAL',
      startDate: dAgo(5),
      endDate: dAgo(2),
      totalDays: 4,
      reason: 'Personal alumni reunion trip',
      status: 'REJECTED',
      reviewedByEmail: 'rohit.verma@example.com',
      reviewReason: 'Critical end-of-sprint milestone release scheduled that week.',
      reviewedAt: dAgo(7),
    },
    {
      userEmail: 'deepak.chawla@example.com',
      leaveType: 'SICK',
      startDate: dAgo(1),
      endDate: now,
      totalDays: 2,
      reason: 'Severe migraine doctor appointment & rest',
      status: 'PENDING',
      reviewedByEmail: null,
      reviewReason: null,
      reviewedAt: null,
    },
    {
      userEmail: 'siddharth.rao@example.com',
      leaveType: 'CASUAL',
      startDate: dAhead(4),
      endDate: dAhead(6),
      totalDays: 3,
      reason: 'Family wedding celebrations in Hyderabad',
      status: 'PENDING',
      reviewedByEmail: null,
      reviewReason: null,
      reviewedAt: null,
    },
  ]

  const approvedLeaveMap = new Map<string, Set<string>>() // email -> set of date strings (YYYY-MM-DD)

  for (const l of leaveData) {
    const user = seededUsers[l.userEmail]
    const reviewer = l.reviewedByEmail ? seededUsers[l.reviewedByEmail] : null
    if (!user) continue

    await prisma.leaveRequest.create({
      data: {
        userId: user.id,
        leaveType: l.leaveType,
        startDate: l.startDate,
        endDate: l.endDate,
        totalDays: l.totalDays,
        reason: l.reason,
        status: l.status,
        reviewedById: reviewer ? reviewer.id : null,
        reviewReason: l.reviewReason,
        reviewedAt: l.reviewedAt,
        isDemo: true,
      },
    })

    if (l.status === 'APPROVED') {
      if (!approvedLeaveMap.has(l.userEmail)) {
        approvedLeaveMap.set(l.userEmail, new Set())
      }
      const cur = new Date(l.startDate)
      while (cur <= l.endDate) {
        approvedLeaveMap.get(l.userEmail)!.add(cur.toISOString().split('T')[0])
        cur.setDate(cur.getDate() + 1)
      }
    }
  }

  // ------------------------------------------------------------------
  // 5. Seed Dynamic 90-Calendar-Day Attendance Dataset
  // ------------------------------------------------------------------
  console.log('Step 5/11: Generating dynamic 90-day attendance punch records...')

  const attendanceEmployees = [
    seededUsers['amit.kumar@example.com'],
    seededUsers['pooja.mehta@example.com'],
    seededUsers['siddharth.rao@example.com'],
    seededUsers['neha.gupta@example.com'],
    seededUsers['rajesh.menon@example.com'],
    seededUsers['rohit.verma@example.com'],
    seededUsers['sneha.patel@example.com'],
    seededUsers['manish.joshi@example.com'],
    seededUsers['deepak.chawla@example.com'],
    seededUsers['priya.sharma@example.com'],
    seededUsers['kavita.nair@example.com'],
    seededUsers['vikram.singh@example.com'],
    seededUsers['rahul.iyer@example.com'],
    seededUsers['ananya.deshmukh@example.com'],
    seededUsers['arjun.kapoor@example.com'],
  ].filter(Boolean)

  let attendanceCount = 0
  let missingPunchCount = 0
  let leaveDaysExcluded = 0

  // Iterate over exactly 90 calendar days backwards up to today
  for (let d = 89; d >= 0; d--) {
    const targetDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
    const dateStr = targetDate.toISOString().split('T')[0]
    const dayOfWeek = targetDate.getDay() // 0 = Sun, 6 = Sat

    // Skip weekends: business closed, no attendance punch
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue
    }

    for (let i = 0; i < attendanceEmployees.length; i++) {
      const emp = attendanceEmployees[i]
      const userLeaves = approvedLeaveMap.get(emp.email)

      // Rule: When an employee is on approved leave, do not record normal attendance for that day
      if (userLeaves && userLeaves.has(dateStr)) {
        leaveDaysExcluded++
        continue
      }

      // Deterministic pseudo-random variation based on employee id and date string
      const dateNum = parseInt(dateStr.replace(/-/g, ''), 10)
      const hash = (emp.id * 37 + dateNum) % 100

      // Scenario A: Missing Punch (2% of workdays) - e.g. punch in but forgot to punch out
      if (hash === 42 && d > 1) {
        const inHour = 9
        const inMin = 15 + (hash % 15)
        const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)

        await prisma.attendanceRecord.upsert({
          where: { userId_date: { userId: emp.id, date: dateStr } },
          update: {
            checkIn,
            checkOut: null,
            durationMinutes: 0,
            status: 'PENDING_REGULARIZATION',
            notes: 'Missing punch: Employee checked in but exit punch not recorded.',
            correctionRequested: true,
            correctionReason: 'Biometric exit sensor timeout; requested 6:30 PM punch regularization.',
            isDemo: true,
          },
          create: {
            userId: emp.id,
            date: dateStr,
            checkIn,
            checkOut: null,
            durationMinutes: 0,
            status: 'PENDING_REGULARIZATION',
            notes: 'Missing punch: Employee checked in but exit punch not recorded.',
            correctionRequested: true,
            correctionReason: 'Biometric exit sensor timeout; requested 6:30 PM punch regularization.',
            isDemo: true,
          },
        })
        missingPunchCount++
        attendanceCount++
        continue
      }

      // Scenario B: Regularized Punch (3% of workdays) - previously regularized by manager
      if (hash === 88 && d > 5) {
        const checkIn = new Date(`${dateStr}T09:15:00.000Z`)
        const checkOut = new Date(`${dateStr}T18:15:00.000Z`)
        const durationMinutes = 540 // 9 hours = 540 min

        await prisma.attendanceRecord.upsert({
          where: { userId_date: { userId: emp.id, date: dateStr } },
          update: {
            checkIn,
            checkOut,
            durationMinutes,
            status: 'REGULARIZED',
            notes: 'Regularized punch approved by HR.',
            correctionRequested: false,
            correctionReason: 'Biometric card re-scanned and approved.',
            correctionApprovedBy: seededUsers['priya.sharma@example.com']?.id,
            isDemo: true,
          },
          create: {
            userId: emp.id,
            date: dateStr,
            checkIn,
            checkOut,
            durationMinutes,
            status: 'REGULARIZED',
            notes: 'Regularized punch approved by HR.',
            correctionRequested: false,
            correctionReason: 'Biometric card re-scanned and approved.',
            correctionApprovedBy: seededUsers['priya.sharma@example.com']?.id,
            isDemo: true,
          },
        })
        attendanceCount++
        continue
      }

      // Scenario C: Half Day (4% of workdays)
      if (hash > 92 && hash <= 96) {
        const inHour = 9
        const inMin = 30
        const durationMinutes = 240 // 4 hours
        const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
        const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

        await prisma.attendanceRecord.upsert({
          where: { userId_date: { userId: emp.id, date: dateStr } },
          update: {
            checkIn,
            checkOut,
            durationMinutes,
            status: 'HALF_DAY',
            notes: 'First-half operational shift completed.',
            isDemo: true,
          },
          create: {
            userId: emp.id,
            date: dateStr,
            checkIn,
            checkOut,
            durationMinutes,
            status: 'HALF_DAY',
            notes: 'First-half operational shift completed.',
            isDemo: true,
          },
        })
        attendanceCount++
        continue
      }

      // Scenario D: Late Arrival (6% of workdays)
      if (hash > 86 && hash <= 92) {
        const inHour = 10
        const inMin = (hash % 20) + 5 // 10:05 to 10:25
        const durationMinutes = 480 // 8 hours
        const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
        const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

        await prisma.attendanceRecord.upsert({
          where: { userId_date: { userId: emp.id, date: dateStr } },
          update: {
            checkIn,
            checkOut,
            durationMinutes,
            status: 'LATE',
            notes: 'Transit delay logged.',
            isDemo: true,
          },
          create: {
            userId: emp.id,
            date: dateStr,
            checkIn,
            checkOut,
            durationMinutes,
            status: 'LATE',
            notes: 'Transit delay logged.',
            isDemo: true,
          },
        })
        attendanceCount++
        continue
      }

      // Scenario E: Standard Full-Day Present (~85% of workdays)
      const inHour = 9
      const inMin = (hash % 25) + 5 // 9:05 to 9:30
      const durationMinutes = 480 + (hash % 60) // 8h to 8h 59m
      const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
      const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

      await prisma.attendanceRecord.upsert({
        where: { userId_date: { userId: emp.id, date: dateStr } },
        update: {
          checkIn,
          checkOut,
          durationMinutes,
          status: 'PRESENT',
          isDemo: true,
        },
        create: {
          userId: emp.id,
          date: dateStr,
          checkIn,
          checkOut,
          durationMinutes,
          status: 'PRESENT',
          isDemo: true,
        },
      })
      attendanceCount++
    }
  }

  console.log(`  ✅ Populated ${attendanceCount} dynamic attendance records across 90 calendar days.`)
  console.log(`  ✅ Included ${missingPunchCount} missing punch regularizations and excluded ${leaveDaysExcluded} approved leave days.`)

  // ------------------------------------------------------------------
  // 6. Seed 5 Fictional Projects
  // ------------------------------------------------------------------
  console.log('Step 6/11: Seeding 5 enterprise projects representing key business functions...')
  const pmUser = seededUsers['rohit.verma@example.com']
  const cnsLead = seededUsers['arjun.kapoor@example.com']
  const opsUser = seededUsers['vikram.singh@example.com']
  const finLead = seededUsers['sneha.patel@example.com']

  const demoProjects = [
    {
      projectCode: 'ST-PRJ-2026-01',
      name: 'Success Tunnel Web Platform & Modernization',
      description: 'Unified business platform combining HR, Attendance, Leave, Projects, and Financial operations with verified Next.js engineering.',
      businessObjective: 'Eliminate disjointed spreadsheets and manual approvals across Success Tunnel business verticals.',
      departmentId: departments['ENG']?.id,
      managerId: pmUser?.id,
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      startDate: dAgo(75),
      endDate: dAhead(45),
      budget: 480000.0,
      progress: 0, // Will be computed dynamically from tasks!
      isPublic: true,
      publicSlug: 'erp-modernization',
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-02',
      name: 'Customer Relationship Management Suite',
      description: 'Lead tracking, enquiry management, customer profiles, follow-up workflows, and conversion analytics.',
      businessObjective: 'Accelerate lead-to-opportunity conversion and centralize corporate client contact histories.',
      departmentId: departments['SLS']?.id,
      managerId: cnsLead?.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: dAgo(60),
      endDate: dAhead(30),
      budget: 340000.0,
      progress: 0,
      isPublic: true,
      publicSlug: 'enterprise-crm',
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-03',
      name: 'Internal Operations & Facility Hub',
      description: 'Employee directory, task management, attendance workflows, and workspace hub administration.',
      businessObjective: 'Streamline onboarding, access provisioning, and infrastructure resource allocation for staff.',
      departmentId: departments['OPS']?.id,
      managerId: opsUser?.id,
      status: 'PLANNED',
      priority: 'MEDIUM',
      startDate: dAgo(20),
      endDate: dAhead(60),
      budget: 250000.0,
      progress: 0,
      isPublic: false,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-04',
      name: 'GST & Corporate Compliance Automation Suite',
      description: 'Automated tax report generator and filing checklist for MSME and corporate consultancy clients.',
      businessObjective: 'Deliver automated tax reconciliation and reduce compliance processing time by 40%.',
      departmentId: departments['FIN']?.id,
      managerId: finLead?.id,
      status: 'COMPLETED',
      priority: 'HIGH',
      startDate: dAgo(85),
      endDate: dAgo(10),
      budget: 310000.0,
      progress: 100,
      isPublic: true,
      publicSlug: 'tax-compliance-suite',
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-05',
      name: 'ISO 27001 Security & Data Governance',
      description: 'Institutional cybersecurity risk assessment, access controls review, and data encryption verification.',
      businessObjective: 'Achieve enterprise information security compliance for tier-1 corporate customer audits.',
      departmentId: departments['ENG']?.id,
      managerId: pmUser?.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: dAgo(45),
      endDate: dAhead(15),
      budget: 220000.0,
      progress: 0,
      isPublic: false,
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

    // Add manager as Lead member
    if (prj.managerId) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: record.id, userId: prj.managerId } },
        update: { role: 'Lead' },
        create: { projectId: record.id, userId: prj.managerId, role: 'Lead' },
      })
    }
  }

  // ------------------------------------------------------------------
  // 7. Seed 85 Tasks Distributed Across the 5 Projects
  // ------------------------------------------------------------------
  console.log('Step 7/11: Seeding 85 realistic tasks with full Kanban state distribution...')

  const devAmit = seededUsers['amit.kumar@example.com']
  const devPooja = seededUsers['pooja.mehta@example.com']
  const devSid = seededUsers['siddharth.rao@example.com']
  const qaNeha = seededUsers['neha.gupta@example.com']
  const desRajesh = seededUsers['rajesh.menon@example.com']
  const finManish = seededUsers['manish.joshi@example.com']
  const finDeepak = seededUsers['deepak.chawla@example.com']
  const opsRahul = seededUsers['rahul.iyer@example.com']
  const slsAnanya = seededUsers['ananya.deshmukh@example.com']

  // Associate team members with projects
  const projectTeams = [
    { code: 'ST-PRJ-2026-01', members: [devAmit, devPooja, devSid, qaNeha, desRajesh] },
    { code: 'ST-PRJ-2026-02', members: [slsAnanya, devAmit, devPooja, qaNeha] },
    { code: 'ST-PRJ-2026-03', members: [opsRahul, opsUser, devSid] },
    { code: 'ST-PRJ-2026-04', members: [finManish, finDeepak, devAmit] },
    { code: 'ST-PRJ-2026-05', members: [devSid, devAmit, qaNeha] },
  ]

  for (const pt of projectTeams) {
    const prj = seededProjects[pt.code]
    if (!prj) continue
    for (const member of pt.members) {
      if (!member) continue
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: prj.id, userId: member.id } },
        update: { role: 'Contributor' },
        create: { projectId: prj.id, userId: member.id, role: 'Contributor' },
      })
    }
  }

  // Define 85 Tasks
  const taskBlueprints = [
    // -------------------------------------------------------------
    // Project 1: ST-PRJ-2026-01 (Web Platform Modernization) - 22 tasks
    // -------------------------------------------------------------
    {
      taskCode: 'ST-TSK-101',
      title: 'Design Normalized Database Schema & Migrations',
      description: '[Milestone: M1 - Architecture]\nAcceptance Criteria:\n- [x] Schema models for Users, Profiles, Projects, Tasks\n- [x] Prisma migrations tested\nEst: 16h. Risk: Low.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(60),
    },
    {
      taskCode: 'ST-TSK-102',
      title: 'Implement Dark Navy Sidebar & Corporate Shell',
      description: '[Milestone: M1 - Architecture]\nCollapsible responsive sidebar with breadcrumbs and user profile menu.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devPooja,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(55),
    },
    {
      taskCode: 'ST-TSK-103',
      title: 'Configure JWT Authentication with Rate Limiting',
      description: '[Milestone: M1 - Architecture]\nHttpOnly session cookies, bcrypt password hashing, and in-memory rate limiting.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(50),
    },
    {
      taskCode: 'ST-TSK-104',
      title: 'Build Reusable Table & Pagination Components',
      description: '[Milestone: M2 - UI Components]\nStandardized data table with server-side pagination, search debouncing, and sort.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devPooja,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(45),
    },
    {
      taskCode: 'ST-TSK-105',
      title: 'Implement Executive Dashboard Metrics API',
      description: '[Milestone: M2 - Dashboard]\nDatabase aggregate calculations for headcounts, active projects, and cash balances.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(40),
    },
    {
      taskCode: 'ST-TSK-106',
      title: 'Establish Employee Directory & Profile Drawer',
      description: '[Milestone: M3 - Workforce Module]\nEmployee listing with department filters, reporting managers, and profile drawer.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devPooja,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(30),
    },
    {
      taskCode: 'ST-TSK-107',
      title: 'Build Attendance Daily Punch & Calculation Engine',
      description: '[Milestone: M3 - Workforce Module]\nCheck-in/out endpoints with duration calculation and regularization workflows.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      dueDate: dAhead(5),
    },
    {
      taskCode: 'ST-TSK-108',
      title: 'Leave Request Multi-Tier Approval Workflow',
      description: '[Milestone: M3 - Workforce Module]\nLeave application form, balance checking, manager review, and email notifications.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devPooja,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(8),
    },
    {
      taskCode: 'ST-TSK-109',
      title: 'Automated CI/CD Pipeline on GitHub Actions',
      description: '[Milestone: M4 - DevOps]\nAutomated TypeScript compilation, linting, and Prisma migration checks on pull requests.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devSid,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(25),
    },
    {
      taskCode: 'ST-TSK-110',
      title: 'Comprehensive E2E Smoke & Integration Test Suite',
      description: '[Milestone: M4 - Quality Assurance]\nAutomated verification across authentication, workforce, finance, and CRM.\nEst: 18h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(10),
    },
    {
      taskCode: 'ST-TSK-111',
      title: 'Public Website Refinement & SEO Hardening',
      description: '[Milestone: M5 - Public Portal]\nCanonical URLs, OpenGraph metadata, robots.txt, and public project case study confidentiality.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devPooja,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(15),
    },
    {
      taskCode: 'ST-TSK-112',
      title: 'Public Enquiry Honeypot & CRM Forwarding Pipeline',
      description: '[Milestone: M5 - CRM Pipeline]\nAnti-spam validation, rate-limiting, and lead generation from public contact forms.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(12),
    },
    {
      taskCode: 'ST-TSK-113',
      title: 'Role-Based Access Control Audit & Boundary Verification',
      description: '[Milestone: M6 - Security]\nVerify that employees cannot edit other profiles or approve their own leaves.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'IN_REVIEW',
      dueDate: dAhead(3),
    },
    {
      taskCode: 'ST-TSK-114',
      title: 'Design System Typography & Elevation Guidelines',
      description: '[Milestone: M2 - UI Components]\nUnified spacing tokens, color scales, button states, and accessible contrast ratios.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: desRajesh,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      dueDate: dAhead(2),
    },
    {
      taskCode: 'ST-TSK-115',
      title: 'Database Query Indexing & Performance Optimization',
      description: '[Milestone: M4 - Performance]\nCompound indexes on Attendance (userId, date) and Tasks (projectId, status).\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devSid,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(15),
    },
    {
      taskCode: 'ST-TSK-116',
      title: 'Automated Database Daily Backup Script',
      description: '[Milestone: M4 - DevOps]\nEncrypted S3 bucket daily snapshot cron job with slack notification on failure.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devSid,
      creator: pmUser,
      priority: 'HIGH',
      status: 'TODO',
      dueDate: dAhead(18),
    },
    {
      taskCode: 'ST-TSK-117',
      title: 'User Profile Password Reset via Secure Magic Link',
      description: '[Milestone: M6 - Security]\nTime-limited cryptographic tokens sent via SMTP for verified email self-recovery.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(22),
    },
    {
      taskCode: 'ST-TSK-118',
      title: 'Interactive User Onboarding & Guided Tour',
      description: '[Milestone: M2 - UI Components]\nWalkthrough tooltips explaining key ERP modules for newly onboarded staff.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: desRajesh,
      creator: pmUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(30),
    },
    {
      taskCode: 'ST-TSK-119',
      title: 'Mobile App API Authentication Endpoints',
      description: '[Milestone: M7 - Future Mobile]\nOAuth2 / Bearer token exchange endpoints for upcoming Android / iOS apps.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(35),
    },
    {
      taskCode: 'ST-TSK-120',
      title: 'External Webhook Delivery for Status Changes',
      description: '[Milestone: M7 - Integrations]\nConfigurable HMAC-signed webhook dispatches on Task, Lead, and Invoice events.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devSid,
      creator: pmUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(40),
    },
    {
      taskCode: 'ST-TSK-121',
      title: 'Single Sign-On (SSO) with Google Workspace',
      description: '[Milestone: M6 - Security]\nSAML 2.0 / OpenID Connect enterprise identity federation for staff login.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devSid,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'BLOCKED',
      dueDate: dAhead(20),
    },
    {
      taskCode: 'ST-TSK-122',
      title: 'Multi-Factor Authentication (MFA) with TOTP Authenticator',
      description: '[Milestone: M6 - Security]\nRFC 6238 TOTP QR code enrollment and backup recovery codes.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-01',
      assignee: devAmit,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(14),
    },

    // -------------------------------------------------------------
    // Project 2: ST-PRJ-2026-02 (CRM Suite) - 18 tasks
    // -------------------------------------------------------------
    {
      taskCode: 'ST-TSK-201',
      title: 'CRM Customer Directory & Detail Views',
      description: '[Milestone: C1 - Customer Master]\nSearchable customer company cards, primary contacts, and billing addresses.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(45),
    },
    {
      taskCode: 'ST-TSK-202',
      title: 'Lead Pipeline Kanban Board with Drag & Drop',
      description: '[Milestone: C2 - Sales Pipeline]\nVisual pipeline stages: New, Contacted, Qualified, Proposal Sent, Won, Lost.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devPooja,
      creator: cnsLead,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(35),
    },
    {
      taskCode: 'ST-TSK-203',
      title: 'Touchpoint Activity Timeline (Calls, Emails, Meetings)',
      description: '[Milestone: C2 - Sales Pipeline]\nChronological activity log for customer touchpoints with follow-up reminders.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(25),
    },
    {
      taskCode: 'ST-TSK-204',
      title: 'Automated Lead Qualification Scoring Model',
      description: '[Milestone: C3 - Intelligence]\nRule-based scoring based on company budget, project scope, and responsiveness.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: dAhead(6),
    },
    {
      taskCode: 'ST-TSK-205',
      title: 'Commercial Proposal PDF Document Generator',
      description: '[Milestone: C3 - Proposals]\nGenerate branded executive PDF proposals with dynamic milestone line items.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devAmit,
      creator: cnsLead,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(10),
    },
    {
      taskCode: 'ST-TSK-206',
      title: 'Contract e-Sign Integration Workflow',
      description: '[Milestone: C3 - Proposals]\nDigital signing integration for service agreements before project kickoff.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devPooja,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'BLOCKED',
      dueDate: dAhead(18),
    },
    {
      taskCode: 'ST-TSK-207',
      title: 'CRM Sales Conversion Analytics & Funnel Charts',
      description: '[Milestone: C4 - Analytics]\nFunnel visualization tracking lead conversion rates and sales velocity.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devPooja,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      dueDate: dAhead(4),
    },
    {
      taskCode: 'ST-TSK-208',
      title: 'Email Sync & Outbound Campaign Dispatcher',
      description: '[Milestone: C4 - Communications]\nTransactional outbound email tracking for prospect follow-ups.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devAmit,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(12),
    },
    {
      taskCode: 'ST-TSK-209',
      title: 'Enquiry SLA Escalation & Staff Notification Triggers',
      description: '[Milestone: C1 - Customer Master]\nAlert managers if a new website enquiry remains uncontacted for over 4 hours.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(7),
    },
    {
      taskCode: 'ST-TSK-210',
      title: 'Customer Satisfaction (CSAT) Post-Delivery Survey',
      description: '[Milestone: C5 - Retention]\nAutomated feedback survey dispatched 7 days after project completion.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(25),
    },
    {
      taskCode: 'ST-TSK-211',
      title: 'Corporate Account Tiering & Health Scoring',
      description: '[Milestone: C5 - Retention]\nClassify enterprise accounts into Platinum, Gold, Silver based on annual billing.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(28),
    },
    {
      taskCode: 'ST-TSK-212',
      title: 'Duplicate Lead Detection & Resolution Merging',
      description: '[Milestone: C1 - Customer Master]\nIdentify matching phone or email records and prompt user to merge histories.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: qaNeha,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(15),
    },
    {
      taskCode: 'ST-TSK-213',
      title: 'WhatsApp Business API Notification Webhook',
      description: '[Milestone: C4 - Communications]\nSend verified enquiry acknowledgement and appointment reminders via WhatsApp.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devAmit,
      creator: cnsLead,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(32),
    },
    {
      taskCode: 'ST-TSK-214',
      title: 'Customer Meeting Calendar Scheduling Link',
      description: '[Milestone: C2 - Sales Pipeline]\nIntegrate personalized booking links for prospective client consultations.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: devPooja,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(14),
    },
    {
      taskCode: 'ST-TSK-215',
      title: 'Competitor Win/Loss Analysis Reporting',
      description: '[Milestone: C4 - Analytics]\nTrack lost deal reasons and produce quarterly market competitive summaries.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(35),
    },
    {
      taskCode: 'ST-TSK-216',
      title: 'CRM Role Permissions & Account Masking',
      description: '[Milestone: C1 - Customer Master]\nPrevent unauthorized staff from viewing confidential client pricing.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: qaNeha,
      creator: cnsLead,
      priority: 'HIGH',
      status: 'IN_REVIEW',
      dueDate: dAhead(5),
    },
    {
      taskCode: 'ST-TSK-217',
      title: 'Lead Source Attribution & UTM Tracking',
      description: '[Milestone: C2 - Sales Pipeline]\nCapture Google Ads, Organic, LinkedIn, and Referral attribution on incoming leads.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(18),
    },
    {
      taskCode: 'ST-TSK-218',
      title: 'CRM Automated Touchpoint Digest for Management',
      description: '[Milestone: C4 - Analytics]\nWeekly email digest summarizing pipeline movements and won opportunities.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-02',
      assignee: slsAnanya,
      creator: cnsLead,
      priority: 'LOW',
      status: 'TODO',
      dueDate: dAhead(20),
    },

    // -------------------------------------------------------------
    // Project 3: ST-PRJ-2026-03 (Internal Operations & Facility Hub) - 15 tasks
    // -------------------------------------------------------------
    {
      taskCode: 'ST-TSK-301',
      title: 'Workstation Asset Tagging & Hardware Inventory',
      description: '[Milestone: O1 - Facilities]\nLog laptop serial numbers, monitors, and ergonomic furniture assigned to staff.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: dAhead(15),
    },
    {
      taskCode: 'ST-TSK-302',
      title: 'IoT Biometric Reader Integration for Turnstile Gates',
      description: '[Milestone: O1 - Facilities]\nDirect network socket listener syncing turnstile punches to AttendanceRecord.\nEst: 18h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: devSid,
      creator: opsUser,
      priority: 'HIGH',
      status: 'TODO',
      dueDate: dAhead(25),
    },
    {
      taskCode: 'ST-TSK-303',
      title: 'Conference Room Booking & Calendar Sync',
      description: '[Milestone: O2 - Workspace]\nShared calendar interface for reserving executive meeting rooms and AV equipment.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(22),
    },
    {
      taskCode: 'ST-TSK-304',
      title: 'Office Consumables & Vendor Reordering Workflow',
      description: '[Milestone: O1 - Facilities]\nTrack inventory thresholds for office supplies and generate vendor POs.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'TODO',
      dueDate: dAhead(28),
    },
    {
      taskCode: 'ST-TSK-305',
      title: 'Facility Maintenance Ticket System',
      description: '[Milestone: O2 - Workspace]\nStaff issue submission for HVAC, electrical, and plumbing repairs.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: dAhead(18),
    },
    {
      taskCode: 'ST-TSK-306',
      title: 'Visitor Management Kiosk & Visitor Badge Printing',
      description: '[Milestone: O2 - Workspace]\nSelf-service iPad kiosk for office guests with thermal badge printing.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(45),
    },
    {
      taskCode: 'ST-TSK-307',
      title: 'Company Vehicle & Local Logistics Booking',
      description: '[Milestone: O3 - Logistics]\nFleet reservation schedule and fuel reimbursement tracking for field teams.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(50),
    },
    {
      taskCode: 'ST-TSK-308',
      title: 'Emergency Evacuation & Safety Warden Protocol Documentation',
      description: '[Milestone: O3 - Safety]\nDocument floor-wise evacuation maps and emergency contact drills.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(10),
    },
    {
      taskCode: 'ST-TSK-309',
      title: 'Server Room Climate & UPS Power Sensor Dashboard',
      description: '[Milestone: O1 - Facilities]\nSNMP telemetry alerts for temperature thresholds and battery backups.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: devSid,
      creator: opsUser,
      priority: 'HIGH',
      status: 'IN_REVIEW',
      dueDate: dAhead(5),
    },
    {
      taskCode: 'ST-TSK-310',
      title: 'Keycard Access Level Audit for Server & Archive Rooms',
      description: '[Milestone: O3 - Safety]\nQuarterly review of physical badge clearances for restricted zones.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(5),
    },
    {
      taskCode: 'ST-TSK-311',
      title: 'Ergonomic Health & Safety Workplace Audit',
      description: '[Milestone: O3 - Safety]\nReview desk setups and lighting to ensure occupational health standards.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'TODO',
      dueDate: dAhead(30),
    },
    {
      taskCode: 'ST-TSK-312',
      title: 'Broadband ISP Failover & Redundancy Verification',
      description: '[Milestone: O1 - Facilities]\nAutomated dual-WAN router failover testing between primary fiber and backup.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: devSid,
      creator: opsUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(8),
    },
    {
      taskCode: 'ST-TSK-313',
      title: 'Facility Lease Renewal Negotiation File',
      description: '[Milestone: O1 - Facilities]\nCompile square-foot commercial rates for Gurugram tower lease renewal.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'MEDIUM',
      status: 'BLOCKED',
      dueDate: dAhead(15),
    },
    {
      taskCode: 'ST-TSK-314',
      title: 'Staff Parking Allotment & Electric Vehicle Charging Stations',
      description: '[Milestone: O2 - Workspace]\nAssign designated parking bays and access cards for EV charging ports.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(55),
    },
    {
      taskCode: 'ST-TSK-315',
      title: 'Annual Pest Control & Deep Sanitation Scheduling',
      description: '[Milestone: O1 - Facilities]\nCoordinate quarterly office sanitation during non-business weekend hours.\nEst: 4h.',
      projectCode: 'ST-PRJ-2026-03',
      assignee: opsRahul,
      creator: opsUser,
      priority: 'LOW',
      status: 'DONE',
      dueDate: dAgo(15),
    },

    // -------------------------------------------------------------
    // Project 4: ST-PRJ-2026-04 (GST & Tax Compliance Suite) - 15 tasks (COMPLETED)
    // -------------------------------------------------------------
    {
      taskCode: 'ST-TSK-401',
      title: 'GST Rate Schedule & HSN/SAC Code Master Table',
      description: '[Milestone: T1 - Core Tax Engine]\nComprehensive database of goods and service tax slabs (5%, 12%, 18%, 28%).\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(75),
    },
    {
      taskCode: 'ST-TSK-402',
      title: 'GSTR-1 Outward Supplies JSON Export Generator',
      description: '[Milestone: T1 - Core Tax Engine]\nGenerate official GST portal compliant JSON format for sales invoices.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: devAmit,
      creator: finLead,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(65),
    },
    {
      taskCode: 'ST-TSK-403',
      title: 'GSTR-2B Input Tax Credit (ITC) Auto-Reconciliation',
      description: '[Milestone: T2 - Reconciliation]\nAutomated matching between vendor purchase registers and government 2B ledger.\nEst: 20h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(50),
    },
    {
      taskCode: 'ST-TSK-404',
      title: 'E-Way Bill Direct API Generation Module',
      description: '[Milestone: T2 - Logistics Tax]\nGenerate e-way transport bills directly for consignments exceeding 50,000 INR.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: devAmit,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(40),
    },
    {
      taskCode: 'ST-TSK-405',
      title: 'TDS (Tax Deducted at Source) Section 194C/194J Computations',
      description: '[Milestone: T3 - Statutory Direct Tax]\nWithholding tax deduction ledger and Form 16A generation engine.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finDeepak,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(35),
    },
    {
      taskCode: 'ST-TSK-406',
      title: 'Vendor GSTIN Active Status & Return Filing Verification Tool',
      description: '[Milestone: T1 - Core Tax Engine]\nReal-time public GST API verification to flag suspended or non-compliant vendors.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finDeepak,
      creator: finLead,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(30),
    },
    {
      taskCode: 'ST-TSK-407',
      title: 'Quarterly Advance Tax Payment Computation Model',
      description: '[Milestone: T3 - Statutory Direct Tax]\nProjected taxable profits calculation and installment voucher preparation.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(25),
    },
    {
      taskCode: 'ST-TSK-408',
      title: 'Statutory Financial Audit Working Papers & Trail',
      description: '[Milestone: T4 - Audit & Finalization]\nDigital evidence binders for chartered accountant audit review.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finDeepak,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(20),
    },
    {
      taskCode: 'ST-TSK-409',
      title: 'Client GST Return Filing Checklist & Automated Reminders',
      description: '[Milestone: T4 - Client Advisory]\nAutomated email & SMS alerts to consultancy clients before 20th of every month.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finDeepak,
      creator: finLead,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(18),
    },
    {
      taskCode: 'ST-TSK-410',
      title: 'Reverse Charge Mechanism (RCM) Accounting Entries',
      description: '[Milestone: T1 - Core Tax Engine]\nJournal entries for legal expenses and goods transport agency under RCM.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(15),
    },
    {
      taskCode: 'ST-TSK-411',
      title: 'Multi-Branch State GST Credit Distribution Engine',
      description: '[Milestone: T2 - Reconciliation]\nInput service distributor calculations across Delhi, Haryana, and Maharashtra branches.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(14),
    },
    {
      taskCode: 'ST-TSK-412',
      title: 'E-Invoicing IRP QR Code Generation & IRN Validation',
      description: '[Milestone: T1 - Core Tax Engine]\nGovernment Invoice Registration Portal payload creation with cryptographic QR codes.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: devAmit,
      creator: finLead,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(12),
    },
    {
      taskCode: 'ST-TSK-413',
      title: 'Annual GST Audit Form 9 & 9C Reconciliation Sheet',
      description: '[Milestone: T4 - Audit & Finalization]\nFinancial statement turnover reconciliation with filed GSTR-9 returns.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(10),
    },
    {
      taskCode: 'ST-TSK-414',
      title: 'Tax Compliance Suite UAT & Client Pilot Signoff',
      description: '[Milestone: T4 - Final Signoff]\nFormal testing signoff with 5 representative corporate advisory clients.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finDeepak,
      creator: finLead,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(10),
    },
    {
      taskCode: 'ST-TSK-415',
      title: 'Final Deployment & Production Rollout Documentation',
      description: '[Milestone: T4 - Final Signoff]\nStandard Operating Procedure (SOP) documentation for consulting accountants.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-04',
      assignee: finManish,
      creator: finLead,
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: dAgo(10),
    },

    // -------------------------------------------------------------
    // Project 5: ST-PRJ-2026-05 (ISO 27001 Security Audit) - 15 tasks
    // -------------------------------------------------------------
    {
      taskCode: 'ST-TSK-501',
      title: 'Information Asset Register & Classification Matrix',
      description: '[Milestone: S1 - Assessment]\nCatalog all databases, customer records, and credentials with security tiers.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(35),
    },
    {
      taskCode: 'ST-TSK-502',
      title: 'Static Application Security Testing (SAST) Integration',
      description: '[Milestone: S1 - Assessment]\nAutomated dependency vulnerability scanning in pull request CI pipeline.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(30),
    },
    {
      taskCode: 'ST-TSK-503',
      title: 'Database Encryption At Rest & TLS 1.3 in Transit',
      description: '[Milestone: S2 - Controls]\nAES-256 storage volume encryption and verified modern cipher suites.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: dAgo(20),
    },
    {
      taskCode: 'ST-TSK-504',
      title: 'Administrative Access Least-Privilege & Bastion Host Review',
      description: '[Milestone: S2 - Controls]\nEnforce SSH public key access through hardened bastion jump boxes.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'HIGH',
      status: 'DONE',
      dueDate: dAgo(15),
    },
    {
      taskCode: 'ST-TSK-505',
      title: 'Penetration Testing & OWASP Top 10 Remediation',
      description: '[Milestone: S2 - Controls]\nRemediate findings from external penetration testing firm on portal endpoints.\nEst: 16h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devAmit,
      creator: pmUser,
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      dueDate: dAhead(6),
    },
    {
      taskCode: 'ST-TSK-506',
      title: 'Information Security Incident Response Playbook',
      description: '[Milestone: S3 - Governance]\nDocument step-by-step containment protocol for suspected data breach.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_REVIEW',
      dueDate: dAhead(3),
    },
    {
      taskCode: 'ST-TSK-507',
      title: 'Staff Security Awareness Training & Phishing Simulation',
      description: '[Milestone: S3 - Governance]\nMandatory cyber hygiene training module for all 16 staff members.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: dAhead(8),
    },
    {
      taskCode: 'ST-TSK-508',
      title: 'Disaster Recovery RTO/RPO Drill Simulation',
      description: '[Milestone: S3 - Governance]\nSimulate database failover to secondary cloud region with under 15m RTO.\nEst: 12h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'HIGH',
      status: 'TODO',
      dueDate: dAhead(14),
    },
    {
      taskCode: 'ST-TSK-509',
      title: 'Third-Party Vendor Risk Assessment Questionnaires',
      description: '[Milestone: S1 - Assessment]\nReview security certifications for cloud hosting, email, and analytics vendors.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(16),
    },
    {
      taskCode: 'ST-TSK-510',
      title: 'Centralized SIEM Log Aggregation & Alerting Rules',
      description: '[Milestone: S2 - Controls]\nStream audit logs to central Elasticsearch cluster with brute force detection.\nEst: 14h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: dAhead(10),
    },
    {
      taskCode: 'ST-TSK-511',
      title: 'Statement of Applicability (SoA) Document Finalization',
      description: '[Milestone: S3 - Governance]\nFormal documentation of Annex A controls justification for auditor submission.\nEst: 10h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: pmUser,
      creator: pmUser,
      priority: 'HIGH',
      status: 'IN_REVIEW',
      dueDate: dAhead(5),
    },
    {
      taskCode: 'ST-TSK-512',
      title: 'Internal Audit Non-Conformity Corrective Actions',
      description: '[Milestone: S3 - Governance]\nAddress minor observations raised during preliminary internal auditor assessment.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: dAhead(12),
    },
    {
      taskCode: 'ST-TSK-513',
      title: 'Cryptographic Key Management & Secret Rotation Policy',
      description: '[Milestone: S2 - Controls]\n90-day automated rotation of JWT secrets and database connection strings.\nEst: 8h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: devSid,
      creator: pmUser,
      priority: 'MEDIUM',
      status: 'BLOCKED',
      dueDate: dAhead(20),
    },
    {
      taskCode: 'ST-TSK-514',
      title: 'Data Retention & Secure Shredding Guidelines',
      description: '[Milestone: S3 - Governance]\nDefine archiving schedules and cryptographic data destruction standards.\nEst: 6h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: qaNeha,
      creator: pmUser,
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: dAhead(25),
    },
    {
      taskCode: 'ST-TSK-515',
      title: 'Stage 2 Certification Audit External Scheduling',
      description: '[Milestone: S3 - Governance]\nConfirm dates with accredited registrar for Stage 2 on-site compliance audit.\nEst: 4h.',
      projectCode: 'ST-PRJ-2026-05',
      assignee: pmUser,
      creator: pmUser,
      priority: 'HIGH',
      status: 'TODO',
      dueDate: dAhead(15),
    },
  ]

  let seededTasksCount = 0
  const tasksByProject: { [pCode: string]: { total: number; done: number } } = {
    'ST-PRJ-2026-01': { total: 0, done: 0 },
    'ST-PRJ-2026-02': { total: 0, done: 0 },
    'ST-PRJ-2026-03': { total: 0, done: 0 },
    'ST-PRJ-2026-04': { total: 0, done: 0 },
    'ST-PRJ-2026-05': { total: 0, done: 0 },
  }

  for (const t of taskBlueprints) {
    const prj = seededProjects[t.projectCode]
    if (!prj) continue

    const taskRecord = await prisma.task.upsert({
      where: { taskCode: t.taskCode },
      update: {
        title: t.title,
        description: t.description,
        projectId: prj.id,
        assigneeId: t.assignee?.id || null,
        creatorId: t.creator?.id || null,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        isDemo: true,
      },
      create: {
        taskCode: t.taskCode,
        title: t.title,
        description: t.description,
        projectId: prj.id,
        assigneeId: t.assignee?.id || null,
        creatorId: t.creator?.id || null,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        isDemo: true,
      },
    })
    seededTasksCount++

    // Track for project progress calculation
    if (tasksByProject[t.projectCode]) {
      tasksByProject[t.projectCode].total++
      if (t.status === 'DONE') {
        tasksByProject[t.projectCode].done++
      }
    }

    // Add simulated comments & activity logs based on status
    if (t.status === 'DONE') {
      await prisma.taskComment.create({
        data: {
          taskId: taskRecord.id,
          authorId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          content: 'Completed implementation, unit tests passing, code review approved.',
        },
      })
      await prisma.taskActivity.create({
        data: {
          taskId: taskRecord.id,
          userId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          action: 'STATUS_CHANGE',
          details: 'Status transitioned from IN_REVIEW to DONE',
        },
      })
    } else if (t.status === 'BLOCKED') {
      await prisma.taskComment.create({
        data: {
          taskId: taskRecord.id,
          authorId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          content: 'Work temporarily blocked: awaiting third-party credentials and staging API keys.',
        },
      })
      await prisma.taskActivity.create({
        data: {
          taskId: taskRecord.id,
          userId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          action: 'STATUS_CHANGE',
          details: 'Flagged task as BLOCKED due to external dependency',
        },
      })
    } else if (t.status === 'IN_REVIEW') {
      await prisma.taskComment.create({
        data: {
          taskId: taskRecord.id,
          authorId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          content: 'PR submitted for peer code review. Ready for QA validation checklist.',
        },
      })
      await prisma.taskActivity.create({
        data: {
          taskId: taskRecord.id,
          userId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          action: 'STATUS_CHANGE',
          details: 'Status moved to IN_REVIEW',
        },
      })
    } else if (t.status === 'IN_PROGRESS') {
      await prisma.taskActivity.create({
        data: {
          taskId: taskRecord.id,
          userId: t.assignee ? t.assignee.id : seededUsers['admin@successtunnel.in'].id,
          action: 'STATUS_CHANGE',
          details: 'Commenced sprint implementation',
        },
      })
    }
  }

  // Calculate project progress dynamically from actual task states
  for (const [pCode, counts] of Object.entries(tasksByProject)) {
    const prj = seededProjects[pCode]
    if (prj && counts.total > 0) {
      const computedProgress = Math.round((counts.done / counts.total) * 100)
      await prisma.project.update({
        where: { id: prj.id },
        data: { progress: computedProgress },
      })
      console.log(`  Project ${pCode}: Progress calculated from verified task states: ${computedProgress}% (${counts.done}/${counts.total} Done)`)
    }
  }

  console.log(`  ✅ Successfully seeded ${seededTasksCount} tasks distributed across 5 projects.`)

  // ------------------------------------------------------------------
  // 8. Seed Corporate Expenses (Spanning 90 Days)
  // ------------------------------------------------------------------
  console.log('Step 8/11: Seeding corporate expense ledger...')
  const expenseData = [
    {
      userEmail: 'siddharth.rao@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'SOFTWARE',
      amount: 14500.0,
      description: 'Monthly cloud hosting servers & PostgreSQL database infrastructure',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Verified against AWS infrastructure invoice.',
      date: dAgo(60),
    },
    {
      userEmail: 'pooja.mehta@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'SOFTWARE',
      amount: 4200.0,
      description: 'Figma Enterprise UI design seat subscription',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved as per approved department design budget.',
      date: dAgo(45),
    },
    {
      userEmail: 'arjun.kapoor@example.com',
      projectCode: 'ST-PRJ-2026-02',
      category: 'CLIENT_ENTERTAINMENT',
      amount: 8650.0,
      description: 'Executive luncheon with prospective enterprise client steering committee in Mumbai',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Client dinner receipt submitted and verified.',
      date: dAgo(30),
    },
    {
      userEmail: 'amit.kumar@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'HARDWARE',
      amount: 18900.0,
      description: 'Dual 27-inch 4K developer monitors for remote engineering workstation',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved under remote engineering workstation policy.',
      date: dAgo(22),
    },
    {
      userEmail: 'neha.gupta@example.com',
      projectCode: 'ST-PRJ-2026-05',
      category: 'TRAINING',
      amount: 25000.0,
      description: 'ISO 27001 Lead Auditor examination fee and certification materials',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Authorized under company professional development fund.',
      date: dAgo(15),
    },
    {
      userEmail: 'vikram.singh@example.com',
      projectCode: 'ST-PRJ-2026-03',
      category: 'OFFICE_SUPPLIES',
      amount: 12400.0,
      description: 'Ergonomic keyboard wrist rests and conference room whiteboards',
      status: 'UNDER_REVIEW',
      reviewedByEmail: null,
      reviewNotes: null,
      date: dAgo(6),
    },
    {
      userEmail: 'ananya.deshmukh@example.com',
      projectCode: 'ST-PRJ-2026-02',
      category: 'TRAVEL',
      amount: 7800.0,
      description: 'Cab fares and inter-city transit for on-site corporate client presentation',
      status: 'SUBMITTED',
      reviewedByEmail: null,
      reviewNotes: null,
      date: dAgo(2),
    },
  ]

  let expenseCount = 0
  for (const exp of expenseData) {
    const user = seededUsers[exp.userEmail]
    const reviewer = exp.reviewedByEmail ? seededUsers[exp.reviewedByEmail] : null
    const prj = exp.projectCode ? seededProjects[exp.projectCode] : null
    if (!user) continue

    await prisma.expense.create({
      data: {
        userId: user.id,
        projectId: prj ? prj.id : null,
        category: exp.category,
        amount: exp.amount,
        currency: 'INR',
        expenseDate: exp.date,
        description: exp.description,
        status: exp.status,
        reviewedById: reviewer ? reviewer.id : null,
        reviewNotes: exp.reviewNotes,
        isDemo: true,
      },
    })
    expenseCount++
  }
  console.log(`  ✅ Seeded ${expenseCount} corporate expenses with approval trail.`)

  // ------------------------------------------------------------------
  // 9. Seed Customer Directory & CRM Leads Pipeline
  // ------------------------------------------------------------------
  console.log('Step 9/11: Seeding realistic fictional customer directory & deal pipeline...')
  const customersData = [
    {
      customerCode: 'ST-CUST-1001',
      name: 'TechNova Enterprise Solutions Pvt Ltd',
      company: 'TechNova Enterprise Solutions Pvt Ltd',
      email: 'procurement@example.com',
      phone: '+91 11 4567 8901',
      address: 'DLF Cyber City, Tower 10B, 8th Floor',
      city: 'Gurugram',
      website: 'https://example.com/technova',
      status: 'ACTIVE',
      notes: 'Tier-1 enterprise customer for ERP portal and custom cloud integrations.',
      isDemo: true,
    },
    {
      customerCode: 'ST-CUST-1002',
      name: 'Apex Global Logistics Ltd',
      company: 'Apex Global Logistics Ltd',
      email: 'operations@example.com',
      phone: '+91 22 2890 1234',
      address: 'Andheri East Commercial Complex, 4th Floor',
      city: 'Mumbai',
      website: 'https://example.com/apexlogistics',
      status: 'ACTIVE',
      notes: 'Supply chain client utilizing GST automation and compliance advisory.',
      isDemo: true,
    },
    {
      customerCode: 'ST-CUST-1003',
      name: 'Zenith Retail & Supermarkets LLP',
      company: 'Zenith Retail & Supermarkets LLP',
      email: 'finance@example.com',
      phone: '+91 80 3456 7890',
      address: 'Koramangala 5th Block, 100 Feet Road',
      city: 'Bengaluru',
      website: 'https://example.com/zenithretail',
      status: 'ACTIVE',
      notes: 'Retail chain client utilizing managed facility coworking and POS consulting.',
      isDemo: true,
    },
    {
      customerCode: 'ST-CUST-1004',
      name: 'Starlight Healthcare Diagnostics',
      company: 'Starlight Healthcare Diagnostics',
      email: 'partnerships@example.com',
      phone: '+91 40 4567 8912',
      address: 'HITEC City, Phase 2, Mindspace',
      city: 'Hyderabad',
      website: 'https://example.com/starlight',
      status: 'ACTIVE',
      notes: 'Medical network evaluating patient portal and ISO compliance.',
      isDemo: true,
    },
    {
      customerCode: 'ST-CUST-1005',
      name: 'BlueWave Financial Services',
      company: 'BlueWave Financial Services',
      email: 'compliance@example.com',
      phone: '+91 11 2345 6789',
      address: 'Barakhamba Road, Connaught Place',
      city: 'New Delhi',
      website: 'https://example.com/bluewave',
      status: 'LEAD',
      notes: 'Financial advisory firm in proposal stage for statutory audit automation.',
      isDemo: true,
    },
    {
      customerCode: 'ST-CUST-1006',
      name: 'Vanguard Manufacturing Corp',
      company: 'Vanguard Manufacturing Corp',
      email: 'tax@example.com',
      phone: '+91 20 6789 0123',
      address: 'Bhosari Industrial Estate, MIDC',
      city: 'Pune',
      website: 'https://example.com/vanguard',
      status: 'LEAD',
      notes: 'Automotive components manufacturer evaluating GST e-invoicing.',
      isDemo: true,
    },
  ]

  const seededCustomers: { [code: string]: any } = {}
  for (const c of customersData) {
    const cust = await prisma.customer.upsert({
      where: { customerCode: c.customerCode },
      update: c,
      create: c,
    })
    seededCustomers[c.customerCode] = cust
  }

  // Seed Leads Across Pipeline Stages
  const leadsData = [
    {
      leadCode: 'ST-LEAD-2026-001',
      title: 'Enterprise ERP Modernization & HR Integration',
      customerCode: 'ST-CUST-1001',
      contactName: 'Vikramaditya Sen',
      contactEmail: 'vikram.sen@example.com',
      contactPhone: '+91 98111 55667',
      company: 'TechNova Enterprise Solutions Pvt Ltd',
      source: 'DIRECT',
      status: 'WON',
      priority: 'HIGH',
      estimatedValue: 480000.0,
      assignedEmail: 'arjun.kapoor@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-002',
      title: 'GST Return Automation & ITC Reconciliation',
      customerCode: 'ST-CUST-1002',
      contactName: 'Meenakshi Sundaram',
      contactEmail: 'meenakshi.s@example.com',
      contactPhone: '+91 98222 66778',
      company: 'Apex Global Logistics Ltd',
      source: 'REFERRAL',
      status: 'WON',
      priority: 'HIGH',
      estimatedValue: 340000.0,
      assignedEmail: 'arjun.kapoor@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-003',
      title: 'Multi-Location Managed Coworking Workstations',
      customerCode: 'ST-CUST-1003',
      contactName: 'Harish Varma',
      contactEmail: 'harish.varma@example.com',
      contactPhone: '+91 98333 77889',
      company: 'Zenith Retail & Supermarkets LLP',
      source: 'WEBSITE_ENQUIRY',
      status: 'WON',
      priority: 'MEDIUM',
      estimatedValue: 240000.0,
      assignedEmail: 'ananya.deshmukh@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-004',
      title: 'Healthcare Diagnostic Data Compliance & ISO 27001 Prep',
      customerCode: 'ST-CUST-1004',
      contactName: 'Dr. Sunita Reddy',
      contactEmail: 'sunita.reddy@example.com',
      contactPhone: '+91 98444 88990',
      company: 'Starlight Healthcare Diagnostics',
      source: 'WEBSITE_ENQUIRY',
      status: 'PROPOSAL_SENT',
      priority: 'HIGH',
      estimatedValue: 310000.0,
      assignedEmail: 'arjun.kapoor@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-005',
      title: 'Statutory Financial Audit Automation Suite',
      customerCode: 'ST-CUST-1005',
      contactName: 'Aditya Birla',
      contactEmail: 'aditya.birla@example.com',
      contactPhone: '+91 98555 11223',
      company: 'BlueWave Financial Services',
      source: 'REFERRAL',
      status: 'QUALIFIED',
      priority: 'HIGH',
      estimatedValue: 280000.0,
      assignedEmail: 'ananya.deshmukh@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-006',
      title: 'Automotive Factory E-Invoicing & Supply Chain Tax',
      customerCode: 'ST-CUST-1006',
      contactName: 'Naveen Deshpande',
      contactEmail: 'naveen.d@example.com',
      contactPhone: '+91 98666 22334',
      company: 'Vanguard Manufacturing Corp',
      source: 'COLD_OUTREACH',
      status: 'CONTACTED',
      priority: 'MEDIUM',
      estimatedValue: 195000.0,
      assignedEmail: 'ananya.deshmukh@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-007',
      title: 'Cloud Infrastructure Security Hardening Assessment',
      customerCode: null,
      contactName: 'Rohan Mehra',
      contactEmail: 'rohan.mehra@example.com',
      contactPhone: '+91 98777 33445',
      company: 'Krypton Cyberworks',
      source: 'WEBSITE_ENQUIRY',
      status: 'NEW',
      priority: 'HIGH',
      estimatedValue: 150000.0,
      assignedEmail: 'arjun.kapoor@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-008',
      title: 'Trademark Registration & Brand Identity Protection',
      customerCode: null,
      contactName: 'Shalini Nambiar',
      contactEmail: 'shalini.n@example.com',
      contactPhone: '+91 98888 44556',
      company: 'Urban Bloom Organics',
      source: 'WEBSITE_ENQUIRY',
      status: 'NEW',
      priority: 'LOW',
      estimatedValue: 45000.0,
      assignedEmail: 'ananya.deshmukh@example.com',
    },
    {
      leadCode: 'ST-LEAD-2026-009',
      title: 'MSME Business Incorporation & Compliance Pack',
      customerCode: null,
      contactName: 'Gaurav Singhal',
      contactEmail: 'gaurav.s@example.com',
      contactPhone: '+91 98999 55667',
      company: 'Singhal Robotics & Automation',
      source: 'WEBSITE_ENQUIRY',
      status: 'LOST',
      priority: 'LOW',
      estimatedValue: 35000.0,
      assignedEmail: 'ananya.deshmukh@example.com',
    },
  ]

  for (const ld of leadsData) {
    const cust = ld.customerCode ? seededCustomers[ld.customerCode] : null
    const assignedUser = ld.assignedEmail ? seededUsers[ld.assignedEmail] : null

    const leadRecord = await prisma.lead.upsert({
      where: { leadCode: ld.leadCode },
      update: {
        title: ld.title,
        customerId: cust ? cust.id : null,
        contactName: ld.contactName,
        contactEmail: ld.contactEmail,
        contactPhone: ld.contactPhone,
        company: ld.company,
        source: ld.source,
        status: ld.status,
        priority: ld.priority,
        estimatedValue: ld.estimatedValue,
        currency: 'INR',
        assignedToId: assignedUser ? assignedUser.id : null,
        isDemo: true,
      },
      create: {
        leadCode: ld.leadCode,
        title: ld.title,
        customerId: cust ? cust.id : null,
        contactName: ld.contactName,
        contactEmail: ld.contactEmail,
        contactPhone: ld.contactPhone,
        company: ld.company,
        source: ld.source,
        status: ld.status,
        priority: ld.priority,
        estimatedValue: ld.estimatedValue,
        currency: 'INR',
        assignedToId: assignedUser ? assignedUser.id : null,
        isDemo: true,
      },
    })

    // Seed realistic touchpoint activity
    if (ld.status === 'WON') {
      await prisma.leadActivity.create({
        data: {
          leadId: leadRecord.id,
          userId: assignedUser?.id,
          type: 'STATUS_CHANGE',
          summary: 'Enterprise contract signed and deal won',
          details: 'Master Services Agreement executed and handed over to engineering team.',
        },
      })
    } else if (ld.status === 'PROPOSAL_SENT') {
      await prisma.leadActivity.create({
        data: {
          leadId: leadRecord.id,
          userId: assignedUser?.id,
          type: 'PROPOSAL',
          summary: 'Detailed technical proposal v1.4 dispatched',
          details: 'Includes SLA terms, milestone timelines, and security compliance matrix.',
        },
      })
    } else if (ld.status === 'LOST') {
      await prisma.leadActivity.create({
        data: {
          leadId: leadRecord.id,
          userId: assignedUser?.id,
          type: 'STATUS_CHANGE',
          summary: 'Lead marked as Lost - budget deferral',
          details: 'Prospect decided to postpone MSME incorporation to next fiscal quarter.',
        },
      })
    } else {
      await prisma.leadActivity.create({
        data: {
          leadId: leadRecord.id,
          userId: assignedUser?.id,
          type: 'NOTE',
          summary: `Lead progress updated: stage is currently ${ld.status}`,
        },
      })
    }
  }

  // ------------------------------------------------------------------
  // 10. Seed Invoices & Verified Payments (Strict Cash Flow Invariant)
  // ------------------------------------------------------------------
  console.log('Step 10/11: Seeding accounts receivable invoices & verified payments ledger...')
  const techNovaCust = seededCustomers['ST-CUST-1001']
  const apexCust = seededCustomers['ST-CUST-1002']
  const zenithCust = seededCustomers['ST-CUST-1003']

  const prj01 = seededProjects['ST-PRJ-2026-01']
  const prj02 = seededProjects['ST-PRJ-2026-02']

  // 1. TechNova Milestone 1 Invoice (PAID IN FULL)
  const inv1 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'ST-INV-2026-0001' },
    update: {},
    create: {
      invoiceNumber: 'ST-INV-2026-0001',
      customerId: techNovaCust?.id,
      projectId: prj01?.id,
      issueDate: dAgo(65),
      dueDate: dAgo(35),
      subtotal: 150000.0,
      taxRate: 18.0,
      taxAmount: 27000.0,
      totalAmount: 177000.0,
      currency: 'INR',
      status: 'PAID',
      items: JSON.stringify([
        { description: 'ERP Phase 1 Architecture & Database Blueprint', quantity: 1, unitPrice: 150000.0, amount: 150000.0 },
      ]),
      notes: 'Initial milestone delivery approved by client steering committee.',
      isDemo: true,
    },
  })

  await prisma.payment.upsert({
    where: { paymentNumber: 'ST-PAY-2026-0001' },
    update: {},
    create: {
      paymentNumber: 'ST-PAY-2026-0001',
      invoiceId: inv1.id,
      customerId: techNovaCust?.id,
      projectId: prj01?.id,
      amount: 177000.0,
      currency: 'INR',
      paymentDate: dAgo(52),
      paymentMethod: 'BANK_TRANSFER',
      transactionReference: 'SBIN8260192837',
      status: 'COMPLETED',
      notes: 'NEFT wire transfer cleared in commercial account.',
      isDemo: true,
    },
  })

  // 2. Apex Global GST Suite License (PAID IN FULL)
  const inv2 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'ST-INV-2026-0002' },
    update: {},
    create: {
      invoiceNumber: 'ST-INV-2026-0002',
      customerId: apexCust?.id,
      projectId: prj02?.id,
      issueDate: dAgo(45),
      dueDate: dAgo(15),
      subtotal: 100000.0,
      taxRate: 18.0,
      taxAmount: 18000.0,
      totalAmount: 118000.0,
      currency: 'INR',
      status: 'PAID',
      items: JSON.stringify([
        { description: 'GST Automation & ITC Reconciliation Module Deployment', quantity: 1, unitPrice: 100000.0, amount: 100000.0 },
      ]),
      notes: 'Quarterly compliance engine setup fee.',
      isDemo: true,
    },
  })

  await prisma.payment.upsert({
    where: { paymentNumber: 'ST-PAY-2026-0002' },
    update: {},
    create: {
      paymentNumber: 'ST-PAY-2026-0002',
      invoiceId: inv2.id,
      customerId: apexCust?.id,
      projectId: prj02?.id,
      amount: 118000.0,
      currency: 'INR',
      paymentDate: dAgo(28),
      paymentMethod: 'BANK_TRANSFER',
      transactionReference: 'HDFC9220019283',
      status: 'COMPLETED',
      notes: 'RTGS payment received.',
      isDemo: true,
    },
  })

  // 3. TechNova Phase 2 Milestone (PARTIALLY PAID: ₹1,00,000 received out of ₹2,36,000)
  const inv3 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'ST-INV-2026-0003' },
    update: {},
    create: {
      invoiceNumber: 'ST-INV-2026-0003',
      customerId: techNovaCust?.id,
      projectId: prj01?.id,
      issueDate: dAgo(20),
      dueDate: dAhead(10),
      subtotal: 200000.0,
      taxRate: 18.0,
      taxAmount: 36000.0,
      totalAmount: 236000.0,
      currency: 'INR',
      status: 'PARTIALLY_PAID',
      items: JSON.stringify([
        { description: 'ERP Phase 2 HR & Workforce Core Implementation', quantity: 1, unitPrice: 200000.0, amount: 200000.0 },
      ]),
      notes: 'Tranche advance received, remaining balance payable upon UAT signoff.',
      isDemo: true,
    },
  })

  await prisma.payment.upsert({
    where: { paymentNumber: 'ST-PAY-2026-0003' },
    update: {},
    create: {
      paymentNumber: 'ST-PAY-2026-0003',
      invoiceId: inv3.id,
      customerId: techNovaCust?.id,
      projectId: prj01?.id,
      amount: 100000.0,
      currency: 'INR',
      paymentDate: dAgo(12),
      paymentMethod: 'BANK_TRANSFER',
      transactionReference: 'SBIN1018273645',
      status: 'COMPLETED',
      notes: 'First milestone tranche credited.',
      isDemo: true,
    },
  })

  // 4. Zenith Retail Facility Lease (ISSUED - UNPAID: Accounts Receivable ₹70,800, Revenue = 0)
  await prisma.invoice.upsert({
    where: { invoiceNumber: 'ST-INV-2026-0004' },
    update: {},
    create: {
      invoiceNumber: 'ST-INV-2026-0004',
      customerId: zenithCust?.id,
      issueDate: dAgo(10),
      dueDate: dAhead(20),
      subtotal: 60000.0,
      taxRate: 18.0,
      taxAmount: 10800.0,
      totalAmount: 70800.0,
      currency: 'INR',
      status: 'ISSUED',
      items: JSON.stringify([
        { description: 'Dedicated Managed Coworking Hub Workstations', quantity: 1, unitPrice: 60000.0, amount: 60000.0 },
      ]),
      notes: 'Monthly recurring cycle invoice. Awaiting wire transfer.',
      isDemo: true,
    },
  })

  // ------------------------------------------------------------------
  // 11. Website Public Content Preservation (CMS Models)
  // ------------------------------------------------------------------
  console.log('Step 11/11: Preserving public website content (CMS services, blogs, education)...')

  for (const s of sampleServices) {
    const serviceRecord = await prisma.service.upsert({
      where: { slug: s.slug },
      update: { title: s.title, excerpt: s.excerpt, icon: s.icon },
      create: { title: s.title, slug: s.slug, excerpt: s.excerpt, icon: s.icon },
    })

    if (s.slug === 'consultancy') {
      for (const sub of consultancySubservices) {
        await prisma.subservice.upsert({
          where: { slug: sub.slug },
          update: { title: sub.title, content: sub.content, serviceId: serviceRecord.id },
          create: { title: sub.title, slug: sub.slug, content: sub.content, serviceId: serviceRecord.id },
        })
      }
    }
  }

  for (const p of samplePosts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { title: p.title, excerpt: p.excerpt, content: p.content, featuredImage: (p as any).featuredImage || null },
      create: { title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, featuredImage: (p as any).featuredImage || null },
    })
  }

  for (const prop of sampleProperties) {
    const imagesVal = (prop as any).images ? JSON.stringify((prop as any).images) : null
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {
        title: prop.title,
        type: prop.type,
        city: prop.city,
        price: prop.price,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        images: imagesVal,
      },
      create: {
        title: prop.title,
        slug: prop.slug,
        type: prop.type,
        city: prop.city,
        price: prop.price,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        images: imagesVal,
      },
    })
  }

  for (const ed of EDUCATION_FALLBACK_CONTENT) {
    await prisma.educationContent.upsert({
      where: { slug: ed.slug },
      update: {
        title: ed.title,
        contentType: ed.contentType,
        category: ed.category,
        excerpt: ed.excerpt,
        body: ed.body,
        isPublished: true,
      },
      create: {
        title: ed.title,
        slug: ed.slug,
        contentType: ed.contentType,
        category: ed.category,
        excerpt: ed.excerpt,
        body: ed.body,
        isPublished: true,
      },
    })
  }

  console.log('\n======================================================================')
  console.log('✅ REALISTIC DEMO DATA COMPLETE: All modules populated and internally consistent.')
  console.log('======================================================================\n')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
