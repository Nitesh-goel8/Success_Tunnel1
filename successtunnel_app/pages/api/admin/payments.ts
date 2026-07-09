import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req: NextApiRequest) {
  const token = getTokenFromReq(req)
  const payload = verifyToken(token as string)
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireAuth(req)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })

  if (req.method === 'GET') {
    try {
      const exportCsv = req.query.export === 'csv'
      const statusFilter = req.query.status as string

      const where: any = {}
      if (statusFilter) {
        where.status = statusFilter
      }

      const payments = await prisma.rentalPayment.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      if (exportCsv) {
        const header = 'id,orderId,paymentId,customerName,customerEmail,customerPhone,rentalTitle,amount,status,createdAt\n'
        const rows = payments.map(p => 
          `${p.id},"${p.orderId}","${p.paymentId || ''}","${p.customerName}","${p.customerEmail}","${p.customerPhone}","${p.rentalTitle}",${p.amount / 100},"${p.status}","${p.createdAt.toISOString()}"`
        ).join('\n')

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="rental-payments.csv"')
        return res.send(header + rows)
      }

      return res.json(payments)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).end()
}
