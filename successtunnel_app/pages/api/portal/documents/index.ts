import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { authenticateApi, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await authenticateApi(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const category = (req.query.category as string || '').trim().toUpperCase()
      const search = (req.query.search as string || '').trim()

      const isHRorAdmin =
        auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin'

      const where: any = {}
      if (category && category !== 'ALL') {
        where.category = category
      }

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { fileType: { contains: search } },
        ]
      }

      // If not HR or Admin, confidential docs are restricted to target user or company policies
      if (!isHRorAdmin) {
        where.OR = [
          { isConfidential: false },
          { userId: auth.id },
          { uploaderId: auth.id },
        ]
      }

      const docs = await prisma.documentRecord.findMany({
        where,
        include: {
          uploader: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json(docs)
    } catch (error) {
      console.error('Failed to list documents:', error)
      return res.status(500).json({ error: 'Failed to retrieve document repository' })
    }
  }

  if (req.method === 'POST') {
    const isUploader =
      auth.role === 'super_admin' || auth.role === 'hr_admin' || auth.role === 'admin' || auth.role === 'project_manager'

    if (!isUploader) {
      return res.status(403).json({ error: 'Only Administrators and HR personnel can publish organizational documents' })
    }

    const {
      title,
      category,
      fileUrl,
      fileSize,
      fileType,
      version,
      isConfidential,
      userId,
    } = req.body

    if (!title || !category || !fileUrl) {
      return res.status(400).json({ error: 'Title, category, and file URL are required' })
    }

    try {
      const doc = await prisma.documentRecord.create({
        data: {
          title: title.trim(),
          category: category.toUpperCase(),
          fileUrl: fileUrl.trim(),
          fileSize: fileSize || '1.2 MB',
          fileType: fileType || 'application/pdf',
          version: version?.trim() || 'v1.0',
          isConfidential: !!isConfidential,
          userId: userId ? parseInt(userId) : null,
          uploaderId: auth.id,
          isDemo: false,
        },
      })

      await logAuditAction({
        userId: auth.id,
        action: 'DOCUMENT_UPLOADED',
        entityType: 'Document',
        entityId: doc.id,
        details: { title: doc.title, category: doc.category, version: doc.version },
        req,
      })

      return res.status(201).json({ ok: true, document: doc })
    } catch (error: any) {
      console.error('Failed to create document record:', error)
      return res.status(500).json({ error: error.message || 'Failed to save document metadata' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
