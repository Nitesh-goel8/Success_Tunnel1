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
    const videos = await prisma.educationVideo.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    })
    return res.json(videos)
  }

  if (req.method === 'POST') {
    const {
      title,
      slug,
      excerpt,
      description,
      category,
      duration,
      thumbnailUrl,
      videoUrl,
      isPublished,
      isFeatured,
      showOnHomePopup,
      sortOrder,
    } = req.body

    if (!title || !slug || !videoUrl) {
      return res.status(400).json({ error: 'Title, slug and videoUrl are required' })
    }

    try {
      const video = await prisma.educationVideo.create({
        data: {
          title: String(title).trim(),
          slug: String(slug).trim(),
          excerpt: excerpt ? String(excerpt).trim() : null,
          description: description ? String(description).trim() : null,
          category: category ? String(category).trim() : null,
          duration: duration ? String(duration).trim() : null,
          thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
          videoUrl: String(videoUrl).trim(),
          isPublished: toBool(isPublished),
          isFeatured: toBool(isFeatured),
          showOnHomePopup: toBool(showOnHomePopup),
          sortOrder: toInt(sortOrder, 0),
          publishedAt: toBool(isPublished) ? new Date() : null,
        }
      })
      return res.status(201).json(video)
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
      excerpt,
      description,
      category,
      duration,
      thumbnailUrl,
      videoUrl,
      isPublished,
      isFeatured,
      showOnHomePopup,
      sortOrder,
    } = req.body

    if (!id || !title || !slug || !videoUrl) {
      return res.status(400).json({ error: 'ID, title, slug and videoUrl are required' })
    }

    try {
      const existing = await prisma.educationVideo.findUnique({ where: { id: parseInt(String(id), 10) } })
      const nextPublished = toBool(isPublished)
      const video = await prisma.educationVideo.update({
        where: { id: parseInt(String(id), 10) },
        data: {
          title: String(title).trim(),
          slug: String(slug).trim(),
          excerpt: excerpt ? String(excerpt).trim() : null,
          description: description ? String(description).trim() : null,
          category: category ? String(category).trim() : null,
          duration: duration ? String(duration).trim() : null,
          thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
          videoUrl: String(videoUrl).trim(),
          isPublished: nextPublished,
          isFeatured: toBool(isFeatured),
          showOnHomePopup: toBool(showOnHomePopup),
          sortOrder: toInt(sortOrder, 0),
          publishedAt: nextPublished ? (existing?.publishedAt || new Date()) : null,
        }
      })
      return res.json(video)
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'ID is required for deletion' })
    try {
      await prisma.educationVideo.delete({ where: { id: parseInt(String(id), 10) } })
      return res.json({ ok: true })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  return res.status(405).end()
}
