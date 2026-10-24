import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  // GET /api/portal/finance/invoices
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'FINANCE', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view invoices' })
    }

    try {
      const {
        status,
        customerId,
        projectId,
        search,
        isDemo,
        startDate,
        endDate,
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

      if (customerId) {
        where.customerId = parseInt(String(customerId), 10)
      }

      if (projectId) {
        where.projectId = parseInt(String(projectId), 10)
      }

      if (isDemo !== undefined && isDemo !== '') {
        where.isDemo = isDemo === 'true'
      }

      if (startDate || endDate) {
        where.issueDate = {}
        if (startDate) where.issueDate.gte = new Date(String(startDate))
        if (endDate) where.issueDate.lte = new Date(String(endDate))
      }

      if (search && String(search).trim() !== '') {
        const q = String(search).trim()
        where.OR = [
          { invoiceNumber: { contains: q } },
          { customer: { name: { contains: q } } },
          { customer: { company: { contains: q } } },
          { project: { name: { contains: q } } },
        ]
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            customer: {
              select: { id: true, name: true, customerCode: true, company: true, email: true },
            },
            project: {
              select: { id: true, name: true, projectCode: true },
            },
            payments: {
              where: { status: 'COMPLETED' },
              select: { id: true, amount: true, paymentDate: true, paymentMethod: true },
            },
          },
          orderBy: { issueDate: 'desc' },
          skip,
          take,
        }),
        prisma.invoice.count({ where }),
      ])

      // Calculate aggregate totals
      const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)
      const totalCollected = invoices.reduce(
        (acc, inv) => acc + inv.payments.reduce((pAcc, p) => pAcc + p.amount, 0),
        0
      )
      const totalPending = Math.max(0, totalInvoiced - totalCollected)

      return res.status(200).json({
        invoices: invoices.map((inv) => {
          const paidAmount = inv.payments.reduce((acc, p) => acc + p.amount, 0)
          return {
            ...inv,
            paidAmount,
            remainingBalance: Math.max(0, Math.round((inv.totalAmount - paidAmount) * 100) / 100),
          }
        }),
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
        aggregates: {
          totalInvoiced: Math.round(totalInvoiced * 100) / 100,
          totalCollected: Math.round(totalCollected * 100) / 100,
          totalPending: Math.round(totalPending * 100) / 100,
        },
      })
    } catch (err: any) {
      console.error('Failed to list invoices:', err)
      return res.status(500).json({ error: 'Failed to retrieve invoices', details: err.message })
    }
  }

  // POST /api/portal/finance/invoices
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'FINANCE', 'create')) {
      return res.status(403).json({ error: 'Permission denied: Cannot create invoices' })
    }

    try {
      const {
        customerId,
        projectId,
        issueDate = new Date(),
        dueDate,
        items, // array of { description: string, quantity: number, unitPrice: number }
        taxRate = 18.0,
        notes,
        terms,
        currency = 'INR',
        isDemo = false,
      } = req.body

      if (!dueDate) {
        return res.status(400).json({ error: 'Invoice due date is required' })
      }

      let subtotal = 0
      let parsedItems: any[] = []

      if (Array.isArray(items) && items.length > 0) {
        parsedItems = items.map((it) => {
          const qty = Math.max(1, Number(it.quantity) || 1)
          const price = Math.max(0, Number(it.unitPrice) || 0)
          const amount = Math.round(qty * price * 100) / 100
          subtotal += amount
          return {
            description: String(it.description || 'Consultancy Service').trim(),
            quantity: qty,
            unitPrice: price,
            amount,
          }
        })
      } else if (req.body.subtotal) {
        subtotal = parseFloat(req.body.subtotal) || 0
      }

      if (subtotal <= 0) {
        return res.status(400).json({ error: 'Invoice subtotal must be greater than zero' })
      }

      const numericTaxRate = Number(taxRate) >= 0 ? Number(taxRate) : 18.0
      const taxAmount = Math.round(((subtotal * numericTaxRate) / 100) * 100) / 100
      const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100

      const count = await prisma.invoice.count()
      const year = new Date().getFullYear()
      const invoiceNumber = `ST-INV-${year}-${String(count + 1).padStart(4, '0')}`

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          customerId: customerId ? parseInt(customerId, 10) : null,
          projectId: projectId ? parseInt(projectId, 10) : null,
          issueDate: new Date(issueDate),
          dueDate: new Date(dueDate),
          subtotal,
          taxRate: numericTaxRate,
          taxAmount,
          totalAmount,
          currency: String(currency),
          status: 'ISSUED',
          items: parsedItems.length > 0 ? JSON.stringify(parsedItems) : null,
          notes: notes ? String(notes).trim() : null,
          terms: terms ? String(terms).trim() : 'Net 30 days. Late payments subject to statutory interest.',
          isDemo: Boolean(isDemo),
        },
        include: {
          customer: true,
          project: true,
        },
      })

      await logAuditAction({
        userId: user.id,
        action: 'INVOICE_ISSUED',
        entityType: 'Invoice',
        entityId: invoice.id,
        details: {
          invoiceNumber: invoice.invoiceNumber,
          totalAmount: invoice.totalAmount,
          customerId: invoice.customerId,
        },
        req,
      })

      return res.status(201).json(invoice)
    } catch (err: any) {
      console.error('Failed to create invoice:', err)
      return res.status(500).json({ error: 'Failed to create invoice', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
