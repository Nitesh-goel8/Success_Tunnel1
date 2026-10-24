import { prisma } from './prisma'

export interface PushLeadOptions {
  id?: number
  name: string
  email: string
  phone: string
  city?: string | null
  service?: string | null
  message?: string | null
  page?: string | null
  source?: string
}

/**
 * Ingests an incoming website enquiry into the Success Tunnel ERP internal CRM pipeline.
 * Creates a Lead record linked to the Enquiry, generates an audit activity,
 * and optionally forwards to an external CRM webhook if CRM_API_URL is configured.
 */
export async function pushLeadToCRM(leadData: PushLeadOptions) {
  const crmUrl = process.env.CRM_API_URL
  const crmKey = process.env.CRM_API_KEY

  let internalLeadId: number | null = null

  try {
    const cleanEmail = leadData.email.trim().toLowerCase()
    const cleanPhone = leadData.phone.trim()
    const cleanName = leadData.name.trim()

    // Generate readable unique lead code
    const count = await prisma.lead.count()
    const leadCode = `ST-LEAD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    // Check if an existing customer matches this email
    const existingCustomer = await prisma.customer.findFirst({
      where: { email: cleanEmail },
    })

    const title = leadData.service
      ? `Website Enquiry: ${leadData.service}`
      : `Website Enquiry: General Consultation`

    const notesSummary = [
      leadData.service ? `Interested Service: ${leadData.service}` : null,
      leadData.city ? `City: ${leadData.city}` : null,
      leadData.page ? `Source Page: ${leadData.page}` : null,
      leadData.message ? `Message: ${leadData.message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const createdLead = await prisma.lead.create({
      data: {
        leadCode,
        title,
        customerId: existingCustomer ? existingCustomer.id : null,
        contactName: cleanName,
        contactEmail: cleanEmail,
        contactPhone: cleanPhone,
        company: existingCustomer?.company || null,
        source: 'WEBSITE_ENQUIRY',
        status: 'NEW',
        priority: 'MEDIUM',
        estimatedValue: 0.0,
        currency: 'INR',
        enquiryId: leadData.id || null,
        notes: notesSummary,
        isDemo: false,
      },
    })

    internalLeadId = createdLead.id

    // Update enquiry status to 'CONVERTED_TO_LEAD' if enquiryId was provided
    if (leadData.id) {
      await prisma.enquiry.update({
        where: { id: leadData.id },
        data: { status: 'CONVERTED_TO_LEAD' },
      })
    }

    // Log the initial ingestion activity
    await prisma.leadActivity.create({
      data: {
        leadId: createdLead.id,
        type: 'STATUS_CHANGE',
        summary: `Lead automatically ingested from website enquiry (${leadData.service || 'General'})`,
        details: `Source: Website Enquiry Form | Page: ${leadData.page || 'Home'}`,
        isCompleted: true,
      },
    })
  } catch (dbError) {
    console.error('[CRM Internal Ingestion Error]:', dbError)
  }

  // External Webhook forwarding if configured
  if (crmUrl) {
    try {
      const response = await fetch(crmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(crmKey && { Authorization: `Bearer ${crmKey}` }),
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        console.error('[CRM Integration] External CRM webhook failed. Status:', response.status)
        return { success: true, leadId: internalLeadId, externalError: 'External webhook failed' }
      }
      return { success: true, leadId: internalLeadId }
    } catch (error) {
      console.error('[CRM Integration] Exception while forwarding to external CRM:', error)
      return { success: true, leadId: internalLeadId, externalError: String(error) }
    }
  }

  return { success: true, leadId: internalLeadId }
}
