import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'
import { PRIVATE_SITE_SETTING_KEYS, PUBLIC_SITE_SETTING_KEYS } from '../../../lib/siteSettings'

function requireAuth(req: NextApiRequest) {
  const token = getTokenFromReq(req)
  const payload = verifyToken(token as string)
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireAuth(req)
  if (req.method !== 'GET' && !user) {
    return res.status(401).json({ error: 'unauthenticated' })
  }

  if (req.method === 'GET') {
    try {
      const settings = await prisma.siteSetting.findMany()
      const allowedKeys = new Set<string>(user ? [...PUBLIC_SITE_SETTING_KEYS, ...PRIVATE_SITE_SETTING_KEYS] : PUBLIC_SITE_SETTING_KEYS)
      const settingsMap = settings.reduce((acc, curr) => {
        if (allowedKeys.has(curr.key)) {
          acc[curr.key] = curr.value
        }
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

      const allowedKeys = new Set<string>([...PUBLIC_SITE_SETTING_KEYS, ...PRIVATE_SITE_SETTING_KEYS])
      const entries = Object.entries(body).filter(([key]) => allowedKeys.has(key))
      if (entries.length === 0) {
        return res.status(400).json({ error: 'no valid settings provided' })
      }

      const promises = entries.map(([key, value]) => {
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
