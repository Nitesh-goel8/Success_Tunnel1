import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const [notifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: { userId: auth.id },
          orderBy: { createdAt: 'desc' },
          take: 30,
        }),
        prisma.notification.count({
          where: {
            userId: auth.id,
            isRead: false,
          },
        }),
      ])

      return res.status(200).json({
        notifications,
        unreadCount,
      })
    } catch (error: any) {
      console.error('Failed to retrieve notifications:', error)
      return res.status(500).json({ error: 'Failed to retrieve notifications' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, markAllRead } = req.body || {}

      if (markAllRead) {
        const updateResult = await prisma.notification.updateMany({
          where: {
            userId: auth.id,
            isRead: false,
          },
          data: {
            isRead: true,
          },
        })
        return res.status(200).json({ ok: true, count: updateResult.count })
      }

      if (id && typeof id === 'number') {
        const updated = await prisma.notification.updateMany({
          where: {
            id,
            userId: auth.id,
          },
          data: {
            isRead: true,
          },
        })
        return res.status(200).json({ ok: true, count: updated.count })
      }

      return res.status(400).json({ error: 'Specify an id to mark as read or set markAllRead: true' })
    } catch (error: any) {
      console.error('Failed to update notification status:', error)
      return res.status(500).json({ error: 'Failed to update notification' })
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
