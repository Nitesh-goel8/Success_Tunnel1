import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('st_client_auth='))
  if (!match) {
    return res.status(401).json({ error: 'Unauthorized client' })
  }

  const token = match.split('=')[1]
  let decoded: any = null
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: 'Invalid session' })
  }

  const email = decoded.email

  try {
    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, email: true, createdAt: true },
    })

    // Fetch user's enquiries
    const enquiries = await prisma.enquiry.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch user's rental payments
    const payments = await prisma.rentalPayment.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({
      user,
      enquiries,
      payments,
    })
  } catch (error: any) {
    console.error('Portal data fetch error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
