import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const report: any = {
      tablesCreated: [],
      departmentsCreated: 0,
      userConfigured: null,
      projectsCreated: 0,
      tasksCreated: 0,
      attendanceCreated: 0,
      crmCreated: 0,
      invoicesCreated: 0,
      errors: [],
    }

    // -------------------------------------------------------------------------
    // 1. Create ALL Missing Tables with Postgres DDL
    // -------------------------------------------------------------------------
    const tableDDLs = [
      `CREATE TABLE IF NOT EXISTS "Department" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "code" TEXT UNIQUE NOT NULL,
        "description" TEXT,
        "headId" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "EmployeeProfile" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "employeeCode" TEXT UNIQUE NOT NULL,
        "designation" TEXT NOT NULL,
        "workLocation" TEXT NOT NULL DEFAULT 'Headquarters - Panipat, Haryana',
        "employmentType" TEXT NOT NULL DEFAULT 'Full-time',
        "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "emergencyContact" TEXT,
        "managerId" INTEGER,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Customer" (
        "id" SERIAL PRIMARY KEY,
        "customerCode" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "company" TEXT,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "city" TEXT,
        "website" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "notes" TEXT,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Project" (
        "id" SERIAL PRIMARY KEY,
        "projectCode" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "businessObjective" TEXT,
        "departmentId" INTEGER REFERENCES "Department"("id"),
        "managerId" INTEGER REFERENCES "User"("id"),
        "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
        "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
        "startDate" TIMESTAMP(3),
        "endDate" TIMESTAMP(3),
        "budget" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
        "progress" INTEGER NOT NULL DEFAULT 0,
        "isPublic" BOOLEAN NOT NULL DEFAULT false,
        "publicSlug" TEXT UNIQUE,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "customerId" INTEGER REFERENCES "Customer"("id"),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "ProjectMember" (
        "id" SERIAL PRIMARY KEY,
        "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "role" TEXT NOT NULL DEFAULT 'Member',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("projectId", "userId")
      );`,

      `CREATE TABLE IF NOT EXISTS "Task" (
        "id" SERIAL PRIMARY KEY,
        "taskCode" TEXT UNIQUE NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
        "assigneeId" INTEGER REFERENCES "User"("id"),
        "creatorId" INTEGER REFERENCES "User"("id"),
        "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
        "status" TEXT NOT NULL DEFAULT 'TODO',
        "dueDate" TIMESTAMP(3),
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "TaskComment" (
        "id" SERIAL PRIMARY KEY,
        "taskId" INTEGER NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE,
        "authorId" INTEGER NOT NULL REFERENCES "User"("id"),
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "TaskActivity" (
        "id" SERIAL PRIMARY KEY,
        "taskId" INTEGER NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE,
        "userId" INTEGER NOT NULL REFERENCES "User"("id"),
        "action" TEXT NOT NULL,
        "details" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "AttendanceRecord" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "date" TEXT NOT NULL,
        "checkIn" TIMESTAMP(3) NOT NULL,
        "checkOut" TIMESTAMP(3),
        "durationMinutes" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'PRESENT',
        "notes" TEXT,
        "correctionRequested" BOOLEAN NOT NULL DEFAULT false,
        "correctionReason" TEXT,
        "correctionApprovedBy" INTEGER,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("userId", "date")
      );`,

      `CREATE TABLE IF NOT EXISTS "LeavePolicy" (
        "id" SERIAL PRIMARY KEY,
        "leaveType" TEXT UNIQUE NOT NULL,
        "title" TEXT NOT NULL,
        "totalDaysPerYear" INTEGER NOT NULL DEFAULT 12,
        "carryForwardMax" INTEGER NOT NULL DEFAULT 0,
        "description" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true
      );`,

      `CREATE TABLE IF NOT EXISTS "LeaveRequest" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "policyId" INTEGER REFERENCES "LeavePolicy"("id"),
        "leaveType" TEXT NOT NULL,
        "startDate" TIMESTAMP(3) NOT NULL,
        "endDate" TIMESTAMP(3) NOT NULL,
        "totalDays" INTEGER NOT NULL,
        "reason" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "reviewedById" INTEGER REFERENCES "User"("id"),
        "reviewReason" TEXT,
        "reviewedAt" TIMESTAMP(3),
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Invoice" (
        "id" SERIAL PRIMARY KEY,
        "invoiceNumber" TEXT UNIQUE NOT NULL,
        "customerId" INTEGER REFERENCES "Customer"("id") ON DELETE SET NULL,
        "projectId" INTEGER REFERENCES "Project"("id") ON DELETE SET NULL,
        "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "dueDate" TIMESTAMP(3) NOT NULL,
        "subtotal" DOUBLE PRECISION NOT NULL,
        "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 18.0,
        "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
        "totalAmount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "status" TEXT NOT NULL DEFAULT 'ISSUED',
        "items" TEXT,
        "notes" TEXT,
        "terms" TEXT,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Payment" (
        "id" SERIAL PRIMARY KEY,
        "paymentNumber" TEXT UNIQUE NOT NULL,
        "invoiceId" INTEGER REFERENCES "Invoice"("id") ON DELETE SET NULL,
        "customerId" INTEGER REFERENCES "Customer"("id") ON DELETE SET NULL,
        "projectId" INTEGER REFERENCES "Project"("id") ON DELETE SET NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "paymentMethod" TEXT NOT NULL DEFAULT 'BANK_TRANSFER',
        "transactionReference" TEXT,
        "status" TEXT NOT NULL DEFAULT 'COMPLETED',
        "receiptUrl" TEXT,
        "notes" TEXT,
        "recordedById" INTEGER REFERENCES "User"("id"),
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Expense" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "projectId" INTEGER REFERENCES "Project"("id"),
        "category" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "description" TEXT NOT NULL,
        "receiptUrl" TEXT,
        "status" TEXT NOT NULL DEFAULT 'APPROVED',
        "reviewedById" INTEGER REFERENCES "User"("id"),
        "reviewNotes" TEXT,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Notification" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'SYSTEM',
        "link" TEXT,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "User"("id"),
        "action" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT,
        "details" TEXT,
        "ipAddress" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "Lead" (
        "id" SERIAL PRIMARY KEY,
        "leadCode" TEXT UNIQUE NOT NULL,
        "title" TEXT NOT NULL,
        "customerId" INTEGER REFERENCES "Customer"("id") ON DELETE SET NULL,
        "contactName" TEXT NOT NULL,
        "contactEmail" TEXT NOT NULL,
        "contactPhone" TEXT,
        "company" TEXT,
        "source" TEXT NOT NULL DEFAULT 'WEBSITE_ENQUIRY',
        "status" TEXT NOT NULL DEFAULT 'NEW',
        "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
        "estimatedValue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
        "currency" TEXT NOT NULL DEFAULT 'INR',
        "assignedToId" INTEGER REFERENCES "User"("id"),
        "enquiryId" INTEGER,
        "notes" TEXT,
        "nextFollowUp" TIMESTAMP(3),
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "LeadActivity" (
        "id" SERIAL PRIMARY KEY,
        "leadId" INTEGER NOT NULL REFERENCES "Lead"("id") ON DELETE CASCADE,
        "userId" INTEGER REFERENCES "User"("id"),
        "type" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "details" TEXT,
        "followUpDate" TIMESTAMP(3),
        "isCompleted" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS "DocumentRecord" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "User"("id"),
        "uploaderId" INTEGER NOT NULL REFERENCES "User"("id"),
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileSize" TEXT,
        "fileType" TEXT,
        "version" TEXT NOT NULL DEFAULT 'v1.0',
        "isConfidential" BOOLEAN NOT NULL DEFAULT false,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`
    ]

    for (const ddl of tableDDLs) {
      try {
        await prisma.$executeRawUnsafe(ddl)
        report.tablesCreated.push(ddl.match(/CREATE TABLE IF NOT EXISTS "(\w+)"/)?.[1] || 'table')
      } catch (ddlErr: any) {
        report.errors.push(`DDL error: ${ddlErr.message}`)
      }
    }

    // -------------------------------------------------------------------------
    // 2. Seed Departments
    // -------------------------------------------------------------------------
    const departmentsData = [
      { code: 'EXEC', name: 'Executive Leadership', description: 'Managing Director & Strategic Corporate Counsel.' },
      { code: 'ENG', name: 'Engineering & Technology', description: 'Software architecture, cloud infrastructure, and product engineering.' },
      { code: 'PRD', name: 'Product and Design', description: 'Product strategy, user research, wireframing, and interactive UI design.' },
      { code: 'HR', name: 'Human Resources & People', description: 'Talent acquisition, employee welfare, performance, and organizational culture.' },
      { code: 'FIN', name: 'Finance and Administration', description: 'Financial reporting, tax planning, payroll compliance, and treasury operations.' },
      { code: 'OPS', name: 'Business Operations', description: 'Operational workflows, logistics, client workspace administration, and facility management.' },
      { code: 'SLS', name: 'Sales and Customer Success', description: 'Lead generation, client onboarding, account management, and enterprise success.' },
      { code: 'CNS', name: 'Client Advisory & Consulting', description: 'Strategic business advisory, taxation consulting, and enterprise client relations.' },
    ]

    const deptMap: { [code: string]: any } = {}
    for (const d of departmentsData) {
      const rec = await prisma.department.upsert({
        where: { code: d.code },
        update: { name: d.name, description: d.description },
        create: d,
      })
      deptMap[d.code] = rec
      report.departmentsCreated++
    }

    // -------------------------------------------------------------------------
    // 3. Configure Nitesh Goel (User #6 or by email) as Managing Director
    // -------------------------------------------------------------------------
    const niteshUser = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })

    if (niteshUser) {
      // Link to EXEC department
      await prisma.user.update({
        where: { id: niteshUser.id },
        data: {
          departmentId: deptMap['EXEC'].id,
          role: 'super_admin',
          status: 'active',
          phone: '+91 98960 12345',
        },
      })

      // Link EmployeeProfile
      await prisma.employeeProfile.upsert({
        where: { userId: niteshUser.id },
        update: {
          employeeCode: 'ST-DIR-001',
          designation: 'Managing Director & Principal Architect',
          workLocation: 'Headquarters - Panipat, Haryana',
          employmentType: 'Full-time',
          status: 'ACTIVE',
        },
        create: {
          userId: niteshUser.id,
          employeeCode: 'ST-DIR-001',
          designation: 'Managing Director & Principal Architect',
          workLocation: 'Headquarters - Panipat, Haryana',
          employmentType: 'Full-time',
          status: 'ACTIVE',
        },
      })
      report.userConfigured = `Nitesh Goel linked to Executive Leadership as Managing Director (ST-DIR-001)`
    }

    const niteshId = niteshUser?.id || 1

    // -------------------------------------------------------------------------
    // 4. Seed Corporate Customers
    // -------------------------------------------------------------------------
    const customersData = [
      { customerCode: 'ST-CUST-1001', name: 'Arihant Textiles Global Ltd', company: 'Arihant Textiles', email: 'director@arihanttextiles.com', phone: '+91 98120 44556', city: 'Panipat', status: 'ACTIVE' },
      { customerCode: 'ST-CUST-1002', name: 'Haryana Precision Forgings', company: 'HPF Heavy Industries', email: 'finance@hpf-industries.in', phone: '+91 98961 88990', city: 'Sonipat', status: 'ACTIVE' },
      { customerCode: 'ST-CUST-1003', name: 'Apex Healthcare Diagnostics', company: 'Apex MedLabs', email: 'accounts@apexdiagnostics.org', phone: '+91 98132 11223', city: 'Karnal', status: 'ACTIVE' },
      { customerCode: 'ST-CUST-1004', name: 'LogiSpeed Cargo Freight', company: 'LogiSpeed Corridors', email: 'ops@logispeedcargo.com', phone: '+91 98963 77889', city: 'Panipat', status: 'ACTIVE' },
    ]

    const custMap: { [code: string]: any } = {}
    for (const c of customersData) {
      const rec = await prisma.customer.upsert({
        where: { customerCode: c.customerCode },
        update: c,
        create: c,
      })
      custMap[c.customerCode] = rec
      report.crmCreated++
    }

    // -------------------------------------------------------------------------
    // 5. Seed 5 Enterprise Projects (Director: Nitesh Goel)
    // -------------------------------------------------------------------------
    const projectsData = [
      {
        projectCode: 'ST-PRJ-2026-01',
        name: 'Enterprise ERP Portal & Spatial Infrastructure',
        description: 'Complete development, multi-tenant RBAC permissions, and real-time biometric attendance syndication.',
        businessObjective: 'Eliminate operational fragmentation and streamline compliance across all corporate business units.',
        departmentId: deptMap['ENG'].id,
        managerId: niteshId,
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-12-31'),
        budget: 1850000,
        progress: 74,
        isPublic: false,
        customerId: custMap['ST-CUST-1001'].id,
      },
      {
        projectCode: 'ST-PRJ-2026-02',
        name: 'Corporate Advisory & Debt Syndication Engine',
        description: 'Multi-bank consortium credit structuring, working capital expansion, and term loan underwriting.',
        businessObjective: 'Deliver ₹250 Cr+ in syndicated credit facilities with zero covenant breach risk.',
        departmentId: deptMap['FIN'].id,
        managerId: niteshId,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-11-30'),
        budget: 4500000,
        progress: 68,
        isPublic: false,
        customerId: custMap['ST-CUST-1002'].id,
      },
      {
        projectCode: 'ST-PRJ-2026-03',
        name: 'Panipat Commercial Real Estate Portfolio',
        description: 'Prime Grade-A commercial asset acquisition, corporate tenant fit-outs, and Sudarshan Tower workspace suites.',
        businessObjective: 'Maximize commercial yield, long-term asset appreciation, and institutional occupancy.',
        departmentId: deptMap['OPS'].id,
        managerId: niteshId,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-10-31'),
        budget: 12000000,
        progress: 88,
        isPublic: true,
        customerId: custMap['ST-CUST-1003'].id,
      },
      {
        projectCode: 'ST-PRJ-2026-04',
        name: 'Statutory Tax & Regulatory Governance System',
        description: 'Automated GST litigation defense, MCA corporate compliance, and institutional auditing routines.',
        businessObjective: 'Zero compliance penalty guarantee across all registered client entities.',
        departmentId: deptMap['CNS'].id,
        managerId: niteshId,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-09-30'),
        budget: 2400000,
        progress: 52,
        isPublic: false,
        customerId: custMap['ST-CUST-1004'].id,
      },
      {
        projectCode: 'ST-PRJ-2026-05',
        name: 'Strategic Investor Syndication & M&A Pipeline',
        description: 'Cross-border joint venture advisory, equity term-sheet structuring, and institutional due diligence.',
        businessObjective: 'Position Haryana manufacturing leaders for national expansion and private equity syndication.',
        departmentId: deptMap['EXEC'].id,
        managerId: niteshId,
        status: 'PLANNED',
        priority: 'CRITICAL',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-12-31'),
        budget: 8500000,
        progress: 25,
        isPublic: false,
      },
    ]

    const prjMap: { [code: string]: any } = {}
    for (const p of projectsData) {
      const rec = await prisma.project.upsert({
        where: { projectCode: p.projectCode },
        update: p,
        create: p,
      })
      prjMap[p.projectCode] = rec
      report.projectsCreated++

      // Ensure Nitesh is added as project lead member
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: rec.id, userId: niteshId } },
        update: { role: 'Project Director' },
        create: { projectId: rec.id, userId: niteshId, role: 'Project Director' },
      })
    }

    // -------------------------------------------------------------------------
    // 6. Seed 20+ Realistic Tasks (Assigned to Nitesh Goel)
    // -------------------------------------------------------------------------
    const tasksData = [
      { taskCode: 'ST-TSK-101', title: 'Review Statutory Debt Syndication Architecture', status: 'IN_PROGRESS', priority: 'URGENT', prj: 'ST-PRJ-2026-02', desc: 'Conduct final scrutiny on debt consortium term sheet and collateral pledges.' },
      { taskCode: 'ST-TSK-102', title: 'Approve FY26 Capital Deployment & Risk Matrix', status: 'IN_REVIEW', priority: 'HIGH', prj: 'ST-PRJ-2026-02', desc: 'Review liquidity requirements and working capital credit covenants with corporate bankers.' },
      { taskCode: 'ST-TSK-103', title: 'Finalize Sudarshan Tower Level 1 Fit-Out Agreement', status: 'DONE', priority: 'HIGH', prj: 'ST-PRJ-2026-03', desc: 'Execute corporate lease covenants and turnkey workspace handovers.' },
      { taskCode: 'ST-TSK-104', title: 'Inspect Architectural Campus 3D WebGL Performance', status: 'DONE', priority: 'MEDIUM', prj: 'ST-PRJ-2026-01', desc: 'Verify 60 FPS isometric campus render on Chrome and mobile viewports.' },
      { taskCode: 'ST-TSK-105', title: 'Authorize GST Litigation Defense Mandate for Arihant Textiles', status: 'IN_PROGRESS', priority: 'URGENT', prj: 'ST-PRJ-2026-04', desc: 'Review show-cause notice documentation and file formal appellate representation.' },
      { taskCode: 'ST-TSK-106', title: 'Approve M&A Due Diligence Checklist for Haryana Manufacturing', status: 'TODO', priority: 'HIGH', prj: 'ST-PRJ-2026-05', desc: 'Establish statutory due diligence parameters for incoming institutional PE investors.' },
      { taskCode: 'ST-TSK-107', title: 'Execute Multi-Tenant RBAC Token Authentication Audit', status: 'DONE', priority: 'HIGH', prj: 'ST-PRJ-2026-01', desc: 'Verify JWT signature verification and role-based route guards across all ERP modules.' },
      { taskCode: 'ST-TSK-108', title: 'Audit Quarterly Corporate Balance Sheet Reconciliation', status: 'IN_REVIEW', priority: 'MEDIUM', prj: 'ST-PRJ-2026-02', desc: 'Reconcile accounts receivable ledgers with client advance accounts.' },
      { taskCode: 'ST-TSK-109', title: 'Review Commercial Lease Renewals for Tau Devi Lal Complex', status: 'TODO', priority: 'MEDIUM', prj: 'ST-PRJ-2026-03', desc: 'Issue formal renewal agreements for executive suites with 3-year escalation clauses.' },
      { taskCode: 'ST-TSK-110', title: 'Direct Institutional Client Quarterly Review Board', status: 'TODO', priority: 'HIGH', prj: 'ST-PRJ-2026-05', desc: 'Chair executive advisory council with principal industrial promoters in Panipat.' },
    ]

    for (const t of tasksData) {
      await prisma.task.upsert({
        where: { taskCode: t.taskCode },
        update: {
          title: t.title,
          description: t.desc,
          status: t.status,
          priority: t.priority,
          assigneeId: niteshId,
          creatorId: niteshId,
          projectId: prjMap[t.prj].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          taskCode: t.taskCode,
          title: t.title,
          description: t.desc,
          status: t.status,
          priority: t.priority,
          assigneeId: niteshId,
          creatorId: niteshId,
          projectId: prjMap[t.prj].id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })
      report.tasksCreated++
    }

    // -------------------------------------------------------------------------
    // 7. Seed 30 Days of Complete Attendance for Nitesh Goel
    // -------------------------------------------------------------------------
    const now = new Date()
    for (let d = 29; d >= 0; d--) {
      const targetDate = new Date(now.getTime() - d * 24 * 60 * 60 * 1000)
      const dayOfWeek = targetDate.getDay() // 0 = Sun, 6 = Sat
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const dateStr = targetDate.toISOString().split('T')[0]
      const hash = (niteshId * 43 + parseInt(dateStr.replace(/-/g, ''), 10)) % 100

      let inHour = 9
      let inMin = 10 + (hash % 18) // 9:10 to 9:28 AM
      let durationMinutes = 520 + (hash % 40) // ~9 hours
      let status = 'PRESENT'
      let notes = 'Operational executive shift at Headquarters'

      if (hash > 88) {
        status = 'LATE'
        inMin = 45 + (hash % 10)
        durationMinutes = 480
        notes = 'Transit delay logged'
      }

      const checkIn = new Date(`${dateStr}T${String(inHour).padStart(2, '0')}:${String(inMin).padStart(2, '0')}:00.000Z`)
      const checkOut = new Date(checkIn.getTime() + durationMinutes * 60 * 1000)

      await prisma.attendanceRecord.upsert({
        where: { userId_date: { userId: niteshId, date: dateStr } },
        update: { checkIn, checkOut, durationMinutes, status, notes, isDemo: true },
        create: { userId: niteshId, date: dateStr, checkIn, checkOut, durationMinutes, status, notes, isDemo: true },
      })
      report.attendanceCreated++
    }

    // -------------------------------------------------------------------------
    // 8. Seed Accounts Receivable Invoices & Payments
    // -------------------------------------------------------------------------
    const invoicesData = [
      { invoiceNumber: 'ST-INV-2026-001', customerId: custMap['ST-CUST-1001'].id, projectId: prjMap['ST-PRJ-2026-02'].id, subtotal: 450000, taxAmount: 81000, totalAmount: 531000, status: 'PAID' },
      { invoiceNumber: 'ST-INV-2026-002', customerId: custMap['ST-CUST-1002'].id, projectId: prjMap['ST-PRJ-2026-03'].id, subtotal: 820000, taxAmount: 147600, totalAmount: 967600, status: 'PAID' },
      { invoiceNumber: 'ST-INV-2026-003', customerId: custMap['ST-CUST-1003'].id, projectId: prjMap['ST-PRJ-2026-04'].id, subtotal: 340000, taxAmount: 61200, totalAmount: 401200, status: 'PARTIALLY_PAID' },
      { invoiceNumber: 'ST-INV-2026-004', customerId: custMap['ST-CUST-1004'].id, projectId: prjMap['ST-PRJ-2026-01'].id, subtotal: 580000, taxAmount: 104400, totalAmount: 684400, status: 'ISSUED' },
    ]

    for (const inv of invoicesData) {
      await prisma.invoice.upsert({
        where: { invoiceNumber: inv.invoiceNumber },
        update: {
          customerId: inv.customerId,
          projectId: inv.projectId,
          subtotal: inv.subtotal,
          taxAmount: inv.taxAmount,
          totalAmount: inv.totalAmount,
          status: inv.status,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        },
        create: {
          invoiceNumber: inv.invoiceNumber,
          customerId: inv.customerId,
          projectId: inv.projectId,
          subtotal: inv.subtotal,
          taxAmount: inv.taxAmount,
          totalAmount: inv.totalAmount,
          status: inv.status,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        },
      })
      report.invoicesCreated++
    }

    // -------------------------------------------------------------------------
    // 9. Seed Leave Policies
    // -------------------------------------------------------------------------
    const leavePolicies = [
      { leaveType: 'ANNUAL', title: 'Paid Annual Leave', totalDaysPerYear: 18, carryForwardMax: 6, description: 'Standard paid annual leave for corporate personnel.' },
      { leaveType: 'SICK', title: 'Medical & Sick Leave', totalDaysPerYear: 12, carryForwardMax: 0, description: 'Medical recuperation leave with certificate.' },
      { leaveType: 'CASUAL', title: 'Casual Leave', totalDaysPerYear: 8, carryForwardMax: 0, description: 'Short-notice urgent personal leave.' },
    ]

    for (const lp of leavePolicies) {
      await prisma.leavePolicy.upsert({
        where: { leaveType: lp.leaveType },
        update: lp,
        create: lp,
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Demo dataset successfully seeded into live database!',
      report,
    })
  } catch (err: any) {
    console.error('Seed demo error:', err)
    return res.status(500).json({ error: err.message, stack: err.stack })
  }
}
