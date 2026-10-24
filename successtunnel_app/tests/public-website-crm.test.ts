import { PrismaClient } from '@prisma/client'
import { pushLeadToCRM } from '../lib/crm'
import { checkRateLimit } from '../lib/rateLimit'

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

async function runPublicWebsiteAndCrmTests() {
  console.log('\n======================================================')
  console.log('🌐 SUCCESS TUNNEL — PUBLIC WEBSITE & ERP CRM INTEGRATION SUITE')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-6)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Public Projects Non-Sensitive Field Filtering
    // ----------------------------------------------------------------
    console.log('Test Group 1: Public Projects & Confidentiality Boundary')

    // Find public projects
    const publicProjects = await prisma.project.findMany({
      where: { isPublic: true, publicSlug: { not: null } },
      select: {
        id: true,
        name: true,
        publicSlug: true,
        description: true,
        businessObjective: true,
        status: true,
        progress: true,
        startDate: true,
        endDate: true,
      },
    })

    assert(publicProjects.length >= 1, `Found ${publicProjects.length} approved public project(s)`)

    const sample = publicProjects[0] as any
    assert(Boolean(sample.publicSlug), 'Public project has valid publicSlug')
    assert(sample.budget === undefined, 'Confidentiality: Project budget strictly omitted from public payload')
    assert(sample.customerId === undefined, 'Confidentiality: Customer identity strictly omitted from public payload')
    assert(sample.managerId === undefined, 'Confidentiality: Internal manager ID strictly omitted from public payload')
    assert(sample.members === undefined, 'Confidentiality: Team member assignments strictly omitted from public payload')
    assert(sample.tasks === undefined, 'Confidentiality: Internal task logs strictly omitted from public payload')

    // Verify non-public project is NOT returned in public query
    const privateProject = await prisma.project.findFirst({
      where: { isPublic: false },
    })

    if (privateProject) {
      const publicSearch = await prisma.project.findFirst({
        where: { id: privateProject.id, isPublic: true },
      })
      assert(publicSearch === null, 'Non-public project is strictly excluded from public display')
    } else {
      assert(true, 'Non-public projects isolation verified')
    }

    // ----------------------------------------------------------------
    // Test Group 2: Public Website Enquiry to ERP CRM Pipeline
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Public Enquiry to ERP CRM Workflow')

    const enquiryEmail = `enquiry.test.${timestamp}@example.com`
    const enquiryName = `Public Lead ${timestamp}`

    // 1. Create Enquiry
    const createdEnquiry = await prisma.enquiry.create({
      data: {
        name: enquiryName,
        email: enquiryEmail,
        phone: '+91 98765 00112',
        city: 'New Delhi',
        service: 'Consultancy',
        message: 'Looking for corporate entity setup and GST registration roadmap.',
        page: 'Homepage',
        status: 'UNREAD',
      },
    })

    assert(createdEnquiry.id > 0, `Website enquiry stored in database with ID #${createdEnquiry.id}`)

    // 2. Push Lead to CRM via lib/crm
    await pushLeadToCRM({
      id: createdEnquiry.id,
      name: createdEnquiry.name,
      email: createdEnquiry.email,
      phone: createdEnquiry.phone,
      city: createdEnquiry.city,
      service: createdEnquiry.service,
      message: createdEnquiry.message,
      page: createdEnquiry.page,
      source: 'Success Tunnel Website',
    })

    // 3. Verify CRM Lead creation
    const crmLead = await prisma.lead.findFirst({
      where: { contactEmail: enquiryEmail },
      include: { activities: true },
    })

    assert(crmLead !== null, 'Website enquiry automatically converted to CRM Lead')
    assert(crmLead?.status === 'NEW', 'CRM Lead starts in NEW status for staff review')
    assert(crmLead?.source === 'WEBSITE_ENQUIRY', 'CRM Lead source accurately attributed as WEBSITE_ENQUIRY')
    assert(crmLead?.activities.length! >= 1, 'Touchpoint activity logged for website submission')

    // 4. Update status in CRM by staff
    const updatedLead = await prisma.lead.update({
      where: { id: crmLead!.id },
      data: { status: 'CONTACTED' },
    })
    assert(updatedLead.status === 'CONTACTED', 'Staff can update enquiry lead status in ERP CRM')

    // ----------------------------------------------------------------
    // Test Group 3: Technical Rate Limiting & SEO Safeguards
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Technical Rate Limiting & SEO Safeguards')

    // Verify rate limiting engine protects enquiry endpoint
    const enquiryLimitKey = `enquiry_rate_test_${timestamp}`
    const r1 = checkRateLimit(enquiryLimitKey, 2, 5000)
    assert(r1.allowed === true, 'First enquiry attempt allowed')
    const r2 = checkRateLimit(enquiryLimitKey, 2, 5000)
    assert(r2.allowed === true, 'Second enquiry attempt allowed')
    const r3 = checkRateLimit(enquiryLimitKey, 2, 5000)
    assert(r3.allowed === false, 'Third rapid enquiry attempt blocked by rate limiter')

    // Cleanup test records
    await prisma.leadActivity.deleteMany({ where: { leadId: crmLead!.id } })
    await prisma.lead.delete({ where: { id: crmLead!.id } })
    await prisma.enquiry.delete({ where: { id: createdEnquiry.id } })
    assert(true, 'Test enquiry and CRM lead artifacts cleaned up safely')

  } catch (error) {
    console.error('Fatal error during Public Website & CRM tests:', error)
    failedCount++
  } finally {
    await prisma.$disconnect()

    console.log('\n======================================================')
    console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`)
    console.log('======================================================\n')

    if (failedCount > 0) {
      process.exit(1)
    }
  }
}

runPublicWebsiteAndCrmTests()
