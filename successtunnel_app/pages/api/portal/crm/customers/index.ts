import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  // GET /api/portal/crm/customers
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'CRM', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view customers' })
    }

    try {
      const { search, status, isDemo, page = '1', limit = '50' } = req.query

      const pageNum = Math.max(1, parseInt(String(page), 10) || 1)
      const take = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 50))
      const skip = (pageNum - 1) * take

      const where: any = {}

      if (status && status !== 'ALL') {
        where.status = String(status)
      }

      if (isDemo !== undefined && isDemo !== '') {
        where.isDemo = isDemo === 'true'
      }

      if (search && String(search).trim() !== '') {
        const query = String(search).trim()
        where.OR = [
          { name: { contains: query } },
          { company: { contains: query } },
          { email: { contains: query } },
          { customerCode: { contains: query } },
          { city: { contains: query } },
        ]
      }

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            _count: {
              select: { projects: true, leads: true },
            },
            projects: {
              select: { id: true, projectCode: true, name: true, status: true, progress: true },
              take: 3,
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.customer.count({ where }),
      ])

      return res.status(200).json({
        customers,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
      })
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      return res.status(500).json({ error: 'Failed to fetch customers', details: err.message })
    }
  }

  // POST /api/portal/crm/customers
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'CRM', 'create')) {
      return res.status(403).json({ error: 'Permission denied: Cannot create customer' })
    }

    try {
      const {
        name,
        company,
        email,
        phone,
        address,
        city,
        website,
        status = 'ACTIVE',
        notes,
        isDemo = false,
      } = req.body

      if (!name || !email) {
        return res.status(400).json({ error: 'Customer name and email are required' })
      }

      const cleanEmail = String(email).trim().toLowerCase()

      const existing = await prisma.customer.findFirst({
        where: { email: cleanEmail },
      })

      if (existing) {
        return res.status(409).json({ error: 'A customer with this email already exists', existingId: existing.id })
      }

      const count = await prisma.customer.count()
      const customerCode = `ST-CUST-${String(1001 + count)}`

      const customer = await prisma.customer.create({
        data: {
          customerCode,
          name: String(name).trim(),
          company: company ? String(company).trim() : null,
          email: cleanEmail,
          phone: phone ? String(phone).trim() : null,
          address: address ? String(address).trim() : null,
          city: city ? String(city).trim() : null,
          website: website ? String(website).trim() : null,
          status: String(status),
          notes: notes ? String(notes).trim() : null,
          isDemo: Boolean(isDemo),
        },
      })

      await logAuditAction({
        userId: user.id,
        action: 'CUSTOMER_CREATED',
        entityType: 'CRM_Customer',
        entityId: customer.id,
        details: { code: customer.customerCode, name: customer.name, email: customer.email },
        req,
      })

      return res.status(201).json(customer)
    } catch (err: any) {
      console.error('Error creating customer:', err)
      return res.status(500).json({ error: 'Failed to create customer', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
