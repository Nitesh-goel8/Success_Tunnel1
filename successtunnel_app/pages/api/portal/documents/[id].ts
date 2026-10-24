import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, checkModulePermission, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticateApi(req, res)
  if (!user) return

  const { id } = req.query
  const docId = parseInt(String(id), 10)

  if (isNaN(docId)) {
    return res.status(400).json({ error: 'Invalid document ID parameter' })
  }

  // GET: Fetch single document with access control check
  if (req.method === 'GET') {
    try {
      const doc = await prisma.documentRecord.findUnique({
        where: { id: docId },
        include: {
          uploader: { select: { id: true, name: true, email: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      })

      if (!doc) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const isHRorAdmin =
        user.role === 'super_admin' || user.role === 'hr_admin' || user.role === 'admin'

      if (doc.isConfidential && !isHRorAdmin && doc.userId !== user.id && doc.uploaderId !== user.id) {
        return res.status(403).json({ error: 'Access denied: This document is classified as confidential' })
      }

      return res.status(200).json(doc)
    } catch (err: any) {
      console.error('Failed to get document:', err)
      return res.status(500).json({ error: 'Failed to retrieve document', details: err.message })
    }
  }

  // PUT / PATCH: Update document metadata (title, version, confidential flag, category)
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const isHRorAdmin =
      user.role === 'super_admin' || user.role === 'hr_admin' || user.role === 'admin'

    if (!isHRorAdmin) {
      return res.status(403).json({ error: 'Only HR Administrators can modify organizational documents' })
    }

    try {
      const existing = await prisma.documentRecord.findUnique({ where: { id: docId } })
      if (!existing) {
        return res.status(404).json({ error: 'Document not found' })
      }

      const { title, category, version, isConfidential, fileUrl } = req.body

      const updateData: any = {}
      if (title !== undefined) updateData.title = String(title).trim()
      if (category !== undefined) updateData.category = String(category).trim().toUpperCase()
      if (version !== undefined) updateData.version = String(version).trim()
      if (isConfidential !== undefined) updateData.isConfidential = Boolean(isConfidential)
      if (fileUrl !== undefined) updateData.fileUrl = String(fileUrl).trim()

      const updated = await prisma.documentRecord.update({
        where: { id: docId },
        data: updateData,
      })

      await logAuditAction({
        userId: user.id,
        action: 'DOCUMENT_UPDATED',
        entityType: 'Document',
        entityId: docId,
        details: { title: updated.title, version: updated.version },
        req,
      })

      return res.status(200).json(updated)
    } catch (err: any) {
      console.error('Failed to update document:', err)
      return res.status(500).json({ error: 'Failed to update document', details: err.message })
    }
  }

  // DELETE: Delete document
  if (req.method === 'DELETE') {
    const isHRorAdmin =
      user.role === 'super_admin' || user.role === 'hr_admin' || user.role === 'admin'

    if (!isHRorAdmin) {
      return res.status(403).json({ error: 'Only HR Administrators can delete organizational documents' })
    }

    try {
      const existing = await prisma.documentRecord.findUnique({ where: { id: docId } })
      if (!existing) {
        return res.status(404).json({ error: 'Document not found' })
      }

      await prisma.documentRecord.delete({ where: { id: docId } })

      await logAuditAction({
        userId: user.id,
        action: 'DOCUMENT_DELETED',
        entityType: 'Document',
        entityId: docId,
        details: { title: existing.title, category: existing.category },
        req,
      })

      return res.status(200).json({ success: true, message: 'Document deleted successfully' })
    } catch (err: any) {
      console.error('Failed to delete document:', err)
      return res.status(500).json({ error: 'Failed to delete document', details: err.message })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
