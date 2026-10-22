import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10))
      const search = (req.query.search as string || '').trim()
      const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined
      const status = (req.query.status as string || '').trim().toUpperCase()

      const where: any = {}

      if (departmentId) {
        where.departmentId = departmentId
      }

      if (status && status !== 'ALL') {
        where.employeeProfile = {
          status: status,
        }
      }

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
          { employeeProfile: { employeeCode: { contains: search } } },
          { employeeProfile: { designation: { contains: search } } },
        ]
      }

      const [total, employees] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            status: true,
            avatarUrl: true,
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
                manager: {
                  select: {
                    id: true,
                    employeeCode: true,
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { id: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ])

      return res.status(200).json({
        data: employees,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error('Failed to query employees:', error)
      return res.status(500).json({ error: 'Failed to retrieve employees' })
    }
  }

  if (req.method === 'POST') {
    // Only super_admin and hr_admin can create employees
    if (auth.role !== 'super_admin' && auth.role !== 'hr_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Administrators and HR Managers can add new employee records' })
    }

    const {
      name,
      email,
      password,
      role,
      departmentId,
      phone,
      employeeCode,
      designation,
      workLocation,
      employmentType,
      joiningDate,
      managerId,
      status,
    } = req.body

    if (!name || !email || !designation) {
      return res.status(400).json({ error: 'Name, email, and designation are required' })
    }

    const cleanEmail = email.trim().toLowerCase()

    try {
      const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } })
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email address already exists' })
      }

      const generatedCode =
        employeeCode?.trim() ||
        `ST-EMP-${Math.floor(1000 + Math.random() * 9000)}`

      const existingProfile = await prisma.employeeProfile.findUnique({
        where: { employeeCode: generatedCode },
      })
      if (existingProfile) {
        return res.status(400).json({ error: 'An employee with this employee code already exists' })
      }

      const hashedPassword = await bcrypt.hash(password || 'Demo@2026!', 10)

      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role || 'employee',
            departmentId: departmentId ? parseInt(departmentId) : null,
            phone: phone ? phone.trim() : null,
            status: 'active',
          },
        })

        const newProfile = await tx.employeeProfile.create({
          data: {
            userId: newUser.id,
            employeeCode: generatedCode,
            designation: designation.trim(),
            workLocation: workLocation?.trim() || 'Headquarters - New Delhi',
            employmentType: employmentType || 'Full-time',
            joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
            managerId: managerId ? parseInt(managerId) : null,
            status: status || 'ACTIVE',
            isDemo: false,
          },
        })

        return { user: newUser, profile: newProfile }
      })

      await logAuditAction({
        userId: auth.id,
        action: 'EMPLOYEE_CREATED',
        entityType: 'Employee',
        entityId: result.user.id,
        details: {
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          employeeCode: result.profile.employeeCode,
        },
        req,
      })

      return res.status(201).json({
        ok: true,
        message: 'Employee record created successfully',
        data: result,
      })
    } catch (error: any) {
      console.error('Failed to create employee:', error)
      return res.status(500).json({ error: error.message || 'Failed to create employee record' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
