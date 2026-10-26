import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  // Cache user profile for 15s to make sub-page tab navigation instant without re-querying DB
  res.setHeader('Cache-Control', 'private, max-age=15, stale-while-revalidate=30')

  try {
    const [userResult, unreadCountResult] = await Promise.allSettled([
      prisma.user.findUnique({
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
      }),
      prisma.notification.count({
        where: {
          userId: auth.id,
          isRead: false,
        },
      }),
    ])

    let user: any = userResult.status === 'fulfilled' ? userResult.value : null
    const unreadNotificationsCount = unreadCountResult.status === 'fulfilled' ? unreadCountResult.value : 0

    // Fallback if full join fails
    if (!user) {
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
          },
        })
      } catch (e) {}
    }

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    return res.status(200).json({
      user,
      unreadNotificationsCount,
    })
  } catch (error: any) {
    console.error('Error fetching current user:', error)
    return res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}
