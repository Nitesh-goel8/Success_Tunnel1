import { prisma } from './prisma'

export interface CreateNotificationInput {
  userId: number
  title: string
  message: string
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT'
  link?: string | null
}

/**
 * Dispatches a database-backed notification to an individual user.
 */
export async function sendNotification(input: CreateNotificationInput) {
  try {
    return await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type || 'INFO',
        link: input.link || null,
        isRead: false,
      },
    })
  } catch (err) {
    console.error('Failed to dispatch notification:', err)
    return null
  }
}

/**
 * Dispatches broadcast notifications to all users with specific roles (e.g. HR Admin, Super Admin).
 */
export async function broadcastNotificationToRoles(
  roles: string[],
  notification: Omit<CreateNotificationInput, 'userId'>
) {
  try {
    const recipients = await prisma.user.findMany({
      where: { role: { in: roles } },
      select: { id: true },
    })

    if (recipients.length === 0) return []

    const creations = recipients.map((r) =>
      prisma.notification.create({
        data: {
          userId: r.id,
          title: notification.title,
          message: notification.message,
          type: notification.type || 'INFO',
          link: notification.link || null,
          isRead: false,
        },
      })
    )

    return await prisma.$transaction(creations)
  } catch (err) {
    console.error('Failed to broadcast notifications:', err)
    return []
  }
}
