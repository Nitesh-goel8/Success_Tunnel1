import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  // GET /api/portal/crm/enquiries
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'CRM', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view enquiries' })
    }

    try {
      const { status, search, page = '1', limit = '50' } = req.query

      const pageNum = Math.max(1, parseInt(String(page), 10) || 1)
      const take = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 50))
      const skip = (pageNum - 1) * take

      const where: any = {}

      if (status && status !== 'ALL') {
        where.status = String(status)
      }

      if (search && String(search).trim() !== '') {
        const query = String(search).trim()
        where.OR = [
          { name: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
          { service: { contains: query } },
          { city: { contains: query } },
        ]
      }

      const [enquiries, total] = await Promise.all([
        prisma.enquiry.findMany({
          where,
          include: {
            leads: {
              select: { id: true, leadCode: true, status: true, title: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.enquiry.count({ where }),
      ])

      const unreadCount = await prisma.enquiry.count({
        where: { status: 'UNREAD' },
      })

      return res.status(200).json({
        enquiries,
        unreadCount,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      })
    } catch (err: any) {
      console.error('Error fetching enquiries:', err)
      return res.status(500).json({ error: 'Failed to fetch enquiries', details: err.message })
    }
  }

  // POST /api/portal/crm/enquiries - Convert enquiry to Lead or update enquiry status
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'CRM', 'create')) {
      return res.status(403).json({ error: 'Permission denied: Cannot manage enquiries' })
    }

    try {
      const { enquiryId, action = 'CONVERT_TO_LEAD', status } = req.body

      if (!enquiryId) {
        return res.status(400).json({ error: 'enquiryId is required' })
      }

      const enquiry = await prisma.enquiry.findUnique({
        where: { id: Number(enquiryId) },
        include: { leads: true },
      })

      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry record not found' })
      }

      if (action === 'UPDATE_STATUS') {
        const updated = await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: { status: String(status) },
        })
        return res.status(200).json(updated)
      }

      // Convert to Lead
      const count = await prisma.lead.count()
      const year = new Date().getFullYear()
      const leadCode = `ST-LEAD-${year}-${String(count + 1).padStart(4, '0')}`

      const newLead = await prisma.lead.create({
        data: {
          leadCode,
          title: enquiry.service ? `Enquiry: ${enquiry.service}` : 'Website Enquiry',
          contactName: enquiry.name,
          contactEmail: enquiry.email.toLowerCase(),
          contactPhone: enquiry.phone,
          source: 'WEBSITE_ENQUIRY',
          status: 'NEW',
          priority: 'MEDIUM',
          enquiryId: enquiry.id,
          notes: [
            enquiry.service ? `Service: ${enquiry.service}` : null,
            enquiry.city ? `City: ${enquiry.city}` : null,
            enquiry.page ? `Page: ${enquiry.page}` : null,
            enquiry.message ? `Message: ${enquiry.message}` : null,
          ]
            .filter(Boolean)
            .join('\n'),
        },
      })

      await prisma.enquiry.update({
        where: { id: enquiry.id },
        data: { status: 'CONVERTED_TO_LEAD' },
      })

      await prisma.leadActivity.create({
        data: {
          leadId: newLead.id,
          userId: user.id,
          type: 'STATUS_CHANGE',
          summary: `Enquiry converted to Lead by ${user.name || user.email}`,
          details: `Enquiry ID #${enquiry.id}`,
        },
      })

      await logAuditAction({
        userId: user.id,
        action: 'ENQUIRY_CONVERTED_TO_LEAD',
        entityType: 'CRM_Lead',
        entityId: newLead.id,
        details: { enquiryId: enquiry.id, leadCode: newLead.leadCode },
        req,
      })

      return res.status(201).json({ success: true, lead: newLead })
    } catch (err: any) {
      console.error('Error converting enquiry:', err)
      return res.status(500).json({ error: 'Failed to process enquiry', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
