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

    // Helper: Safely assign or update EmployeeProfile resolving unique constraints
    async function assignProfile(
      userId: number,
      employeeCode: string,
      designation: string,
      managerId: number | null = null
    ) {
      const existingByCode = await prisma.employeeProfile.findUnique({
        where: { employeeCode },
      })
      const existingByUser = await prisma.employeeProfile.findUnique({
        where: { userId },
      })

      if (existingByUser && existingByCode && existingByUser.id !== existingByCode.id) {
        await prisma.employeeProfile.delete({
          where: { id: existingByCode.id },
        })
      }

      if (existingByUser) {
        return await prisma.employeeProfile.update({
          where: { id: existingByUser.id },
          data: {
            employeeCode,
            designation,
            workLocation: 'Engineering Center / HQ',
            status: 'ACTIVE',
            managerId,
          },
        })
      }

      if (existingByCode) {
        return await prisma.employeeProfile.update({
          where: { id: existingByCode.id },
          data: {
            userId,
            designation,
            workLocation: 'Engineering Center / HQ',
            status: 'ACTIVE',
            managerId,
          },
        })
      }

      return await prisma.employeeProfile.create({
        data: {
          userId,
          employeeCode,
          designation,
          workLocation: 'Engineering Center / HQ',
          status: 'ACTIVE',
          managerId,
        },
      })
    }

    // 2. Find and update Nitesh Goel user (keeps super_admin role for auth privileges)
    const niteshUser = await prisma.user.findUnique({
      where: { email: 'niteshgoel@successtunnel.in' },
    })

    if (!niteshUser) {
      return res.status(404).json({ error: 'User niteshgoel@successtunnel.in not found' })
    }

    await prisma.user.update({
      where: { id: niteshUser.id },
      data: {
        departmentId: engDept.id,
        role: 'super_admin',
        status: 'active',
      },
    })

    // Assign Nitesh Goel to ST-ENG-102 (Software Engineer - SWE)
    const niteshProfile = await assignProfile(
      niteshUser.id,
      'ST-ENG-102',
      'Software Engineer (SWE)',
      null
    )

    // 3. Provision Abhishek Kumar as VP of Engineering & Head of Technology
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

    // Assign Abhishek Kumar to ST-ENG-001 as Department Head
    const abhishekProfile = await assignProfile(
      abhishekUser.id,
      'ST-ENG-001',
      'VP of Engineering & Head of Technology',
      null
    )

    // Set Abhishek Kumar as Department Head of ENG
    await prisma.department.update({
      where: { id: engDept.id },
      data: {
        headId: abhishekUser.id,
      },
    })

    // 4. Provision Rohit Verma as Tier 2 Engineering Lead (ST-PM-201)
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

    const rohitProfile = await assignProfile(
      rohitUser.id,
      'ST-PM-201',
      'Engineering Lead & Principal Project Manager',
      abhishekProfile.id
    )

    // 5. Connect Nitesh Goel to report to Rohit Verma
    await prisma.employeeProfile.update({
      where: { id: niteshProfile.id },
      data: {
        managerId: rohitProfile.id,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Abhishek Kumar successfully assigned as Head of Engineering; Rohit Verma as Engineering Lead; Nitesh Goel configured as Software Engineer (SWE)',
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
        name: niteshUser.name,
        email: niteshUser.email,
        designation: 'Software Engineer (SWE)',
        employeeCode: 'ST-ENG-102',
        department: 'Engineering & Technology (ENG)',
        role: niteshUser.role,
        reportsTo: 'Rohit Verma (Engineering Lead)',
      },
    })
  } catch (error: any) {
    console.error('Failed to configure Abhishek Kumar and Nitesh Goel roles:', error)
    return res.status(500).json({ error: error.message || String(error) })
  }
}
