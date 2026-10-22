import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  const employeeId = parseInt(req.query.id as string)
  if (isNaN(employeeId)) {
    return res.status(400).json({ error: 'Invalid employee identifier' })
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: employeeId },
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
            include: {
              manager: {
                select: {
                  id: true,
                  employeeCode: true,
                  designation: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
              directReports: {
                select: {
                  id: true,
                  employeeCode: true,
                  designation: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          assignedTasks: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              taskCode: true,
              title: true,
              status: true,
              priority: true,
              dueDate: true,
            },
          },
          attendance: {
            take: 7,
            orderBy: { date: 'desc' },
            select: {
              id: true,
              date: true,
              checkIn: true,
              checkOut: true,
              durationMinutes: true,
              status: true,
            },
          },
          leaveRequests: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              leaveType: true,
              startDate: true,
              endDate: true,
              totalDays: true,
              status: true,
            },
          },
        },
      })

      if (!user) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.error('Failed to get employee details:', error)
      return res.status(500).json({ error: 'Failed to retrieve employee details' })
    }
  }

  if (req.method === 'PUT') {
    const isSelf = auth.id === employeeId
    const isAdmin = auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin'

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Unauthorized to modify this employee record' })
    }

    const {
      name,
      phone,
      departmentId,
      role,
      status,
      designation,
      workLocation,
      employmentType,
      emergencyContact,
      managerId,
    } = req.body

    try {
      const userUpdateData: any = {}
      if (name) userUpdateData.name = name.trim()
      if (phone !== undefined) userUpdateData.phone = phone ? phone.trim() : null

      // Admin only updates
      if (isAdmin) {
        if (departmentId !== undefined) userUpdateData.departmentId = departmentId ? parseInt(departmentId) : null
        if (role) userUpdateData.role = role
        if (status) userUpdateData.status = status
      }

      const profileUpdateData: any = {}
      if (isAdmin) {
        if (designation) profileUpdateData.designation = designation.trim()
        if (workLocation) profileUpdateData.workLocation = workLocation.trim()
        if (employmentType) profileUpdateData.employmentType = employmentType
        if (managerId !== undefined) profileUpdateData.managerId = managerId ? parseInt(managerId) : null
        if (status) profileUpdateData.status = status.toUpperCase()
      }
      if (emergencyContact !== undefined) {
        profileUpdateData.emergencyContact = emergencyContact ? emergencyContact.trim() : null
      }

      const updated = await prisma.$transaction(async (tx) => {
        const u = await tx.user.update({
          where: { id: employeeId },
          data: userUpdateData,
        })

        if (Object.keys(profileUpdateData).length > 0) {
          await tx.employeeProfile.upsert({
            where: { userId: employeeId },
            update: profileUpdateData,
            create: {
              userId: employeeId,
              employeeCode: `ST-EMP-${employeeId}`,
              designation: designation || 'Associate',
              ...profileUpdateData,
            },
          })
        }

        return u
      })

      await logAuditAction({
        userId: auth.id,
        action: 'EMPLOYEE_UPDATED',
        entityType: 'Employee',
        entityId: employeeId,
        details: { fieldsUpdated: Object.keys({ ...userUpdateData, ...profileUpdateData }) },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Employee record updated successfully', user: updated })
    } catch (error: any) {
      console.error('Failed to update employee:', error)
      return res.status(500).json({ error: error.message || 'Failed to update employee record' })
    }
  }

  if (req.method === 'DELETE') {
    if (auth.role !== 'super_admin' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Only Super Administrators can remove employee records' })
    }

    try {
      // Soft-delete by setting status to inactive
      await prisma.user.update({
        where: { id: employeeId },
        data: { status: 'inactive' },
      })

      await prisma.employeeProfile.updateMany({
        where: { userId: employeeId },
        data: { status: 'INACTIVE' },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'EMPLOYEE_DEACTIVATED',
        entityType: 'Employee',
        entityId: employeeId,
        details: { deactivatedAt: new Date().toISOString() },
        req,
      })

      return res.status(200).json({ ok: true, message: 'Employee record deactivated' })
    } catch (error) {
      console.error('Failed to deactivate employee:', error)
      return res.status(500).json({ error: 'Failed to deactivate employee record' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
