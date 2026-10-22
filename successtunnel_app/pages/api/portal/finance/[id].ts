import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const expenseId = parseInt(req.query.id as string)
  if (isNaN(expenseId)) {
    return res.status(400).json({ error: 'Invalid expense identifier' })
  }

  if (req.method === 'PUT') {
    const isApprover =
      auth.role === 'super_admin' || auth.role === 'finance_admin' || auth.role === 'admin'
    if (!isApprover) {
      return res.status(403).json({ error: 'Only Finance Administrators can approve or reimburse expenses' })
    }

    const { status, reviewNotes } = req.body // "APPROVED", "REJECTED", "REIMBURSED"

    if (!['APPROVED', 'REJECTED', 'REIMBURSED', 'UNDER_REVIEW'].includes(status)) {
      return res.status(400).json({ error: 'Invalid expense review status' })
    }

    try {
      const expense = await prisma.expense.findUnique({
        where: { id: expenseId },
        include: { user: { select: { id: true, name: true } } },
      })

      if (!expense) {
        return res.status(404).json({ error: 'Expense claim not found' })
      }

      const updated = await prisma.expense.update({
        where: { id: expenseId },
        data: {
          status,
          reviewedById: auth.id,
          reviewNotes: reviewNotes ? reviewNotes.trim() : null,
        },
      })

      // Send in-app notification
      await prisma.notification.create({
        data: {
          userId: expense.userId,
          title: `Expense Claim ${status}`,
          message: `Your ${expense.currency} ${expense.amount} claim for "${expense.description}" was marked as ${status.toLowerCase()} by Finance.`,
          type: 'EXPENSE',
          link: '/portal/finance',
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: `EXPENSE_${status}`,
        entityType: 'Expense',
        entityId: expense.id,
        details: { amount: expense.amount, status, reviewNotes },
        req,
      })

      return res.status(200).json({ ok: true, expense: updated })
    } catch (error: any) {
      console.error('Failed to update expense:', error)
      return res.status(500).json({ error: error.message || 'Failed to update expense' })
    }
  }

  res.setHeader('Allow', ['PUT'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
