import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const isFinanceOrAdmin =
        auth.role === 'super_admin' || auth.role === 'finance_admin' || auth.role === 'admin'

      const where: any = {}
      if (!isFinanceOrAdmin) {
        where.userId = auth.id
      }

      const expenses = await prisma.expense.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, department: { select: { name: true } } },
          },
          project: {
            select: { id: true, name: true, projectCode: true },
          },
          reviewedBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json(expenses)
    } catch (error) {
      console.error('Failed to list expenses:', error)
      return res.status(500).json({ error: 'Failed to retrieve expenses' })
    }
  }

  if (req.method === 'POST') {
    const {
      category,
      amount,
      currency,
      description,
      projectId,
      receiptUrl,
    } = req.body

    if (!category || !amount || !description) {
      return res.status(400).json({ error: 'Category, amount, and description are required' })
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' })
    }

    try {
      const expense = await prisma.expense.create({
        data: {
          userId: auth.id,
          projectId: projectId ? parseInt(projectId) : null,
          category: category.toUpperCase(),
          amount: parsedAmount,
          currency: currency || 'INR',
          description: description.trim(),
          receiptUrl: receiptUrl?.trim() || null,
          status: 'SUBMITTED',
          isDemo: false,
        },
        include: {
          user: { select: { name: true } },
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'EXPENSE_SUBMITTED',
        entityType: 'Expense',
        entityId: expense.id,
        details: { amount: parsedAmount, category: expense.category },
        req,
      })

      return res.status(201).json({ ok: true, expense })
    } catch (error: any) {
      console.error('Failed to create expense:', error)
      return res.status(500).json({ error: error.message || 'Failed to submit expense claim' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
