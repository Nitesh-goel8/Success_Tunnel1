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
      const [totalEnquiries, totalServices, totalProperties, totalBlogs] = await Promise.all([
        prisma.enquiry.count(),
        prisma.service.count(),
        prisma.property.count(),
        prisma.blogPost.count(),
      ])
      const totalEducationContent = await prisma.educationContent.count()

      // Fetch all payments to calculate revenue timeline
      const payments = await prisma.rentalPayment.findMany({
        where: { status: { in: ['captured', 'paid'] } },
        select: { amount: true, createdAt: true },
      })

      // Group payments by month (last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyRevenueMap: { [key: string]: number } = {}
      
      // Initialize last 6 months with 0
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`
        monthlyRevenueMap[monthLabel] = 0
      }

      payments.forEach(p => {
        const date = new Date(p.createdAt)
        const monthLabel = `${months[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`
        if (monthlyRevenueMap[monthLabel] !== undefined) {
          monthlyRevenueMap[monthLabel] += p.amount
        }
      })

      const revenueTimeline = Object.keys(monthlyRevenueMap).map(label => ({
        label,
        value: monthlyRevenueMap[label]
      }))

      // Group enquiries by category
      const enquiries = await prisma.enquiry.findMany({
        select: { service: true }
      })

      const categoriesMap: { [key: string]: number } = {
        'Rental Space': 0,
        'Real Estate': 0,
        'Consultancy': 0,
        'Finance': 0,
        'Education': 0,
        'Investment': 0,
        'Other': 0,
      }

      enquiries.forEach(e => {
        const cat = e.service || 'Other'
        if (categoriesMap[cat] !== undefined) {
          categoriesMap[cat]++
        } else {
          categoriesMap['Other']++
        }
      })

      const enquiryCategories = Object.keys(categoriesMap).map(label => ({
        label,
        value: categoriesMap[label]
      }))

      return res.json({
        totalEnquiries,
        totalServices,
        totalProperties,
        totalBlogs,
        totalEducationContent,
        revenueTimeline,
        enquiryCategories,
      })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).end()
}
