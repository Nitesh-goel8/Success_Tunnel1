import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../../lib/prisma'
import { authenticateApi, checkModulePermission } from '../../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  const { id } = req.query
  const leadId = parseInt(String(id), 10)

  if (isNaN(leadId)) {
    return res.status(400).json({ error: 'Invalid lead ID' })
  }

  // POST /api/portal/crm/leads/[id]/activities
  if (req.method === 'POST') {
    if (!checkModulePermission(user.role, 'CRM', 'edit')) {
      return res.status(403).json({ error: 'Permission denied: Cannot log CRM activity' })
    }

    try {
      const { type = 'NOTE', summary, details, followUpDate, isCompleted = true } = req.body

      if (!summary || String(summary).trim() === '') {
        return res.status(400).json({ error: 'Activity summary is required' })
      }

      const activity = await prisma.leadActivity.create({
        data: {
          leadId,
          userId: user.id,
          type: String(type),
          summary: String(summary).trim(),
          details: details ? String(details).trim() : null,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          isCompleted: Boolean(isCompleted),
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      })

      // If a followUpDate is specified, update the lead's nextFollowUp field
      if (followUpDate) {
        await prisma.lead.update({
          where: { id: leadId },
          data: { nextFollowUp: new Date(followUpDate) },
        })
      }

      return res.status(201).json(activity)
    } catch (err: any) {
      console.error('Error logging lead activity:', err)
      return res.status(500).json({ error: 'Failed to log activity', details: err.message })
    }
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
