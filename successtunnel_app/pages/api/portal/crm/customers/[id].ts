import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  const { id } = req.query
  const customerId = parseInt(String(id), 10)

  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID parameter' })
  }

  // GET /api/portal/crm/customers/[id]
  if (req.method === 'GET') {
    if (!checkModulePermission(user.role, 'CRM', 'view')) {
      return res.status(403).json({ error: 'Permission denied: Cannot view customer' })
    }

    try {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          projects: {
            include: {
              manager: { select: { id: true, name: true, email: true } },
              department: { select: { id: true, name: true, code: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          leads: {
            orderBy: { createdAt: 'desc' },
            include: {
              assignedTo: { select: { id: true, name: true } },
            },
          },
        },
      })

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' })
      }

      return res.status(200).json(customer)
    } catch (err: any) {
      console.error('Error fetching customer details:', err)
      return res.status(500).json({ error: 'Failed to fetch customer', details: err.message })
    }
  }

  // PUT /api/portal/crm/customers/[id]
  if (req.method === 'PUT' || req.method === 'PATCH') {
    if (!checkModulePermission(user.role, 'CRM', 'edit')) {
      return res.status(403).json({ error: 'Permission denied: Cannot edit customer' })
    }

    try {
      const existing = await prisma.customer.findUnique({ where: { id: customerId } })
      if (!existing) {
        return res.status(404).json({ error: 'Customer not found' })
      }

      const { name, company, email, phone, address, city, website, status, notes } = req.body

      const updateData: any = {}
      if (name !== undefined) updateData.name = String(name).trim()
      if (company !== undefined) updateData.company = company ? String(company).trim() : null
      if (email !== undefined) updateData.email = String(email).trim().toLowerCase()
      if (phone !== undefined) updateData.phone = phone ? String(phone).trim() : null
      if (address !== undefined) updateData.address = address ? String(address).trim() : null
      if (city !== undefined) updateData.city = city ? String(city).trim() : null
      if (website !== undefined) updateData.website = website ? String(website).trim() : null
      if (status !== undefined) updateData.status = String(status)
      if (notes !== undefined) updateData.notes = notes ? String(notes).trim() : null

      const updated = await prisma.customer.update({
        where: { id: customerId },
        data: updateData,
      })

      await logAuditAction({
        userId: user.id,
        action: 'CUSTOMER_UPDATED',
        entityType: 'CRM_Customer',
        entityId: customerId,
        details: { code: updated.customerCode, name: updated.name },
        req,
      })

      return res.status(200).json(updated)
    } catch (err: any) {
      console.error('Error updating customer:', err)
      return res.status(500).json({ error: 'Failed to update customer', details: err.message })
    }
  }

  // DELETE /api/portal/crm/customers/[id]
  if (req.method === 'DELETE') {
    if (!checkModulePermission(user.role, 'CRM', 'delete')) {
      return res.status(403).json({ error: 'Permission denied: Cannot delete customer' })
    }

    try {
      const existing = await prisma.customer.findUnique({
        where: { id: customerId },
        include: { _count: { select: { projects: true } } },
      })

      if (!existing) {
        return res.status(404).json({ error: 'Customer not found' })
      }

      if (existing._count.projects > 0) {
        return res.status(400).json({
          error: `Cannot delete customer with ${existing._count.projects} linked active project(s). De-link or archive them first.`,
        })
      }

      await prisma.customer.delete({ where: { id: customerId } })

      await logAuditAction({
        userId: user.id,
        action: 'CUSTOMER_DELETED',
        entityType: 'CRM_Customer',
        entityId: customerId,
        details: { code: existing.customerCode, name: existing.name },
        req,
      })

      return res.status(200).json({ success: true, message: 'Customer deleted successfully' })
    } catch (err: any) {
      console.error('Error deleting customer:', err)
      return res.status(500).json({ error: 'Failed to delete customer', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
