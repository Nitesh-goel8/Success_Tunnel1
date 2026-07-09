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

      return res.json({
        totalEnquiries,
        totalServices,
        totalProperties,
        totalBlogs,
      })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).end()
}
