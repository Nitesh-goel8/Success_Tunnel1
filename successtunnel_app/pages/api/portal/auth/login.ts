import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import { signToken, logAuditAction } from '../../../../lib/auth'
import { checkRateLimit } from '../../../../lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  // Derive client IP for security rate limiting
  const forwarded = req.headers['x-forwarded-for']
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1'

  // Apply rate limiting: max 10 login attempts per 60 seconds per IP
  const rateLimitResult = checkRateLimit(`portal_login_${clientIp}`, 10, 60000)
  if (!rateLimitResult.allowed) {
    const retrySec = Math.ceil((rateLimitResult.retryAfterMs || 60000) / 1000)
    res.setHeader('Retry-After', retrySec.toString())
    try {
      await logAuditAction({
        action: 'LOGIN_RATE_LIMITED',
        entityType: 'Auth',
        details: { clientIp, retryAfterSec: retrySec },
        req,
      })
    } catch (e) {}
    return res.status(429).json({
      error: `Too many login attempts. Please wait ${retrySec} seconds before trying again.`,
    })
  }

  const { email, password } = req.body || {}

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid email and password are required' })
  }

  const cleanEmail = email.trim().toLowerCase()

  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        department: true,
        employeeProfile: true,
      },
    })

    if (!user) {
      try {
        await logAuditAction({
          action: 'LOGIN_FAILED_UNKNOWN_EMAIL',
          entityType: 'Auth',
          details: { attemptedEmail: cleanEmail },
          req,
        })
      } catch (e) {}
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (user.status !== 'active') {
      try {
        await logAuditAction({
          userId: user.id,
          action: 'LOGIN_BLOCKED_INACTIVE',
          entityType: 'Auth',
          details: { email: user.email, status: user.status },
          req,
        })
      } catch (e) {}
      return res.status(403).json({ error: 'Account is deactivated. Contact HR or Administrator.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      try {
        await logAuditAction({
          userId: user.id,
          action: 'LOGIN_FAILED_BAD_PASSWORD',
          entityType: 'Auth',
          details: { email: user.email },
          req,
        })
      } catch (e) {}
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update lastLoginAt safely
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    } catch (updateErr) {
      console.warn('Failed to update lastLoginAt:', updateErr)
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      employeeProfileId: user.employeeProfile?.id || null,
    })

    const isProd = process.env.NODE_ENV === 'production'
    const secureFlag = isProd ? '; Secure' : ''
    res.setHeader(
      'Set-Cookie',
      `st_auth=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${secureFlag}`
    )

    try {
      await logAuditAction({
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        entityType: 'Auth',
        details: { role: user.role, email: user.email },
        req,
      })
    } catch (auditErr) {
      console.warn('Failed to write login audit log:', auditErr)
    }

    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentName: user.department?.name || null,
        designation: user.employeeProfile?.designation || null,
        employeeCode: user.employeeProfile?.employeeCode || null,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return res.status(500).json({ error: error?.message || 'An unexpected server error occurred during authentication' })
  }
}
