import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req: NextApiRequest) {
  const token = getTokenFromReq(req)
  const payload = verifyToken(token as string)
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check auth for writing, but allow GET request to be public so public pages can fetch it if needed.
  if (req.method !== 'GET') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'unauthenticated' })
  }

  if (req.method === 'GET') {
    try {
      const settings = await prisma.siteSetting.findMany()
      const settingsMap = settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value
        return acc;
      }, {} as Record<string, string>)
      return res.json(settingsMap)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = req.body // Expecting an object of key-value pairs
      if (typeof body !== 'object' || body === null) {
        return res.status(400).json({ error: 'body must be a key-value object' })
      }

      // Upsert each setting
      const promises = Object.entries(body).map(([key, value]) => {
        return prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        })
      })

      await Promise.all(promises)
      return res.json({ success: true })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).end()
}
