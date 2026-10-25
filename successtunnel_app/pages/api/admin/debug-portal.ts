import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result: any = {}

  try {
    const t = await prisma.task.findMany({ take: 2 })
    result.taskSuccess = true
    result.taskCount = t.length
  } catch (e: any) {
    result.taskError = e.message
  }

  try {
    const tInc = await prisma.task.findMany({
      take: 2,
      include: {
        project: { select: { id: true, name: true, projectCode: true } },
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
    })
    result.taskIncSuccess = true
  } catch (e: any) {
    result.taskIncError = e.message
  }

  try {
    const p = await prisma.project.findMany({ take: 2 })
    result.projectSuccess = true
    result.projectCount = p.length
  } catch (e: any) {
    result.projectError = e.message
  }

  try {
    const enq = await prisma.enquiry.count({ where: { status: { in: ['UNREAD', 'CONTACTED'] } } })
    result.enquirySuccess = true
  } catch (e: any) {
    result.enquiryError = e.message
  }

  return res.status(200).json(result)
}
