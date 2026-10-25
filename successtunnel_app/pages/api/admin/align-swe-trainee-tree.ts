import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = req.query.secret || req.headers['x-admin-secret']
  if (
    secretKey !== 'ST_SUPER_ADMIN_2026' &&
    secretKey !== 'nitesh2005' &&
    secretKey !== process.env.JWT_SECRET
  ) {
    return res.status(403).json({ error: 'Unauthorized: admin secret required' })
  }

  try {
    const niteshUser = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })
    const abhishekUser = await prisma.user.findUnique({
      where: { email: 'abhishek.kumar@successtunnel.in' },
    })
    const rohitUser = await prisma.user.findUnique({
      where: { email: 'rohit.verma@successtunnel.in' },
    })

    if (!niteshUser || !abhishekUser || !rohitUser) {
      return res.status(404).json({ error: 'Users not found' })
    }

    const engDept = await prisma.department.findUnique({
      where: { code: 'ENG' },
    })

    // 1. Update Nitesh's Profile to Software Engineering Trainee (SWE Trainee)
    // Mentored by Abhishek Kumar, Reporting to Rohit Verma
    const rohitProfile = await prisma.employeeProfile.findFirst({
      where: { userId: rohitUser.id },
    })

    const updatedNiteshProfile = await prisma.employeeProfile.upsert({
      where: { userId: niteshUser.id },
      update: {
        employeeCode: 'ST-ENG-102',
        designation: 'Software Engineering Trainee (SWE Trainee)',
        workLocation: 'Engineering Center / Hybrid',
        status: 'ACTIVE',
        managerId: rohitProfile?.id || null,
      },
      create: {
        userId: niteshUser.id,
        employeeCode: 'ST-ENG-102',
        designation: 'Software Engineering Trainee (SWE Trainee)',
        workLocation: 'Engineering Center / Hybrid',
        status: 'ACTIVE',
        managerId: rohitProfile?.id || null,
      },
    })

    // 2. Set Projects Manager to Rohit Verma (Engineering Lead) with Abhishek Kumar as Executive Sponsor
    // Nitesh Goel is explicitly NOT the manager
    const projects = await prisma.project.findMany({ take: 5, orderBy: { id: 'asc' } })
    for (const prj of projects) {
      await prisma.project.update({
        where: { id: prj.id },
        data: {
          managerId: rohitUser.id, // Rohit Verma is the Project Manager
        },
      })

      // Add Nitesh as Trainee Developer member
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: prj.id,
            userId: niteshUser.id,
          },
        },
        update: { role: 'Trainee Developer' },
        create: {
          projectId: prj.id,
          userId: niteshUser.id,
          role: 'Trainee Developer',
        },
      })

      // Add Abhishek Kumar as Project Sponsor / Mentor
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: prj.id,
            userId: abhishekUser.id,
          },
        },
        update: { role: 'Executive Sponsor & Mentor' },
        create: {
          projectId: prj.id,
          userId: abhishekUser.id,
          role: 'Executive Sponsor & Mentor',
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully updated working tree: Nitesh Goel is now Software Engineering Trainee under mentor Abhishek Kumar and manager Rohit Verma',
      profile: {
        name: niteshUser.name,
        designation: updatedNiteshProfile.designation,
        mentor: 'Abhishek Kumar (VP of Engineering & Head of Technology)',
        manager: 'Rohit Verma (Engineering Lead & Principal Project Manager)',
      },
      projectsUpdated: projects.length,
      projectManager: 'Rohit Verma',
    })
  } catch (error: any) {
    console.error('Failed to align trainee tree:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
