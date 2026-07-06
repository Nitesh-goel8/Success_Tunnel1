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
    const services = await prisma.service.findMany({
      include: { subservices: true },
      orderBy: { id: 'asc' }
    })
    return res.json(services)
  }

  if (req.method === 'POST') {
    const { title, slug, excerpt, content, icon, serviceId } = req.body

    // Subservice creation
    if (serviceId) {
      if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required for subservice' })
      try {
        const sub = await prisma.subservice.create({
          data: {
            title,
            slug,
            content,
            serviceId: parseInt(serviceId, 10)
          }
        })
        return res.status(201).json(sub)
      } catch (err: any) {
        if (err.code === 'P2002') return res.status(400).json({ error: 'Subservice slug already exists' })
        console.error(err)
        return res.status(500).json({ error: 'Database error' })
      }
    }

    // Core Service creation
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' })
    try {
      const s = await prisma.service.create({
        data: { title, slug, excerpt, content, icon }
      })
      return res.status(201).json(s)
    } catch (err: any) {
      if (err.code === 'P2002') return res.status(400).json({ error: 'Service slug already exists' })
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'PUT') {
    const { id, title, slug, excerpt, content, icon, subserviceId } = req.body

    // Subservice update
    if (subserviceId) {
      if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' })
      try {
        const sub = await prisma.subservice.update({
          where: { id: parseInt(subserviceId, 10) },
          data: { title, slug, content }
        })
        return res.json(sub)
      } catch (err: any) {
        console.error(err)
        return res.status(500).json({ error: 'Database error' })
      }
    }

    // Core Service update
    if (!id) return res.status(400).json({ error: 'ID is required for editing' })
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' })
    try {
      const s = await prisma.service.update({
        where: { id: parseInt(id, 10) },
        data: { title, slug, excerpt, content, icon }
      })
      return res.json(s)
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'DELETE') {
    const { id, subserviceId } = req.body

    // Subservice deletion
    if (subserviceId) {
      try {
        await prisma.subservice.delete({ where: { id: parseInt(subserviceId, 10) } })
        return res.json({ ok: true })
      } catch (err: any) {
        console.error(err)
        return res.status(500).json({ error: 'Database error' })
      }
    }

    // Core Service deletion
    if (!id) return res.status(400).json({ error: 'ID is required for deletion' })
    try {
      // Manually delete dependent subservices first
      await prisma.subservice.deleteMany({ where: { serviceId: parseInt(id, 10) } })
      await prisma.service.delete({ where: { id: parseInt(id, 10) } })
      return res.json({ ok: true })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  return res.status(405).end()
}
