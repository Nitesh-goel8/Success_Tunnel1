import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authenticateApi } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  try {
    // 1. Fetch all departments with head and members
    const departments = await prisma.department.findMany({
      include: {
        head: {
          select: {
            id: true,
            name: true,
            email: true,
            employeeProfile: {
              select: {
                id: true,
                employeeCode: true,
                designation: true,
                workLocation: true,
              },
            },
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            employeeProfile: {
              select: {
                id: true,
                employeeCode: true,
                designation: true,
                workLocation: true,
                managerId: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        projects: {
          select: {
            id: true,
            projectCode: true,
            name: true,
            status: true,
            progress: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    // 2. Fetch all employee profiles with hierarchy relations
    const profiles = await prisma.employeeProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: {
              select: { id: true, name: true, code: true },
            },
          },
        },
        manager: {
          select: {
            id: true,
            employeeCode: true,
            designation: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        directReports: {
          select: {
            id: true,
            employeeCode: true,
            designation: true,
            user: {
              select: { id: true, name: true, email: true, departmentId: true },
            },
          },
        },
      },
      orderBy: { employeeCode: 'asc' },
    })

    // 3. Find Nitesh Goel (or Head of Engineering) as Root
    const niteshProfile = profiles.find(
      (p) => p.user?.email === 'niteshgoel@successtunnel.in' || p.employeeCode === 'ST-ENG-001'
    )

    // 4. Engineering department specific slice
    const engDept = departments.find((d) => d.code === 'ENG')

    return res.status(200).json({
      departments,
      allProfiles: profiles,
      engineeringHead: niteshProfile || null,
      engineeringDepartment: engDept || null,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Failed to query organizational hierarchy:', error)
    return res.status(500).json({
      error: 'Failed to retrieve hierarchy',
      details: error?.message || String(error),
    })
  }
}
