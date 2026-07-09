import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'client') {
      return res.status(401).json({ error: 'Invalid client credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid client credentials' })
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role })
    
    // Set client-specific cookie
    res.setHeader('Set-Cookie', `st_client_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`)
    return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error: any) {
    console.error('Client login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
