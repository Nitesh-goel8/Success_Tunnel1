import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

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
    // 1. Find or create Engineering Department (code: ENG)
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

    // 2. Free up 'ST-ENG-001' code by assigning Nitesh Goel to 'ST-ENG-102'
    // This prevents unique constraint violations on employeeCode
    await prisma.employeeProfile.updateMany({
      where: { employeeCode: 'ST-ENG-001' },
      data: { employeeCode: 'ST-ENG-102' },
    })

    // 3. Find Nitesh Goel user and update to Software Engineer (SWE)
    const niteshUser = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })

    let niteshProfile = null
    if (niteshUser) {
      await prisma.user.update({
        where: { id: niteshUser.id },
        data: {
          departmentId: engDept.id,
          role: 'super_admin', // Keep super_admin auth privileges
          status: 'active',
        },
      })

      niteshProfile = await prisma.employeeProfile.upsert({
        where: { userId: niteshUser.id },
        update: {
          employeeCode: 'ST-ENG-102',
          designation: 'Software Engineer (SWE)',
          workLocation: 'Engineering Center / Hybrid',
          status: 'ACTIVE',
        },
        create: {
          userId: niteshUser.id,
          employeeCode: 'ST-ENG-102',
          designation: 'Software Engineer (SWE)',
          workLocation: 'Engineering Center / Hybrid',
          status: 'ACTIVE',
        },
      })
    }

    // 4. Provision Abhishek Kumar as VP of Engineering & Head of Technology
    const hashedPassword = await bcrypt.hash('Abhishek@2026!', 10)
    let abhishekUser = await prisma.user.findUnique({
      where: { email: 'abhishek.kumar@successtunnel.in' },
    })

    if (!abhishekUser) {
      abhishekUser = await prisma.user.create({
        data: {
          name: 'Abhishek Kumar',
          email: 'abhishek.kumar@successtunnel.in',
          password: hashedPassword,
          role: 'admin',
          status: 'active',
          departmentId: engDept.id,
          phone: '+91 98120 77889',
        },
      })
    } else {
      abhishekUser = await prisma.user.update({
        where: { id: abhishekUser.id },
        data: {
          name: 'Abhishek Kumar',
          departmentId: engDept.id,
          role: 'admin',
          status: 'active',
        },
      })
    }

    // 5. Upsert Abhishek Kumar Employee Profile as Department Head (ST-ENG-001)
    const abhishekProfile = await prisma.employeeProfile.upsert({
      where: { userId: abhishekUser.id },
      update: {
        employeeCode: 'ST-ENG-001',
        designation: 'VP of Engineering & Head of Technology',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
        managerId: null,
      },
      create: {
        userId: abhishekUser.id,
        employeeCode: 'ST-ENG-001',
        designation: 'VP of Engineering & Head of Technology',
        workLocation: 'Technology Innovation Lab / HQ',
        status: 'ACTIVE',
      },
    })

    // 6. Set Abhishek Kumar as Department Head of Engineering (ENG)
    await prisma.department.update({
      where: { id: engDept.id },
      data: {
        headId: abhishekUser.id,
      },
    })

    // 7. Provision or Update Rohit Verma as Tier 2 Engineering Lead (ST-PM-201)
    let rohitUser = await prisma.user.findUnique({
      where: { email: 'rohit.verma@successtunnel.in' },
    })

    if (!rohitUser) {
      const rohitPassword = await bcrypt.hash('Rohit@2026!', 10)
      rohitUser = await prisma.user.create({
        data: {
          name: 'Rohit Verma',
          email: 'rohit.verma@successtunnel.in',
          password: rohitPassword,
          role: 'manager',
          status: 'active',
          departmentId: engDept.id,
          phone: '+91 98120 44556',
        },
      })
    }

    const rohitProfile = await prisma.employeeProfile.upsert({
      where: { userId: rohitUser.id },
      update: {
        employeeCode: 'ST-PM-201',
        designation: 'Engineering Lead & Principal Project Manager',
        workLocation: 'Engineering Center / Hybrid',
        status: 'ACTIVE',
        managerId: abhishekProfile.id,
      },
      create: {
        userId: rohitUser.id,
        employeeCode: 'ST-PM-201',
        designation: 'Engineering Lead & Principal Project Manager',
        workLocation: 'Engineering Center / Hybrid',
        status: 'ACTIVE',
        managerId: abhishekProfile.id,
      },
    })

    // 8. Connect Nitesh Goel to report to Rohit Verma
    if (niteshProfile) {
      await prisma.employeeProfile.update({
        where: { id: niteshProfile.id },
        data: {
          managerId: rohitProfile.id,
        },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Abhishek Kumar assigned as Head of Engineering; Rohit Verma as Engineering Lead; Nitesh Goel configured as Software Engineer (SWE)',
      departmentHead: {
        name: abhishekUser.name,
        email: abhishekUser.email,
        designation: abhishekProfile.designation,
        employeeCode: abhishekProfile.employeeCode,
      },
      engineeringLead: {
        name: rohitUser.name,
        designation: rohitProfile.designation,
        employeeCode: rohitProfile.employeeCode,
        reportsTo: 'Abhishek Kumar (VP of Engineering)',
      },
      niteshGoel: {
        name: niteshUser?.name,
        email: niteshUser?.email,
        designation: 'Software Engineer (SWE)',
        employeeCode: 'ST-ENG-102',
        department: 'Engineering & Technology',
        role: niteshUser?.role,
        reportsTo: 'Rohit Verma (Engineering Lead)',
      },
    })
  } catch (error: any) {
    console.error('Failed to configure Abhishek Kumar and Nitesh Goel roles:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
