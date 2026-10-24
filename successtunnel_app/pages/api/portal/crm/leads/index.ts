import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  // GET /api/portal/crm/leads
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'CRM', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view CRM leads' })
    }

    try {
      const {
        status,
        search,
        priority,
        source,
        isDemo,
        page = '1',
        limit = '50',
      } = req.query

      const pageNum = Math.max(1, parseInt(String(page), 10) || 1)
      const take = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 50))
      const skip = (pageNum - 1) * take

      const where: any = {}

      if (status && status !== 'ALL') {
        where.status = String(status)
      }

      if (priority && priority !== 'ALL') {
        where.priority = String(priority)
      }

      if (source && source !== 'ALL') {
        where.source = String(source)
      }

      if (isDemo !== undefined && isDemo !== '') {
        where.isDemo = isDemo === 'true'
      }

      if (search && String(search).trim() !== '') {
        const query = String(search).trim()
        where.OR = [
          { title: { contains: query } },
          { contactName: { contains: query } },
          { contactEmail: { contains: query } },
          { company: { contains: query } },
          { leadCode: { contains: query } },
        ]
      }

      const [leads, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          include: {
            customer: {
              select: { id: true, name: true, customerCode: true, company: true },
            },
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
            enquiry: {
              select: { id: true, service: true, createdAt: true },
            },
            _count: {
              select: { activities: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.lead.count({ where }),
      ])

      // Aggregates for pipeline stats
      const pipelineStats = await prisma.lead.groupBy({
        by: ['status'],
        _count: { _all: true },
        _sum: { estimatedValue: true },
      })

      return res.status(200).json({
        leads,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
        pipelineStats,
      })
    } catch (err: any) {
      console.error('Error fetching CRM leads:', err)
      return res.status(500).json({ error: 'Failed to fetch leads', details: err.message })
    }
  }

  // POST /api/portal/crm/leads
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'CRM', 'create')) {
      return res.status(403).json({ error: 'Permission denied: Cannot create CRM leads' })
    }

    try {
      const {
        title,
        contactName,
        contactEmail,
        contactPhone,
        company,
        source = 'DIRECT',
        status = 'NEW',
        priority = 'MEDIUM',
        estimatedValue = 0,
        currency = 'INR',
        assignedToId,
        customerId,
        notes,
        nextFollowUp,
        isDemo = false,
      } = req.body

      if (!title || !contactName || !contactEmail) {
        return res.status(400).json({ error: 'Title, contact name, and contact email are required' })
      }

      // Generate unique leadCode
      const count = await prisma.lead.count()
      const year = new Date().getFullYear()
      const leadCode = `ST-LEAD-${year}-${String(count + 1).padStart(4, '0')}`

      const newLead = await prisma.lead.create({
        data: {
          leadCode,
          title: String(title).trim(),
          contactName: String(contactName).trim(),
          contactEmail: String(contactEmail).trim().toLowerCase(),
          contactPhone: contactPhone ? String(contactPhone).trim() : null,
          company: company ? String(company).trim() : null,
          source: String(source),
          status: String(status),
          priority: String(priority),
          estimatedValue: Number(estimatedValue) || 0,
          currency: String(currency),
          assignedToId: assignedToId ? Number(assignedToId) : null,
          customerId: customerId ? Number(customerId) : null,
          notes: notes ? String(notes).trim() : null,
          nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
          isDemo: Boolean(isDemo),
        },
        include: {
          customer: true,
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      })

      // Add initial lead activity
      await prisma.leadActivity.create({
        data: {
          leadId: newLead.id,
          userId: user.id,
          type: 'NOTE',
          summary: `Lead created manually by ${user.name || user.email}`,
          details: `Initial status: ${newLead.status} | Priority: ${newLead.priority}`,
          isCompleted: true,
        },
      })

      await logAuditAction({
        userId: user.id,
        action: 'LEAD_CREATED',
        entityType: 'CRM_Lead',
        entityId: newLead.id,
        details: { code: newLead.leadCode, title: newLead.title, status: newLead.status },
        req,
      })

      return res.status(201).json(newLead)
    } catch (err: any) {
      console.error('Error creating CRM lead:', err)
      return res.status(500).json({ error: 'Failed to create lead', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
