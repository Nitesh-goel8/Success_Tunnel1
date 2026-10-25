import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  try {
    let user: any = null
    try {
      user = await prisma.user.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          status: true,
          avatarUrl: true,
          lastLoginAt: true,
          createdAt: true,
          department: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          employeeProfile: {
            select: {
              id: true,
              employeeCode: true,
              designation: true,
              workLocation: true,
              employmentType: true,
              joiningDate: true,
              status: true,
              isDemo: true,
            },
          },
        },
      })
    } catch (e: any) {
      console.warn('Full user profile query failed, using base user fields:', e?.message)
      user = await prisma.user.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          status: true,
          avatarUrl: true,
          lastLoginAt: true,
          createdAt: true,
        },
      })
    }

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    let unreadNotificationsCount = 0
    try {
      unreadNotificationsCount = await prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      })
    } catch (e) {}

    return res.status(200).json({
      user,
      unreadNotificationsCount,
    })
  } catch (error: any) {
    console.error('Error fetching current user:', error)
    return res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}
