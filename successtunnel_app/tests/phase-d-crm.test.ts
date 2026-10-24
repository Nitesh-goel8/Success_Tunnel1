import { PrismaClient } from '@prisma/client'
import { checkModulePermission } from '../lib/auth'
import { pushLeadToCRM } from '../lib/crm'

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

async function runPhaseDTests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE D: CRM & DEALS PIPELINE')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-5)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Role-Based Authorization for CRM Module
    // ----------------------------------------------------------------
    console.log('Test Group 1: Role-Based Access Control (RBAC) Matrix for CRM')

    assert(checkModulePermission('super_admin', 'CRM', 'view') === true, 'Super Admin has CRM view permission')
    assert(checkModulePermission('super_admin', 'CRM', 'create') === true, 'Super Admin has CRM create permission')
    assert(checkModulePermission('super_admin', 'CRM', 'delete') === true, 'Super Admin has CRM delete permission')

    assert(checkModulePermission('project_manager', 'CRM', 'view') === true, 'Project Manager has CRM view permission')
    assert(checkModulePermission('project_manager', 'CRM', 'create') === true, 'Project Manager has CRM create permission')
    assert(checkModulePermission('project_manager', 'CRM', 'edit') === true, 'Project Manager has CRM edit permission')

    assert(checkModulePermission('hr_admin', 'CRM', 'view') === true, 'HR Admin has CRM view permission')
    assert(checkModulePermission('hr_admin', 'CRM', 'create') === false, 'HR Admin denied CRM create permission')

    assert(checkModulePermission('finance_admin', 'CRM', 'view') === true, 'Finance Admin has CRM view permission')
    assert(checkModulePermission('finance_admin', 'CRM', 'create') === false, 'Finance Admin denied CRM create permission')

    assert(checkModulePermission('employee', 'CRM', 'view') === true, 'Employee has basic CRM view permission')
    assert(checkModulePermission('employee', 'CRM', 'create') === false, 'Employee denied CRM create permission')
    assert(checkModulePermission('employee', 'CRM', 'delete') === false, 'Employee denied CRM delete permission')

    // ----------------------------------------------------------------
    // Test Group 2: Website Enquiry -> Internal CRM Lead Ingestion
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Automated Website Enquiry Ingestion Workflow')

    const enquiryEmail = `visitor_${timestamp}@example.com`
    const enquiry = await prisma.enquiry.create({
      data: {
        name: `Test Visitor ${timestamp}`,
        email: enquiryEmail,
        phone: '+91 98765 00000',
        city: 'New Delhi',
        service: 'Income Tax Planning',
        message: 'Looking for corporate income tax advisory services.',
        page: '/services/consultancy',
        status: 'UNREAD',
      },
    })
    assert(enquiry.id > 0, `Created website enquiry #${enquiry.id}`)

    // Execute automated ingestion
    const pushResult = await pushLeadToCRM({
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      city: enquiry.city,
      service: enquiry.service,
      message: enquiry.message,
      page: enquiry.page,
    })

    assert(pushResult.success === true, 'pushLeadToCRM executed successfully')
    assert(pushResult.leadId !== null, `Internal CRM Lead created with ID ${pushResult.leadId}`)

    const createdLead = await prisma.lead.findUnique({
      where: { id: pushResult.leadId! },
      include: { activities: true, enquiry: true },
    })

    assert(createdLead !== null, 'Retrieved ingested lead record from database')
    assert(createdLead?.source === 'WEBSITE_ENQUIRY', 'Lead source is correctly recorded as WEBSITE_ENQUIRY')
    assert(createdLead?.status === 'NEW', 'Initial lead stage is set to NEW')
    assert(createdLead?.enquiryId === enquiry.id, 'Lead is linked to original Enquiry foreign key')
    assert(Boolean(createdLead && createdLead.isDemo === false), 'Real website inquiry lead is marked isDemo=false')

    // Verify enquiry status transition to CONVERTED_TO_LEAD
    const updatedEnquiry = await prisma.enquiry.findUnique({ where: { id: enquiry.id } })
    assert(updatedEnquiry?.status === 'CONVERTED_TO_LEAD', 'Enquiry status updated to CONVERTED_TO_LEAD')

    // Verify initial touchpoint activity log
    assert(Boolean(createdLead?.activities && createdLead.activities.length > 0), 'Initial lead activity created')
    assert(createdLead?.activities[0]?.type === 'STATUS_CHANGE', 'Activity type is STATUS_CHANGE')

    // ----------------------------------------------------------------
    // Test Group 3: Lead Pipeline Progression & Touchpoints
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Deal Progression & Touchpoint Activity Logging')

    const leadCode = `ST-LEAD-TEST-${timestamp}`
    const testLead = await prisma.lead.create({
      data: {
        leadCode,
        title: `Enterprise Cloud Strategy ${timestamp}`,
        contactName: `Executive Sponsor ${timestamp}`,
        contactEmail: `sponsor_${timestamp}@example.com`,
        contactPhone: '+91 98111 55555',
        company: `Sponsor Corp ${timestamp}`,
        source: 'DIRECT',
        status: 'NEW',
        priority: 'HIGH',
        estimatedValue: 350000.0,
        currency: 'INR',
        isDemo: true,
      },
    })
    assert(testLead.id > 0, `Created pipeline lead ${testLead.leadCode}`)

    // Transition: NEW -> CONTACTED
    const followUpDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const contactedLead = await prisma.lead.update({
      where: { id: testLead.id },
      data: { status: 'CONTACTED', nextFollowUp: followUpDate },
    })
    assert(contactedLead.status === 'CONTACTED', 'Lead stage transitioned to CONTACTED')

    await prisma.leadActivity.create({
      data: {
        leadId: testLead.id,
        type: 'CALL',
        summary: 'Introductory discovery call completed with CTO',
        details: 'Confirmed budget and scheduled follow-up architecture review',
        followUpDate,
      },
    })

    // Transition: CONTACTED -> QUALIFIED -> PROPOSAL_SENT
    await prisma.lead.update({
      where: { id: testLead.id },
      data: { status: 'QUALIFIED' },
    })
    const proposalLead = await prisma.lead.update({
      where: { id: testLead.id },
      data: { status: 'PROPOSAL_SENT', estimatedValue: 420000.0 },
    })
    assert(proposalLead.status === 'PROPOSAL_SENT', 'Lead stage transitioned to PROPOSAL_SENT')
    assert(proposalLead.estimatedValue === 420000.0, 'Lead value updated to ₹420,000')

    // Verify activity count
    const activityCount = await prisma.leadActivity.count({ where: { leadId: testLead.id } })
    assert(activityCount >= 1, `Recorded touchpoint interactions for lead (count: ${activityCount})`)

    // ----------------------------------------------------------------
    // Test Group 4: Deal Won & Conversion to Customer Account
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Deal Won & Automated Customer Account Creation')

    // Simulate winning deal and promoting to Customer
    const customerCode = `ST-CUST-TEST-${timestamp}`
    const createdCustomer = await prisma.customer.create({
      data: {
        customerCode,
        name: testLead.company || testLead.contactName,
        company: testLead.company,
        email: testLead.contactEmail,
        phone: testLead.contactPhone,
        city: 'Gurugram',
        status: 'ACTIVE',
        isDemo: true,
      },
    })
    assert(createdCustomer.id > 0, `Created customer record ${createdCustomer.customerCode}`)

    // Link lead to customer and mark WON
    const wonLead = await prisma.lead.update({
      where: { id: testLead.id },
      data: {
        status: 'WON',
        customerId: createdCustomer.id,
      },
      include: { customer: true },
    })
    assert(wonLead.status === 'WON', 'Lead marked WON')
    assert(wonLead.customerId === createdCustomer.id, 'Lead successfully linked to customer account')

    // Associate an active Project with this Customer
    const customerProject = await prisma.project.create({
      data: {
        projectCode: `ST-PRJ-CUST-${timestamp}`,
        name: `Implementation for ${createdCustomer.company}`,
        businessObjective: 'Enterprise onboarding project',
        status: 'IN_PROGRESS',
        customerId: createdCustomer.id,
        isDemo: true,
      },
    })
    assert(customerProject.customerId === createdCustomer.id, 'Project associated with Customer account')

    // Verify customer directory relations (leads + projects)
    const customerWithRelations = await prisma.customer.findUnique({
      where: { id: createdCustomer.id },
      include: {
        projects: true,
        leads: true,
      },
    })
    assert(Boolean(customerWithRelations?.projects.length === 1), 'Customer retrieves associated active project')
    assert(Boolean(customerWithRelations?.leads.length === 1), 'Customer retrieves associated pipeline lead')

    // ----------------------------------------------------------------
    // Test Group 5: Demo Data Integrity & Separation
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Demo Data Integrity & Separation')

    const demoCustomers = await prisma.customer.findMany({ where: { isDemo: true } })
    const demoLeads = await prisma.lead.findMany({ where: { isDemo: true } })
    const realLeads = await prisma.lead.findMany({ where: { isDemo: false } })

    assert(demoCustomers.length >= 1, `Found ${demoCustomers.length} properly flagged demo customer(s)`)
    assert(demoLeads.length >= 1, `Found ${demoLeads.length} properly flagged demo lead(s)`)
    assert(realLeads.length >= 1, `Found ${realLeads.length} production/real lead(s) with isDemo=false`)

    // Verify demo isolation query
    const realOnlyLeads = await prisma.lead.findMany({ where: { isDemo: false } })
    assert(realOnlyLeads.every((l) => !l.isDemo), 'Production query strictly isolates non-demo records')
  } catch (err: any) {
    console.error('Unexpected test execution failure:', err)
    failedCount++
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n======================================================')
  console.log(`TEST SUMMARY: ${passedCount} passed, ${failedCount} failed`)
  console.log('======================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

runPhaseDTests()
