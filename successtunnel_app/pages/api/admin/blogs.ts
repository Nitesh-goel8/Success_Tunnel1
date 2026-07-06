import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req: NextApiRequest) {
  const token = getTokenFromReq(req)
  const payload = verifyToken(token as string)
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = requireAuth(req)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })

  if (req.method === 'GET') {
    const posts = await prisma.blogPost.findMany({ orderBy: { id: 'desc' } })
    return res.json(posts)
  }

  if (req.method === 'POST') {
    const { title, slug, excerpt, content, featuredImage } = req.body
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' })
    }
    try {
      const p = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          publishedAt: new Date()
        }
      })
      return res.status(201).json(p)
    } catch (err: any) {
      if (err.code === 'P2002') return res.status(400).json({ error: 'Slug already exists' })
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'PUT') {
    const { id, title, slug, excerpt, content, featuredImage } = req.body
    if (!id) return res.status(400).json({ error: 'ID is required for editing' })
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' })
    }
    try {
      const p = await prisma.blogPost.update({
        where: { id: parseInt(id, 10) },
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage
        }
      })
      return res.json(p)
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'ID is required for deletion' })
    try {
      await prisma.blogPost.delete({ where: { id: parseInt(id, 10) } })
      return res.json({ ok: true })
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  }

  return res.status(405).end()
}
