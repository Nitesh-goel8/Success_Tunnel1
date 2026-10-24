import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  const { id } = req.query
  const leadId = parseInt(String(id), 10)

  if (isNaN(leadId)) {
    return res.status(400).json({ error: 'Invalid lead ID parameter' })
  }

  // GET /api/portal/crm/leads/[id]
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'CRM', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view CRM lead' })
    }

    try {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          customer: {
            include: {
              projects: {
                select: { id: true, projectCode: true, name: true, status: true, progress: true },
              },
            },
          },
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          enquiry: true,
          activities: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!lead) {
        return res.status(404).json({ error: 'CRM Lead not found' })
      }

      return res.status(200).json(lead)
    } catch (err: any) {
      console.error('Error retrieving CRM lead:', err)
      return res.status(500).json({ error: 'Failed to retrieve lead', details: err.message })
    }
  }

  // PUT / PATCH /api/portal/crm/leads/[id]
  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!checkModulePermission(user.role, 'CRM', 'edit')) {
      return res.status(403).json({ error: 'Permission denied: Cannot edit CRM lead' })
    }

    try {
      const currentLead = await prisma.lead.findUnique({
        where: { id: leadId },
      })

      if (!currentLead) {
        return res.status(404).json({ error: 'CRM Lead not found' })
      }

      const {
        title,
        contactName,
        contactEmail,
        contactPhone,
        company,
        source,
        status,
        priority,
        estimatedValue,
        currency,
        assignedToId,
        customerId,
        notes,
        nextFollowUp,
        convertToCustomer, // boolean: if WON and convertToCustomer=true, automatically creates customer
      } = req.body

      const updateData: any = {}
      if (title !== undefined) updateData.title = String(title).trim()
      if (contactName !== undefined) updateData.contactName = String(contactName).trim()
      if (contactEmail !== undefined) updateData.contactEmail = String(contactEmail).trim().toLowerCase()
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone ? String(contactPhone).trim() : null
      if (company !== undefined) updateData.company = company ? String(company).trim() : null
      if (source !== undefined) updateData.source = String(source)
      if (priority !== undefined) updateData.priority = String(priority)
      if (estimatedValue !== undefined) updateData.estimatedValue = Number(estimatedValue) || 0
      if (currency !== undefined) updateData.currency = String(currency)
      if (assignedToId !== undefined) updateData.assignedToId = assignedToId ? Number(assignedToId) : null
      if (customerId !== undefined) updateData.customerId = customerId ? Number(customerId) : null
      if (notes !== undefined) updateData.notes = notes ? String(notes).trim() : null
      if (nextFollowUp !== undefined) updateData.nextFollowUp = nextFollowUp ? new Date(nextFollowUp) : null

      let statusChanged = false
      if (status !== undefined && status !== currentLead.status) {
        updateData.status = String(status)
        statusChanged = true
      }

      // If status changed to WON and convertToCustomer is requested, create or associate customer
      let createdCustomer = null
      if (status === 'WON' && (convertToCustomer || !currentLead.customerId)) {
        // Check if customer exists with email
        const targetEmail = updateData.contactEmail || currentLead.contactEmail
        let existingCust = await prisma.customer.findFirst({
          where: { email: targetEmail },
        })

        if (!existingCust && convertToCustomer) {
          const custCount = await prisma.customer.count()
          const customerCode = `ST-CUST-${String(1001 + custCount)}`
          existingCust = await prisma.customer.create({
            data: {
              customerCode,
              name: updateData.contactName || currentLead.contactName,
              company: updateData.company || currentLead.company,
              email: targetEmail,
              phone: updateData.contactPhone || currentLead.contactPhone,
              status: 'ACTIVE',
              isDemo: currentLead.isDemo,
            },
          })
          createdCustomer = existingCust
        }

        if (existingCust) {
          updateData.customerId = existingCust.id
        }
      }

      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: updateData,
        include: {
          customer: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      })

      // Log activity if status changed
      if (statusChanged) {
        await prisma.leadActivity.create({
          data: {
            leadId,
            userId: user.id,
            type: 'STATUS_CHANGE',
            summary: `Stage changed from ${currentLead.status} to ${updateData.status}`,
            details: `Updated by ${user.name || user.email}${createdCustomer ? `. Converted to Customer [${createdCustomer.customerCode}]` : ''}`,
            isCompleted: true,
          },
        })
      }

      await logAuditAction({
        userId: user.id,
        action: 'LEAD_UPDATED',
        entityType: 'CRM_Lead',
        entityId: leadId,
        details: {
          oldStatus: currentLead.status,
          newStatus: updatedLead.status,
          customerId: updatedLead.customerId,
        },
        req,
      })

      return res.status(200).json({ lead: updatedLead, createdCustomer })
    } catch (err: any) {
      console.error('Error updating CRM lead:', err)
      return res.status(500).json({ error: 'Failed to update lead', details: err.message })
    }
  }

  // DELETE /api/portal/crm/leads/[id]
  if (req.method === 'DELETE') {
    if (!checkModulePermission(user.role, 'CRM', 'delete')) {
      return res.status(403).json({ error: 'Permission denied: Cannot delete CRM lead' })
    }

    try {
      const existing = await prisma.lead.findUnique({ where: { id: leadId } })
      if (!existing) {
        return res.status(404).json({ error: 'CRM Lead not found' })
      }

      await prisma.lead.delete({ where: { id: leadId } })

      await logAuditAction({
        userId: user.id,
        action: 'LEAD_DELETED',
        entityType: 'CRM_Lead',
        entityId: leadId,
        details: { leadCode: existing.leadCode, title: existing.title },
        req,
      })

      return res.status(200).json({ success: true, message: 'CRM Lead deleted successfully' })
    } catch (err: any) {
      console.error('Error deleting CRM lead:', err)
      return res.status(500).json({ error: 'Failed to delete lead', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
