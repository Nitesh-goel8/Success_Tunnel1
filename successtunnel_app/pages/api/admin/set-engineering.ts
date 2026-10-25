import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = req.query.secret || req.headers['x-admin-secret']
  if (
    secretKey !== 'ST_SUPER_ADMIN_2026' &&
    secretKey !== 'nitesh2005' &&
    secretKey !== process.env.JWT_SECRET
  ) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  try {
    // 1. Find or create Engineering Department
    let engDept = await prisma.department.findUnique({
      where: { code: 'ENG' },
    })

    if (!engDept) {
      engDept = await prisma.department.create({
        data: {
          code: 'ENG',
          name: 'Engineering & Technology',
          description: 'Software architecture, cloud infrastructure, and product engineering.',
        },
      })
    }

    // 2. Find Nitesh Goel user
    const user = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })

    if (!user) {
      return res.status(404).json({ error: 'User niteshgoel@successtunnel.in not found' })
    }

    // 3. Move Nitesh Goel to Engineering Department
    await prisma.user.update({
      where: { id: user.id },
      data: {
        departmentId: engDept.id,
        role: 'super_admin',
        status: 'active',
      },
    })

    // 4. Set Nitesh Goel as Head of Department for Engineering
    await prisma.department.update({
      where: { id: engDept.id },
      data: {
        headId: user.id,
      },
    })

    // 5. Upsert EmployeeProfile for Nitesh Goel
    const profile = await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: {
        employeeCode: 'ST-ENG-001',
        designation: 'Head of Engineering & Principal Solutions Architect',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
        managerId: null,
      },
      create: {
        userId: user.id,
        employeeCode: 'ST-ENG-001',
        designation: 'Head of Engineering & Principal Solutions Architect',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
      },
    })

    // 6. Connect Rohit Verma to report to Nitesh Goel
    const rohit = await prisma.employeeProfile.findFirst({
      where: { employeeCode: 'ST-PM-201' },
    })

    if (rohit) {
      await prisma.employeeProfile.update({
        where: { id: rohit.id },
        data: {
          managerId: profile.id,
        },
      })
    }

    // 7. Verify result
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        department: true,
        employeeProfile: true,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Nitesh Goel successfully moved to Engineering Department and designated as Head & Principal Architect',
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        department: updatedUser?.department,
        employeeProfile: updatedUser?.employeeProfile,
      },
      directReportsToNitesh: rohit ? [rohit.employeeCode] : [],
    })
  } catch (error: any) {
    console.error('Failed to set engineering department:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
