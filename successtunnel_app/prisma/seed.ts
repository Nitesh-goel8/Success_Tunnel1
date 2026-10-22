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
  console.log('🚀 SEEDING SUCCESS TUNNEL ERP - 3 MONTHS REALISTIC DEMO DATA')
  console.log('   Timeframe: August 2026, September 2026, October 2026')
  console.log('======================================================================\n')

  const defaultPassword = await bcrypt.hash('Demo@2026!', 10)
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Demo@2026!', 10)

  // ------------------------------------------------------------------
  // 1. Seed Core Departments
  // ------------------------------------------------------------------
  console.log('Step 1/8: Seeding functional departments...')
  const departmentsData = [
    { code: 'ENG', name: 'Engineering & Technology', description: 'Software architecture, cloud infrastructure, and product engineering.' },
    { code: 'HR', name: 'Human Resources & People', description: 'Talent acquisition, employee welfare, performance, and organizational culture.' },
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

  // ------------------------------------------------------------------
  // 2. Seed 14 Realistic Demo Users & Employee Profiles
  // ------------------------------------------------------------------
  console.log('Step 2/8: Seeding comprehensive staff personnel across 5 roles...')
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
      designation: 'Principal Project Manager',
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
    // Finance & Accounts
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
    // Operations & Facilities
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
    // Client Advisory & Consulting
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
      joiningDate: new Date('2024-10-01'),
    },
    {
      name: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      password: defaultPassword,
      role: 'project_manager',
      departmentCode: 'CNS',
      phone: '+91 98666 11223',
      employeeCode: 'ST-CNS-602',
      designation: 'Senior Business Strategy Consultant',
      workLocation: 'Branch Office - Mumbai',
      employmentType: 'Full-time',
      status: 'ACTIVE',
      joiningDate: new Date('2024-05-20'),
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

    await prisma.employeeProfile.upsert({
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
  }

  // Assign department heads
  if (departments['HR'] && seededUsers['priya.sharma@example.com']) {
    await prisma.department.update({ where: { id: departments['HR'].id }, data: { headId: seededUsers['priya.sharma@example.com'].id } })
  }
  if (departments['FIN'] && seededUsers['sneha.patel@example.com']) {
    await prisma.department.update({ where: { id: departments['FIN'].id }, data: { headId: seededUsers['sneha.patel@example.com'].id } })
  }
  if (departments['ENG'] && seededUsers['rohit.verma@example.com']) {
    await prisma.department.update({ where: { id: departments['ENG'].id }, data: { headId: seededUsers['rohit.verma@example.com'].id } })
  }
  if (departments['CNS'] && seededUsers['arjun.kapoor@example.com']) {
    await prisma.department.update({ where: { id: departments['CNS'].id }, data: { headId: seededUsers['arjun.kapoor@example.com'].id } })
  }
  if (departments['OPS'] && seededUsers['vikram.singh@example.com']) {
    await prisma.department.update({ where: { id: departments['OPS'].id }, data: { headId: seededUsers['vikram.singh@example.com'].id } })
  }

  // ------------------------------------------------------------------
  // 3. Seed Leave Policies
  // ------------------------------------------------------------------
  console.log('Step 3/8: Seeding corporate leave entitlement policies...')
  const leavePolicies = [
    { leaveType: 'ANNUAL', title: 'Annual Paid Leave', totalDaysPerYear: 18, carryForwardMax: 5, description: 'Standard paid annual leave for rest, vacation, and family time.' },
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
  // 4. Seed 3-Month Historical Attendance Records (Aug 1 - Oct 23, 2026)
  // ------------------------------------------------------------------
  console.log('Step 4/8: Generating 3 months of daily weekday attendance records (August, September, October 2026)...')

  // Generate date list between Aug 1, 2026 and Oct 23, 2026
  const attendanceEmployees = [
    seededUsers['amit.kumar@example.com'],
    seededUsers['pooja.mehta@example.com'],
    seededUsers['siddharth.rao@example.com'],
    seededUsers['neha.gupta@example.com'],
    seededUsers['rohit.verma@example.com'],
    seededUsers['sneha.patel@example.com'],
    seededUsers['manish.joshi@example.com'],
    seededUsers['deepak.chawla@example.com'],
    seededUsers['priya.sharma@example.com'],
    seededUsers['kavita.nair@example.com'],
    seededUsers['vikram.singh@example.com'],
    seededUsers['ananya.deshmukh@example.com'],
    seededUsers['arjun.kapoor@example.com'],
  ].filter(Boolean)

  const startDate = new Date('2026-08-01')
  const endDate = new Date('2026-10-23')
  const workDates: string[] = []

  const cur = new Date(startDate)
  while (cur <= endDate) {
    const dayOfWeek = cur.getDay() // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workDates.push(cur.toISOString().split('T')[0])
    }
    cur.setDate(cur.getDate() + 1)
  }

  console.log(`  Identified ${workDates.length} business workdays across 3 months. Populating logs for ${attendanceEmployees.length} staff members...`)

  let attendanceCount = 0
  for (const dateStr of workDates) {
    for (let i = 0; i < attendanceEmployees.length; i++) {
      const emp = attendanceEmployees[i]
      // Use deterministic pseudo-random variation based on emp.id and date
      const hash = (emp.id * 31 + parseInt(dateStr.replace(/-/g, ''))) % 100

      let status = 'PRESENT'
      let inHour = 9
      let inMin = 10 + (hash % 20) // 9:10 to 9:30
      let durationMinutes = 480 + (hash % 50) // 8h to 8h 50m

      if (hash > 90) {
        // Late arrival
        status = 'LATE'
        inHour = 9
        inMin = 45 + (hash % 15)
        durationMinutes = 450
      } else if (hash > 85 && hash <= 90) {
        // Half day
        status = 'HALF_DAY'
        durationMinutes = 240
      }

      const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
      const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

      await prisma.attendanceRecord.upsert({
        where: { userId_date: { userId: emp.id, date: dateStr } },
        update: {
          checkIn,
          checkOut,
          durationMinutes,
          status,
          isDemo: true,
        },
        create: {
          userId: emp.id,
          date: dateStr,
          checkIn,
          checkOut,
          durationMinutes,
          status,
          isDemo: true,
        },
      })
      attendanceCount++
    }
  }
  console.log(`  ✅ Successfully seeded ${attendanceCount} attendance records across 3 months.`)

  // ------------------------------------------------------------------
  // 5. Seed 3-Month Leave Requests (Approved, Rejected & Pending)
  // ------------------------------------------------------------------
  console.log('Step 5/8: Seeding historical & active leave applications across 3 months...')
  const leaveData = [
    // August 2026
    {
      userEmail: 'amit.kumar@example.com',
      leaveType: 'ANNUAL',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-12'),
      totalDays: 3,
      reason: 'Annual family festival & travel back to hometown',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Sprint deliverables delegated to Siddharth.',
      reviewedAt: new Date('2026-08-08'),
    },
    {
      userEmail: 'sneha.patel@example.com',
      leaveType: 'CASUAL',
      startDate: new Date('2026-08-18'),
      endDate: new Date('2026-08-19'),
      totalDays: 2,
      reason: 'Personal legal registration & family commitment',
      status: 'APPROVED',
      reviewedByEmail: 'admin@successtunnel.in',
      reviewReason: 'Approved. Tax filing schedule remains on track.',
      reviewedAt: new Date('2026-08-17'),
    },
    {
      userEmail: 'vikram.singh@example.com',
      leaveType: 'SICK',
      startDate: new Date('2026-08-25'),
      endDate: new Date('2026-08-25'),
      totalDays: 1,
      reason: 'Medical recovery following dental surgery',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Rest well.',
      reviewedAt: new Date('2026-08-25'),
    },
    // September 2026
    {
      userEmail: 'rohit.verma@example.com',
      leaveType: 'ANNUAL',
      startDate: new Date('2026-09-07'),
      endDate: new Date('2026-09-10'),
      totalDays: 4,
      reason: 'Annual paid leave for personal rest and trekking vacation',
      status: 'APPROVED',
      reviewedByEmail: 'admin@successtunnel.in',
      reviewReason: 'Approved. Milestone commitments handed over.',
      reviewedAt: new Date('2026-09-03'),
    },
    {
      userEmail: 'ananya.deshmukh@example.com',
      leaveType: 'CASUAL',
      startDate: new Date('2026-09-15'),
      endDate: new Date('2026-09-16'),
      totalDays: 2,
      reason: 'Urgent family relocation and tenancy paperwork',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved.',
      reviewedAt: new Date('2026-09-14'),
    },
    {
      userEmail: 'amit.kumar@example.com',
      leaveType: 'ANNUAL',
      startDate: new Date('2026-09-21'),
      endDate: new Date('2026-09-25'),
      totalDays: 5,
      reason: 'Weeklong trip with college alumni group',
      status: 'REJECTED',
      reviewedByEmail: 'rohit.verma@example.com',
      reviewReason: 'Critical Q3 end-of-quarter release scheduled that week. Please reschedule to October.',
      reviewedAt: new Date('2026-09-15'),
    },
    {
      userEmail: 'pooja.mehta@example.com',
      leaveType: 'SICK',
      startDate: new Date('2026-09-28'),
      endDate: new Date('2026-09-29'),
      totalDays: 2,
      reason: 'Viral fever and prescribed medical rest',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Medical certificate noted on file.',
      reviewedAt: new Date('2026-09-28'),
    },
    // October 2026
    {
      userEmail: 'siddharth.rao@example.com',
      leaveType: 'CASUAL',
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-06'),
      totalDays: 2,
      reason: 'Family wedding celebrations in Hyderabad',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved. Cloud monitoring alerts routed to secondary on-call.',
      reviewedAt: new Date('2026-10-02'),
    },
    {
      userEmail: 'kavita.nair@example.com',
      leaveType: 'ANNUAL',
      startDate: new Date('2026-10-12'),
      endDate: new Date('2026-10-14'),
      totalDays: 3,
      reason: 'Personal leisure & travel',
      status: 'APPROVED',
      reviewedByEmail: 'priya.sharma@example.com',
      reviewReason: 'Approved.',
      reviewedAt: new Date('2026-10-09'),
    },
    {
      userEmail: 'deepak.chawla@example.com',
      leaveType: 'SICK',
      startDate: new Date('2026-10-22'),
      endDate: new Date('2026-10-23'),
      totalDays: 2,
      reason: 'Severe migraine & eye strain doctor appointment',
      status: 'PENDING',
      reviewedByEmail: null,
      reviewReason: null,
      reviewedAt: null,
    },
    {
      userEmail: 'amit.kumar@example.com',
      leaveType: 'ANNUAL',
      startDate: new Date('2026-10-26'),
      endDate: new Date('2026-10-28'),
      totalDays: 3,
      reason: 'Diwali preparation and traveling home to family',
      status: 'PENDING',
      reviewedByEmail: null,
      reviewReason: null,
      reviewedAt: null,
    },
  ]

  for (const l of leaveData) {
    const user = seededUsers[l.userEmail]
    const reviewer = l.reviewedByEmail ? seededUsers[l.reviewedByEmail] : null
    if (!user) continue

    const existing = await prisma.leaveRequest.findFirst({
      where: { userId: user.id, startDate: l.startDate },
    })

    if (!existing) {
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
    }
  }

  // ------------------------------------------------------------------
  // 6. Seed Projects & 25+ Tasks across Kanban Stages
  // ------------------------------------------------------------------
  console.log('Step 6/8: Seeding 5 enterprise projects & 25+ Kanban work tasks across stages...')
  const pmUser = seededUsers['rohit.verma@example.com']
  const cnsLead = seededUsers['arjun.kapoor@example.com']
  const opsUser = seededUsers['vikram.singh@example.com']
  const devAmit = seededUsers['amit.kumar@example.com']
  const devPooja = seededUsers['pooja.mehta@example.com']
  const devSid = seededUsers['siddharth.rao@example.com']
  const qaNeha = seededUsers['neha.gupta@example.com']
  const finDeepak = seededUsers['deepak.chawla@example.com']

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
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-11-30'),
      budget: 480000.0,
      progress: 68,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-02',
      name: 'GST & Compliance Automation Suite',
      description: 'Automated tax report generator and filing checklist for MSME and corporate consultancy clients.',
      businessObjective: 'Accelerate client turnaround time by 40% for quarterly tax filings.',
      departmentId: departments['CNS']?.id,
      managerId: cnsLead?.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-12-15'),
      budget: 340000.0,
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
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-31'),
      budget: 750000.0,
      progress: 15,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-04',
      name: 'Q3 Financial Audit & Corporate Balance Sheet',
      description: 'Comprehensive quarterly statutory audit, balance sheet finalization, and tax provision reconciliation.',
      businessObjective: 'Deliver audited financial statements on time for regulatory compliance.',
      departmentId: departments['FIN']?.id,
      managerId: seededUsers['sneha.patel@example.com']?.id,
      status: 'COMPLETED',
      priority: 'HIGH',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-09-30'),
      budget: 220000.0,
      progress: 100,
      isDemo: true,
    },
    {
      projectCode: 'ST-PRJ-2026-05',
      name: 'ISO 27001 Security & Data Compliance Audit',
      description: 'Institutional cybersecurity risk assessment, access controls review, and data encryption verification.',
      businessObjective: 'Achieve enterprise information security standards for corporate client onboarding.',
      departmentId: departments['ENG']?.id,
      managerId: pmUser?.id,
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2026-08-20'),
      endDate: new Date('2026-10-31'),
      budget: 310000.0,
      progress: 80,
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

    // Add members
    if (prj.managerId) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: record.id, userId: prj.managerId } },
        update: { role: 'Lead' },
        create: { projectId: record.id, userId: prj.managerId, role: 'Lead' },
      })
    }
  }

  // Seed Rich Task Pool across 3 Months
  const tasksPool = [
    // ERP Portal Tasks
    {
      taskCode: 'ST-TSK-101',
      title: 'Design Normalized Database Schema & Migrations',
      description: 'Complete schema for Users, EmployeeProfiles, Projects, Tasks, Attendance, and Leaves.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'amit.kumar@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: new Date('2026-08-15'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-102',
      title: 'Implement Dark Navy Sidebar & Corporate Shell',
      description: 'Responsive collapsible left sidebar with breadcrumbs, role-based navigation, and profile menu.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'pooja.mehta@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-08-25'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-103',
      title: 'Build Interactive Kanban Board for Project Tasks',
      description: 'Drag-and-drop or status-click task board with priority badges and assignee filtering.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'amit.kumar@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-09-10'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-104',
      title: 'Employee Attendance Check-in Engine',
      description: 'Daily check-in and checkout button with working duration calculator and duplicate protection.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'amit.kumar@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: new Date('2026-09-20'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-105',
      title: 'Automated Leave Approval and Entitlement Tracking',
      description: 'Validation against employee leave balance and team calendar conflict check.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'amit.kumar@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'IN_REVIEW',
      dueDate: new Date('2026-10-18'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-106',
      title: 'HR Document Upload Validation & Access Controls',
      description: 'Confidentiality guards and secure storage path resolution for policies and agreements.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'pooja.mehta@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date('2026-10-28'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-107',
      title: 'Executive Reports CSV Export Engine',
      description: 'Streaming CSV export for workforce directory and project task pipelines.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'amit.kumar@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date('2026-10-30'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-108',
      title: 'Automated Verification Test Suite Execution',
      description: '20+ automated assertions verifying authentication, RBAC, and model state transitions.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'neha.gupta@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-10-22'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-109',
      title: 'Cloud Production Deploy on Vercel with Managed Postgres',
      description: 'Configure production environment variables and verify deployment smoke tests.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'siddharth.rao@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'CRITICAL',
      status: 'TODO',
      dueDate: new Date('2026-11-05'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-110',
      title: 'Multi-Factor Authentication (MFA) Strategy Review',
      description: 'Evaluate TOTP integration for administrative roles in next security sprint.',
      projectCode: 'ST-PRJ-2026-01',
      assigneeEmail: 'siddharth.rao@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: new Date('2026-11-20'),
      isDemo: true,
    },

    // GST & Compliance Automation Suite Tasks
    {
      taskCode: 'ST-TSK-201',
      title: 'GSTR-1 & GSTR-3B Excel Mapping Parser',
      description: 'Ingest B2B invoice spreadsheets and validate HSN codes against master dataset.',
      projectCode: 'ST-PRJ-2026-02',
      assigneeEmail: 'ananya.deshmukh@example.com',
      creatorEmail: 'arjun.kapoor@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-09-15'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-202',
      title: 'Automated ITC Reconciliation Rule Engine',
      description: 'Cross-reference GSTR-2B eligible input tax credit with client purchase registers.',
      projectCode: 'ST-PRJ-2026-02',
      assigneeEmail: 'ananya.deshmukh@example.com',
      creatorEmail: 'arjun.kapoor@example.com',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      dueDate: new Date('2026-10-27'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-203',
      title: 'Client Tax Filing Notification SMS/Email Bot',
      description: 'Automated due date alerts for quarterly tax filing clients.',
      projectCode: 'ST-PRJ-2026-02',
      assigneeEmail: 'pooja.mehta@example.com',
      creatorEmail: 'arjun.kapoor@example.com',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date('2026-11-10'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-204',
      title: 'Corporate Advisory Client Onboarding Workflow',
      description: 'Digital KYC and MSME certificate verification forms.',
      projectCode: 'ST-PRJ-2026-02',
      assigneeEmail: 'ananya.deshmukh@example.com',
      creatorEmail: 'arjun.kapoor@example.com',
      priority: 'LOW',
      status: 'BACKLOG',
      dueDate: new Date('2026-11-25'),
      isDemo: true,
    },

    // Q3 Financial Audit (Completed)
    {
      taskCode: 'ST-TSK-401',
      title: 'Accounts Payable & Vendor Ledger Verification',
      description: 'Audit supplier invoices, TDS deductions, and outstanding payable ledgers.',
      projectCode: 'ST-PRJ-2026-04',
      assigneeEmail: 'manish.joshi@example.com',
      creatorEmail: 'sneha.patel@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-08-25'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-402',
      title: 'Bank Reconciliation Statements (BRS)',
      description: 'Reconcile 6 commercial banking accounts against ERP cash book entries.',
      projectCode: 'ST-PRJ-2026-04',
      assigneeEmail: 'deepak.chawla@example.com',
      creatorEmail: 'sneha.patel@example.com',
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: new Date('2026-09-10'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-403',
      title: 'Statutory Tax Provisioning & Advance Tax Calculations',
      description: 'Calculate Q2/Q3 corporate income tax obligations and deposit advance tax challan.',
      projectCode: 'ST-PRJ-2026-04',
      assigneeEmail: 'sneha.patel@example.com',
      creatorEmail: 'sneha.patel@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-09-14'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-404',
      title: 'Final Audit Report Presentation to Board',
      description: 'Present signed balance sheet and income statement to executive management.',
      projectCode: 'ST-PRJ-2026-04',
      assigneeEmail: 'sneha.patel@example.com',
      creatorEmail: 'sneha.patel@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-09-28'),
      isDemo: true,
    },

    // ISO 27001 Security Audit
    {
      taskCode: 'ST-TSK-501',
      title: 'Infrastructure IAM & SSH Key Rotation',
      description: 'Audit cloud service account privileges, enforce least privilege, and rotate SSH credentials.',
      projectCode: 'ST-PRJ-2026-05',
      assigneeEmail: 'siddharth.rao@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date('2026-09-05'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-502',
      title: 'Internal Penetration Testing & Vulnerability Assessment',
      description: 'Execute automated dependency scan and penetration test on API endpoints.',
      projectCode: 'ST-PRJ-2026-05',
      assigneeEmail: 'neha.gupta@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'CRITICAL',
      status: 'DONE',
      dueDate: new Date('2026-09-25'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-503',
      title: 'Employee Security Awareness & Phishing Simulation',
      description: 'Conduct mandatory cybersecurity training for all staff members.',
      projectCode: 'ST-PRJ-2026-05',
      assigneeEmail: 'kavita.nair@example.com',
      creatorEmail: 'priya.sharma@example.com',
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      dueDate: new Date('2026-10-15'),
      isDemo: true,
    },
    {
      taskCode: 'ST-TSK-504',
      title: 'External Third-Party Certification Audit',
      description: 'Final walkthrough with ISO accredited external compliance auditors.',
      projectCode: 'ST-PRJ-2026-05',
      assigneeEmail: 'siddharth.rao@example.com',
      creatorEmail: 'rohit.verma@example.com',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date('2026-10-31'),
      isDemo: true,
    },
  ]

  for (const t of tasksPool) {
    const prj = seededProjects[t.projectCode]
    const assignee = seededUsers[t.assigneeEmail]
    const creator = seededUsers[t.creatorEmail]
    if (!prj) continue

    const taskRecord = await prisma.task.upsert({
      where: { taskCode: t.taskCode },
      update: {
        title: t.title,
        description: t.description,
        projectId: prj.id,
        assigneeId: assignee ? assignee.id : null,
        creatorId: creator ? creator.id : null,
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
        assigneeId: assignee ? assignee.id : null,
        creatorId: creator ? creator.id : null,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        isDemo: true,
      },
    })

    // Seed sample comments on tasks
    if (t.taskCode === 'ST-TSK-105') {
      const existingC = await prisma.taskComment.findFirst({ where: { taskId: taskRecord.id } })
      if (!existingC && assignee && creator) {
        await prisma.taskComment.create({
          data: {
            taskId: taskRecord.id,
            authorId: assignee.id,
            content: 'Implemented leave balance deduction and business day calculation logic. Ready for review.',
            createdAt: new Date('2026-10-17T11:30:00Z'),
          },
        })
        await prisma.taskComment.create({
          data: {
            taskId: taskRecord.id,
            authorId: creator.id,
            content: 'Looks thorough! Testing edge cases with national holiday calendars before marking Done.',
            createdAt: new Date('2026-10-18T09:15:00Z'),
          },
        })
      }
    }
  }

  // ------------------------------------------------------------------
  // 7. Seed 3-Month Financial Expense Claims (Aug, Sept, Oct 2026)
  // ------------------------------------------------------------------
  console.log('Step 7/8: Seeding corporate expense ledger spanning 3 months...')
  const expenseData = [
    // August 2026 Claims (Reimbursed)
    {
      userEmail: 'amit.kumar@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'TRAVEL',
      amount: 8450.0,
      currency: 'INR',
      expenseDate: new Date('2026-08-12'),
      description: 'Flight ticket and taxi fare for client technical architecture onsite workshop',
      receiptUrl: '/receipts/demo/aug_travel_blr_01.pdf',
      status: 'REIMBURSED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Reimbursed via corporate bank transfer batch #AUG-01',
    },
    {
      userEmail: 'rohit.verma@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'SOFTWARE',
      amount: 24000.0,
      currency: 'INR',
      expenseDate: new Date('2026-08-15'),
      description: 'Annual JetBrains & IDE team productivity licenses for 5 developers',
      receiptUrl: '/receipts/demo/jetbrains_annual_invoice.pdf',
      status: 'REIMBURSED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Verified against engineering IT software allocation',
    },
    {
      userEmail: 'vikram.singh@example.com',
      projectCode: 'ST-PRJ-2026-03',
      category: 'OFFICE_SUPPLIES',
      amount: 12300.0,
      currency: 'INR',
      expenseDate: new Date('2026-08-22'),
      description: 'Ergonomic mouse pads, HDMI splitters, and network patch cables for hub',
      receiptUrl: '/receipts/demo/office_cables_aug.pdf',
      status: 'REIMBURSED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved & cleared',
    },
    {
      userEmail: 'priya.sharma@example.com',
      projectCode: null,
      category: 'CLIENT_ENTERTAINMENT',
      amount: 4800.0,
      currency: 'INR',
      expenseDate: new Date('2026-08-28'),
      description: 'Executive hiring luncheon with senior consulting candidates',
      receiptUrl: '/receipts/demo/dining_aug_28.pdf',
      status: 'REIMBURSED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'HR talent acquisition entertainment allocation',
    },

    // September 2026 Claims (Approved & Reimbursed)
    {
      userEmail: 'siddharth.rao@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'SOFTWARE',
      amount: 45600.0,
      currency: 'INR',
      expenseDate: new Date('2026-09-05'),
      description: 'AWS Staging and cloud development environment infrastructure bill for Q3',
      receiptUrl: '/receipts/demo/aws_invoice_sept_2026.pdf',
      status: 'REIMBURSED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Monthly cloud hosting line item cleared',
    },
    {
      userEmail: 'ananya.deshmukh@example.com',
      projectCode: 'ST-PRJ-2026-02',
      category: 'TRAVEL',
      amount: 14200.0,
      currency: 'INR',
      expenseDate: new Date('2026-09-12'),
      description: 'Roundtrip Mumbai-Delhi travel for GST tribunal consultation with client',
      receiptUrl: '/receipts/demo/air_travel_mumbai_sept.pdf',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved for disbursement in upcoming payroll cycle',
    },
    {
      userEmail: 'amit.kumar@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'TRAINING',
      amount: 18500.0,
      currency: 'INR',
      expenseDate: new Date('2026-09-18'),
      description: 'Certified Kubernetes Administrator (CKA) exam voucher & training course',
      receiptUrl: '/receipts/demo/cka_exam_receipt.pdf',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Skill development sponsorship approved by MD',
    },
    {
      userEmail: 'vikram.singh@example.com',
      projectCode: 'ST-PRJ-2026-03',
      category: 'OFFICE_SUPPLIES',
      amount: 8900.0,
      currency: 'INR',
      expenseDate: new Date('2026-09-24'),
      description: 'HEPA air filter replacements and workstation disinfectant supplies',
      receiptUrl: '/receipts/demo/facility_sanitization.pdf',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved for facility maintenance budget',
    },

    // October 2026 Claims (Recent / Submitted / Under Review)
    {
      userEmail: 'rohit.verma@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'TRAVEL',
      amount: 11200.0,
      currency: 'INR',
      expenseDate: new Date('2026-10-08'),
      description: 'Cab fares and executive client dinner following Q4 enterprise project kickoff',
      receiptUrl: '/receipts/demo/oct_client_dinner.pdf',
      status: 'APPROVED',
      reviewedByEmail: 'sneha.patel@example.com',
      reviewNotes: 'Approved. To be reimbursed in end of month payout.',
    },
    {
      userEmail: 'siddharth.rao@example.com',
      projectCode: 'ST-PRJ-2026-05',
      category: 'SOFTWARE',
      amount: 32000.0,
      currency: 'INR',
      expenseDate: new Date('2026-10-14'),
      description: 'Datadog APM & Cloud Security Posture Management annual subscription',
      receiptUrl: '/receipts/demo/datadog_renewal.pdf',
      status: 'UNDER_REVIEW',
      reviewedByEmail: null,
      reviewNotes: 'Finance verifying tax invoice and GST input credit eligibility',
    },
    {
      userEmail: 'pooja.mehta@example.com',
      projectCode: 'ST-PRJ-2026-01',
      category: 'HARDWARE',
      amount: 28500.0,
      currency: 'INR',
      expenseDate: new Date('2026-10-19'),
      description: '27-inch 4K Color-Accurate Designer Monitor for ERP high-fidelity UI design',
      receiptUrl: '/receipts/demo/designer_monitor_invoice.pdf',
      status: 'SUBMITTED',
      reviewedByEmail: null,
      reviewNotes: null,
    },
    {
      userEmail: 'deepak.chawla@example.com',
      projectCode: 'ST-PRJ-2026-02',
      category: 'TRAINING',
      amount: 7500.0,
      currency: 'INR',
      expenseDate: new Date('2026-10-21'),
      description: 'Institute of Chartered Accountants (ICAI) Advanced GST 2026 National Seminar',
      receiptUrl: '/receipts/demo/gst_seminar_pass.pdf',
      status: 'SUBMITTED',
      reviewedByEmail: null,
      reviewNotes: null,
    },
  ]

  for (const exp of expenseData) {
    const user = seededUsers[exp.userEmail]
    const prj = exp.projectCode ? seededProjects[exp.projectCode] : null
    const reviewer = exp.reviewedByEmail ? seededUsers[exp.reviewedByEmail] : null
    if (!user) continue

    const existing = await prisma.expense.findFirst({
      where: { userId: user.id, description: exp.description },
    })

    if (!existing) {
      await prisma.expense.create({
        data: {
          userId: user.id,
          projectId: prj ? prj.id : null,
          category: exp.category,
          amount: exp.amount,
          currency: exp.currency,
          expenseDate: exp.expenseDate,
          description: exp.description,
          receiptUrl: exp.receiptUrl,
          status: exp.status,
          reviewedById: reviewer ? reviewer.id : null,
          reviewNotes: exp.reviewNotes,
          isDemo: true,
        },
      })
    }
  }

  // ------------------------------------------------------------------
  // 8. Seed 3-Month Chronological Audit Logs & Activity Trail
  // ------------------------------------------------------------------
  console.log('Step 8/8: Seeding immutable administrative audit trail spanning 3 months...')
  const auditEntries = [
    // August
    {
      email: 'admin@successtunnel.in',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'SYS-INIT',
      details: 'Enterprise ERP management platform launched for Success Tunnel multi-departmental operations.',
      ipAddress: '192.168.1.10',
      createdAt: new Date('2026-08-01T08:30:00Z'),
    },
    {
      email: 'priya.sharma@example.com',
      action: 'POLICY_PUBLISHED',
      entityType: 'Document',
      entityId: 'DOC-POL-01',
      details: 'Published Success Tunnel Corporate Code of Conduct 2026 and Leave Policy.',
      ipAddress: '192.168.1.15',
      createdAt: new Date('2026-08-02T10:15:00Z'),
    },
    {
      email: 'rohit.verma@example.com',
      action: 'PROJECT_INITIATED',
      entityType: 'Project',
      entityId: 'ST-PRJ-2026-01',
      details: 'Initiated Enterprise ERP Management Portal project with budget INR 4,80,000.',
      ipAddress: '192.168.1.22',
      createdAt: new Date('2026-08-05T14:20:00Z'),
    },
    {
      email: 'priya.sharma@example.com',
      action: 'LEAVE_APPROVED',
      entityType: 'Leave',
      entityId: 'LV-101',
      details: 'Approved 3 days Annual Leave for Amit Kumar.',
      ipAddress: '192.168.1.15',
      createdAt: new Date('2026-08-08T16:45:00Z'),
    },
    {
      email: 'sneha.patel@example.com',
      action: 'EXPENSE_REIMBURSED',
      entityType: 'Expense',
      entityId: 'EXP-AUG-01',
      details: 'Authorized reimbursement for Amit Kumar client travel (INR 8,450).',
      ipAddress: '192.168.1.30',
      createdAt: new Date('2026-08-16T11:00:00Z'),
    },

    // September
    {
      email: 'admin@successtunnel.in',
      action: 'ROLE_MODIFIED',
      entityType: 'Employee',
      entityId: 'ST-PM-201',
      details: 'Confirmed Rohit Verma as Principal Project Manager across technology roadmaps.',
      ipAddress: '192.168.1.10',
      createdAt: new Date('2026-09-01T09:00:00Z'),
    },
    {
      email: 'admin@successtunnel.in',
      action: 'LEAVE_APPROVED',
      entityType: 'Leave',
      entityId: 'LV-104',
      details: 'Approved 4 days Annual Leave for Rohit Verma.',
      ipAddress: '192.168.1.10',
      createdAt: new Date('2026-09-03T17:10:00Z'),
    },
    {
      email: 'rohit.verma@example.com',
      action: 'LEAVE_REJECTED',
      entityType: 'Leave',
      entityId: 'LV-106',
      details: 'Rejected Amit Kumar leave due to critical Q3 release cycle conflict.',
      ipAddress: '192.168.1.22',
      createdAt: new Date('2026-09-15T15:30:00Z'),
    },
    {
      email: 'sneha.patel@example.com',
      action: 'PROJECT_COMPLETED',
      entityType: 'Project',
      entityId: 'ST-PRJ-2026-04',
      details: 'Q3 Financial Audit & Corporate Balance Sheet marked 100% completed and delivered.',
      ipAddress: '192.168.1.30',
      createdAt: new Date('2026-09-30T18:00:00Z'),
    },

    // October
    {
      email: 'priya.sharma@example.com',
      action: 'LEAVE_APPROVED',
      entityType: 'Leave',
      entityId: 'LV-108',
      details: 'Approved 2 days Casual Leave for Siddharth Rao.',
      ipAddress: '192.168.1.15',
      createdAt: new Date('2026-10-02T12:00:00Z'),
    },
    {
      email: 'sneha.patel@example.com',
      action: 'EXPENSE_APPROVED',
      entityType: 'Expense',
      entityId: 'EXP-OCT-01',
      details: 'Approved Rohit Verma enterprise client dinner and travel claim (INR 11,200).',
      ipAddress: '192.168.1.30',
      createdAt: new Date('2026-10-10T14:30:00Z'),
    },
    {
      email: 'admin@successtunnel.in',
      action: 'LOGIN_SUCCESS',
      entityType: 'Auth',
      entityId: 'ADM-LOGIN-OCT',
      details: 'Super Administrator session authenticated from management console.',
      ipAddress: '127.0.0.1',
      createdAt: new Date('2026-10-23T01:30:00Z'),
    },
  ]

  for (const aud of auditEntries) {
    const user = seededUsers[aud.email]
    const existing = await prisma.auditLog.findFirst({
      where: { action: aud.action, details: aud.details },
    })

    if (!existing) {
      await prisma.auditLog.create({
        data: {
          userId: user ? user.id : null,
          action: aud.action,
          entityType: aud.entityType,
          entityId: aud.entityId,
          details: aud.details,
          ipAddress: aud.ipAddress,
          createdAt: aud.createdAt,
        },
      })
    }
  }

  // ------------------------------------------------------------------
  // 9. Existing Website CMS Content (Services, Subservices, Properties, Blogs)
  // ------------------------------------------------------------------
  console.log('Finalizing: Ensuring public website CMS records are intact...')
  for (const service of sampleServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { title: service.title, excerpt: service.excerpt, icon: service.icon },
      create: { title: service.title, slug: service.slug, excerpt: service.excerpt, icon: service.icon },
    })
  }

  const consultancy = await prisma.service.findUniqueOrThrow({ where: { slug: 'consultancy' } })
  for (const subservice of consultancySubservices) {
    await prisma.subservice.upsert({
      where: { slug: subservice.slug },
      update: { title: subservice.title, content: subservice.content, serviceId: consultancy.id },
      create: { ...subservice, serviceId: consultancy.id },
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
        images: '[]',
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
        images: '[]',
      },
    })
  }

  for (const post of samplePosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { title: post.title, excerpt: post.excerpt, content: post.content, publishedAt: new Date() },
      create: { title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, publishedAt: new Date() },
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
      },
    })
  }

  console.log('\n======================================================================')
  console.log('✅ SUCCESS: 3 MONTHS OF REALISTIC FAKE DEMO DATA SEEDED INTO DATABASE!')
  console.log('======================================================================\n')
}

main()
  .catch((e) => {
    console.error('Fatal seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
