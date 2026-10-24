import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  // GET /api/portal/finance/payments
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'FINANCE', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view payments' })
    }

    try {
      const {
        invoiceId,
        customerId,
        projectId,
        paymentMethod,
        isDemo,
        startDate,
        endDate,
        search,
        page = '1',
        limit = '50',
      } = req.query

      const pageNum = Math.max(1, parseInt(String(page), 10) || 1)
      const take = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 50))
      const skip = (pageNum - 1) * take

      const where: any = {}

      if (invoiceId) {
        where.invoiceId = parseInt(String(invoiceId), 10)
      }

      if (customerId) {
        where.customerId = parseInt(String(customerId), 10)
      }

      if (projectId) {
        where.projectId = parseInt(String(projectId), 10)
      }

      if (paymentMethod && paymentMethod !== 'ALL') {
        where.paymentMethod = String(paymentMethod)
      }

      if (isDemo !== undefined && isDemo !== '') {
        where.isDemo = isDemo === 'true'
      }

      if (startDate || endDate) {
        where.paymentDate = {}
        if (startDate) where.paymentDate.gte = new Date(String(startDate))
        if (endDate) where.paymentDate.lte = new Date(String(endDate))
      }

      if (search && String(search).trim() !== '') {
        const q = String(search).trim()
        where.OR = [
          { paymentNumber: { contains: q } },
          { transactionReference: { contains: q } },
          { customer: { name: { contains: q } } },
          { customer: { company: { contains: q } } },
          { invoice: { invoiceNumber: { contains: q } } },
        ]
      }

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          include: {
            customer: {
              select: { id: true, name: true, customerCode: true, company: true },
            },
            invoice: {
              select: { id: true, invoiceNumber: true, totalAmount: true, status: true },
            },
            project: {
              select: { id: true, name: true, projectCode: true },
            },
            recordedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { paymentDate: 'desc' },
          skip,
          take,
        }),
        prisma.payment.count({ where }),
      ])

      const totalReceivedRevenue = payments
        .filter((p) => p.status === 'COMPLETED')
        .reduce((acc, p) => acc + p.amount, 0)

      return res.status(200).json({
        payments,
        pagination: {
          total,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(total / take),
        },
        aggregates: {
          totalReceivedRevenue: Math.round(totalReceivedRevenue * 100) / 100,
        },
      })
    } catch (err: any) {
      console.error('Failed to list payments:', err)
      return res.status(500).json({ error: 'Failed to retrieve payments', details: err.message })
    }
  }

  // POST /api/portal/finance/payments
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'FINANCE', 'create')) {
      return res.status(403).json({ error: 'Permission denied: Cannot record payments' })
    }

    try {
      const {
        invoiceId,
        customerId,
        projectId,
        amount,
        currency = 'INR',
        paymentDate = new Date(),
        paymentMethod = 'BANK_TRANSFER',
        transactionReference,
        notes,
        receiptUrl,
        isDemo = false,
      } = req.body

      const numericAmount = parseFloat(amount)
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ error: 'Payment amount must be a positive number' })
      }

      const roundedAmount = Math.round(numericAmount * 100) / 100

      let targetCustomerId = customerId ? parseInt(String(customerId), 10) : null
      let targetProjectId = projectId ? parseInt(String(projectId), 10) : null
      let targetInvoice: any = null

      if (invoiceId) {
        const invId = parseInt(String(invoiceId), 10)
        targetInvoice = await prisma.invoice.findUnique({
          where: { id: invId },
          include: { payments: { where: { status: 'COMPLETED' } } },
        })

        if (!targetInvoice) {
          return res.status(404).json({ error: 'Invoice not found' })
        }

        if (targetInvoice.status === 'VOID') {
          return res.status(400).json({ error: 'Cannot record payment for a voided invoice' })
        }

        // Auto-inherit customer and project from invoice
        if (!targetCustomerId && targetInvoice.customerId) {
          targetCustomerId = targetInvoice.customerId
        }
        if (!targetProjectId && targetInvoice.projectId) {
          targetProjectId = targetInvoice.projectId
        }
      }

      const count = await prisma.payment.count()
      const year = new Date().getFullYear()
      const paymentNumber = `ST-PAY-${year}-${String(count + 1).padStart(4, '0')}`

      const payment = await prisma.payment.create({
        data: {
          paymentNumber,
          invoiceId: targetInvoice ? targetInvoice.id : null,
          customerId: targetCustomerId,
          projectId: targetProjectId,
          amount: roundedAmount,
          currency: String(currency),
          paymentDate: new Date(paymentDate),
          paymentMethod: String(paymentMethod),
          transactionReference: transactionReference ? String(transactionReference).trim() : null,
          status: 'COMPLETED',
          receiptUrl: receiptUrl ? String(receiptUrl).trim() : null,
          notes: notes ? String(notes).trim() : null,
          recordedById: user.id,
          isDemo: targetInvoice ? targetInvoice.isDemo : Boolean(isDemo),
        },
        include: {
          invoice: true,
          customer: true,
        },
      })

      // If payment is linked to an invoice, recompute invoice status
      if (targetInvoice) {
        const previousPaid = targetInvoice.payments.reduce((acc: number, p: any) => acc + p.amount, 0)
        const totalPaidNow = Math.round((previousPaid + roundedAmount) * 100) / 100

        let newInvoiceStatus = targetInvoice.status
        if (totalPaidNow >= targetInvoice.totalAmount) {
          newInvoiceStatus = 'PAID'
        } else if (totalPaidNow > 0) {
          newInvoiceStatus = 'PARTIALLY_PAID'
        }

        await prisma.invoice.update({
          where: { id: targetInvoice.id },
          data: { status: newInvoiceStatus },
        })
      }

      await logAuditAction({
        userId: user.id,
        action: 'PAYMENT_RECORDED',
        entityType: 'Payment',
        entityId: payment.id,
        details: {
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
          invoiceNumber: targetInvoice?.invoiceNumber,
          transactionRef: payment.transactionReference,
        },
        req,
      })

      return res.status(201).json(payment)
    } catch (err: any) {
      console.error('Failed to record payment:', err)
      return res.status(500).json({ error: 'Failed to record payment', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
