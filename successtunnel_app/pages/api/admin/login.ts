import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email & password required' })

  const cleanEmail = email.trim().toLowerCase()

  try {
    // Auto-heal missing departmentId column on User table
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "departmentId" INTEGER;')
    } catch (e1) {
      try {
        await prisma.$executeRawUnsafe('ALTER TABLE User ADD COLUMN departmentId INTEGER;')
      } catch (e2) {}
    }

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true, password: true, role: true, status: true },
    })

    // Auto-bootstrap or update Nitesh Goel super_admin credentials
    if (cleanEmail === 'niteshgoel@successtunnel.in' && password === 'Nitesh@2005!') {
      const hashedPassword = await bcrypt.hash('Nitesh@2005!', 10)
      if (user) {
        try {
          user = await prisma.user.update({
            where: { email: cleanEmail },
            data: {
              password: hashedPassword,
              role: 'super_admin',
              status: 'active',
            },
            select: { id: true, email: true, password: true, role: true, status: true },
          })
        } catch (upErr) {}
      } else {
        try {
          user = await prisma.user.create({
            data: {
              name: 'Nitesh Goel',
              email: cleanEmail,
              password: hashedPassword,
              role: 'super_admin',
              status: 'active',
            },
            select: { id: true, email: true, password: true, role: true, status: true },
          })
        } catch (crErr) {}
      }
    }

    if (!user) return res.status(401).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = signToken({ id: user.id, email: user.email, role: user.role })
    const isHttps = req.headers['x-forwarded-proto'] === 'https' || (req.socket as any)?.encrypted
    const isProd = process.env.NODE_ENV === 'production'
    const secure = isHttps || (isProd && !req.headers.host?.includes('localhost') && !req.headers.host?.includes('127.0.0.1')) ? '; Secure' : ''
    res.setHeader('Set-Cookie', `st_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`)
    return res.json({ ok: true })
  } catch (err: any) {
    console.error('Admin login error:', err)
    return res.status(500).json({ error: err?.message || 'Login error' })
  }
}
