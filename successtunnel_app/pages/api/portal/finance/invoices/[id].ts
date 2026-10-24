import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  const { id } = req.query
  const invoiceId = parseInt(String(id), 10)

  if (isNaN(invoiceId)) {
    return res.status(400).json({ error: 'Invalid invoice ID' })
  }

  // GET /api/portal/finance/invoices/[id]
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'FINANCE', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view invoice' })
    }

    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          customer: true,
          project: {
            select: { id: true, name: true, projectCode: true },
          },
          payments: {
            include: {
              recordedBy: { select: { id: true, name: true, email: true } },
            },
            orderBy: { paymentDate: 'desc' },
          },
        },
      })

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      const totalPaid = invoice.payments
        .filter((p) => p.status === 'COMPLETED')
        .reduce((acc, p) => acc + p.amount, 0)
      const remainingBalance = Math.max(0, Math.round((invoice.totalAmount - totalPaid) * 100) / 100)

      let parsedItems = []
      if (invoice.items) {
        try {
          parsedItems = JSON.parse(invoice.items)
        } catch (e) {
          parsedItems = []
        }
      }

      return res.status(200).json({
        ...invoice,
        lineItems: parsedItems,
        totalPaid: Math.round(totalPaid * 100) / 100,
        remainingBalance,
      })
    } catch (err: any) {
      console.error('Failed to get invoice:', err)
      return res.status(500).json({ error: 'Failed to retrieve invoice', details: err.message })
    }
  }

  // PUT / PATCH /api/portal/finance/invoices/[id]
  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!checkModulePermission(user.role, 'FINANCE', 'edit')) {
      return res.status(403).json({ error: 'Permission denied: Cannot edit invoice' })
    }

    try {
      const existing = await prisma.invoice.findUnique({ where: { id: invoiceId } })
      if (!existing) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      const { status, dueDate, notes, terms } = req.body

      const updateData: any = {}
      if (status !== undefined) {
        if (!['DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID'].includes(status)) {
          return res.status(400).json({ error: 'Invalid invoice status' })
        }
        updateData.status = status
      }
      if (dueDate !== undefined) updateData.dueDate = new Date(dueDate)
      if (notes !== undefined) updateData.notes = String(notes).trim()
      if (terms !== undefined) updateData.terms = String(terms).trim()

      const updated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: updateData,
      })

      await logAuditAction({
        userId: user.id,
        action: 'INVOICE_UPDATED',
        entityType: 'Invoice',
        entityId: invoiceId,
        details: { invoiceNumber: existing.invoiceNumber, updates: updateData },
        req,
      })

      return res.status(200).json(updated)
    } catch (err: any) {
      console.error('Failed to update invoice:', err)
      return res.status(500).json({ error: 'Failed to update invoice', details: err.message })
    }
  }

  // DELETE /api/portal/finance/invoices/[id]
  if (req.method === 'DELETE') {
    if (!checkModulePermission(user.role, 'FINANCE', 'delete')) {
      return res.status(403).json({ error: 'Permission denied: Cannot delete invoice' })
    }

    try {
      const existing = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { _count: { select: { payments: true } } },
      })

      if (!existing) {
        return res.status(404).json({ error: 'Invoice not found' })
      }

      if (existing._count.payments > 0) {
        return res.status(400).json({
          error: 'Cannot delete invoice with recorded payments. Void the invoice instead.',
        })
      }

      await prisma.invoice.delete({ where: { id: invoiceId } })

      await logAuditAction({
        userId: user.id,
        action: 'INVOICE_DELETED',
        entityType: 'Invoice',
        entityId: invoiceId,
        details: { invoiceNumber: existing.invoiceNumber },
        req,
      })

      return res.status(200).json({ success: true, message: 'Invoice deleted successfully' })
    } catch (err: any) {
      console.error('Failed to delete invoice:', err)
      return res.status(500).json({ error: 'Failed to delete invoice', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
