import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req: NextApiRequest) {
  const token = getTokenFromReq(req)
  return verifyToken(token as string)
}

function toBool(value: any) {
  return value === true || value === 'true' || value === '1' || value === 1
}

function toInt(value: any, fallback = 0) {
  const parsed = parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireAuth(req)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })

  if (req.method === 'GET') {
    const items = await prisma.educationContent.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    })
    return res.json(items)
  }

  if (req.method === 'POST') {
    const {
      title,
      slug,
      contentType,
      category,
      excerpt,
      body,
      thumbnailUrl,
      assetUrl,
      externalUrl,
      ctaLabel,
      isPublished,
      isFeatured,
      showOnHomePopup,
      sortOrder,
    } = req.body

    if (!title || !slug || !contentType) {
      return res.status(400).json({ error: 'Title, slug and contentType are required' })
    }

    try {
      const item = await prisma.educationContent.create({
        data: {
          title: String(title).trim(),
          slug: String(slug).trim(),
          contentType: String(contentType).trim(),
          category: category ? String(category).trim() : null,
          excerpt: excerpt ? String(excerpt).trim() : null,
          body: body ? String(body).trim() : null,
          thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
          assetUrl: assetUrl ? String(assetUrl).trim() : null,
          externalUrl: externalUrl ? String(externalUrl).trim() : null,
          ctaLabel: ctaLabel ? String(ctaLabel).trim() : null,
          isPublished: toBool(isPublished),
          isFeatured: toBool(isFeatured),
          showOnHomePopup: toBool(showOnHomePopup),
          sortOrder: toInt(sortOrder, 0),
          publishedAt: toBool(isPublished) ? new Date() : null,
        }
      })
      return res.status(201).json(item)
    } catch (err: any) {
      if (err.code === 'P2002') return res.status(400).json({ error: 'Slug already exists' })
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'PUT') {
    const {
      id,
      title,
      slug,
      contentType,
      category,
      excerpt,
      body,
      thumbnailUrl,
      assetUrl,
      externalUrl,
      ctaLabel,
      isPublished,
      isFeatured,
      showOnHomePopup,
      sortOrder,
    } = req.body

    if (!id || !title || !slug || !contentType) {
      return res.status(400).json({ error: 'ID, title, slug and contentType are required' })
    }

    try {
      const existing = await prisma.educationContent.findUnique({ where: { id: parseInt(String(id), 10) } })
      const nextPublished = toBool(isPublished)
      const item = await prisma.educationContent.update({
        where: { id: parseInt(String(id), 10) },
        data: {
          title: String(title).trim(),
          slug: String(slug).trim(),
          contentType: String(contentType).trim(),
          category: category ? String(category).trim() : null,
          excerpt: excerpt ? String(excerpt).trim() : null,
          body: body ? String(body).trim() : null,
          thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
          assetUrl: assetUrl ? String(assetUrl).trim() : null,
          externalUrl: externalUrl ? String(externalUrl).trim() : null,
          ctaLabel: ctaLabel ? String(ctaLabel).trim() : null,
          isPublished: nextPublished,
          isFeatured: toBool(isFeatured),
          showOnHomePopup: toBool(showOnHomePopup),
          sortOrder: toInt(sortOrder, 0),
          publishedAt: nextPublished ? (existing?.publishedAt || new Date()) : null,
        }
      })
      return res.json(item)
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'ID is required for deletion' })
    try {
      await prisma.educationContent.delete({ where: { id: parseInt(String(id), 10) } })
      return res.json({ ok: true })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  return res.status(405).end()
}
