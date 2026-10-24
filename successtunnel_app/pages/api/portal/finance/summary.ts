import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, checkModulePermission } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  if (!checkModulePermission(user.role, 'FINANCE', 'view')) {
    return res.status(403).json({ error: 'Permission denied: Cannot view financial summary' })
  }

  try {
    const { isDemo, startDate, endDate } = req.query

    const wherePayment: any = { status: 'COMPLETED' }
    const whereInvoice: any = {}
    const whereExpense: any = { status: { in: ['APPROVED', 'REIMBURSED'] } }

    if (isDemo !== undefined && isDemo !== '') {
      const demoBool = isDemo === 'true'
      wherePayment.isDemo = demoBool
      whereInvoice.isDemo = demoBool
      whereExpense.isDemo = demoBool
    }

    if (startDate || endDate) {
      wherePayment.paymentDate = {}
      whereInvoice.issueDate = {}
      whereExpense.expenseDate = {}
      if (startDate) {
        wherePayment.paymentDate.gte = new Date(String(startDate))
        whereInvoice.issueDate.gte = new Date(String(startDate))
        whereExpense.expenseDate.gte = new Date(String(startDate))
      }
      if (endDate) {
        wherePayment.paymentDate.lte = new Date(String(endDate))
        whereInvoice.issueDate.lte = new Date(String(endDate))
        whereExpense.expenseDate.lte = new Date(String(endDate))
      }
    }

    const [payments, invoices, expenses] = await Promise.all([
      prisma.payment.findMany({
        where: wherePayment,
        select: { id: true, amount: true, paymentDate: true, paymentMethod: true, isDemo: true, invoiceId: true },
      }),
      prisma.invoice.findMany({
        where: whereInvoice,
        select: { id: true, invoiceNumber: true, totalAmount: true, status: true, issueDate: true, isDemo: true },
      }),
      prisma.expense.findMany({
        where: whereExpense,
        select: { id: true, amount: true, category: true, status: true, expenseDate: true, isDemo: true },
      }),
    ])

    // INVARIANT ENFORCEMENT:
    // Revenue is strictly the sum of verified COMPLETED payments.
    // Unpaid invoices are NEVER counted as received revenue!
    const receivedRevenue = payments.reduce((acc, p) => acc + p.amount, 0)
    const invoicedReceivables = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)

    // Payments linked to invoices
    const paymentsOnInvoices = payments
      .filter((p) => p.invoiceId !== null)
      .reduce((acc, p) => acc + p.amount, 0)
    const outstandingReceivables = Math.max(0, invoicedReceivables - paymentsOnInvoices)

    const approvedExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0)
    const netCashFlow = receivedRevenue - approvedExpenses

    // Monthly aggregation
    const monthlyData: { [key: string]: { revenue: number; invoiced: number; expenses: number } } = {
      '2026-08': { revenue: 0, invoiced: 0, expenses: 0 },
      '2026-09': { revenue: 0, invoiced: 0, expenses: 0 },
      '2026-10': { revenue: 0, invoiced: 0, expenses: 0 },
    }

    payments.forEach((p) => {
      const monthKey = new Date(p.paymentDate).toISOString().slice(0, 7)
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, invoiced: 0, expenses: 0 }
      monthlyData[monthKey].revenue += p.amount
    })

    invoices.forEach((inv) => {
      const monthKey = new Date(inv.issueDate).toISOString().slice(0, 7)
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, invoiced: 0, expenses: 0 }
      monthlyData[monthKey].invoiced += inv.totalAmount
    })

    expenses.forEach((exp) => {
      const monthKey = new Date(exp.expenseDate).toISOString().slice(0, 7)
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, invoiced: 0, expenses: 0 }
      monthlyData[monthKey].expenses += exp.amount
    })

    // Expenses by category
    const expensesByCategory: { [cat: string]: number } = {}
    expenses.forEach((e) => {
      expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount
    })

    return res.status(200).json({
      currency: 'INR',
      summary: {
        receivedRevenue: Math.round(receivedRevenue * 100) / 100,
        invoicedReceivables: Math.round(invoicedReceivables * 100) / 100,
        outstandingReceivables: Math.round(outstandingReceivables * 100) / 100,
        approvedExpenses: Math.round(approvedExpenses * 100) / 100,
        netCashFlow: Math.round(netCashFlow * 100) / 100,
      },
      counts: {
        paymentsCount: payments.length,
        invoicesCount: invoices.length,
        expensesCount: expenses.length,
      },
      monthlyData,
      expensesByCategory,
      auditNote: 'Invoiced amounts reflect contractual accounts receivable. Revenue calculations strictly recognize verified received cash payments.',
    })
  } catch (err: any) {
    console.error('Failed to compute financial summary:', err)
    return res.status(500).json({ error: 'Failed to generate financial summary', details: err.message })
  }
}
