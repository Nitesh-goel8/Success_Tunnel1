import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_erp_success_tunnel_2026_super_secure'

export type UserRole = 'super_admin' | 'hr_admin' | 'project_manager' | 'finance_admin' | 'employee'

export type ERPModule =
  | 'ORGANIZATION'
  | 'EMPLOYEES'
  | 'PROJECTS'
  | 'TASKS'
  | 'ATTENDANCE'
  | 'LEAVES'
  | 'DOCUMENTS'
  | 'FINANCE'
  | 'REPORTS'
  | 'AUDIT_LOGS'
  | 'CRM'

export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'approve'

export interface AuthUser {
  id: number
  email: string
  name?: string | null
  role: string
  departmentId?: number | null
  employeeProfileId?: number | null
}

/**
 * Server-side Role-Based Access Control matrix.
 * Grants fine-grained module-level authorization checks.
 */
export function checkModulePermission(
  role: string,
  module: ERPModule,
  action: ActionType = 'view'
): boolean {
  if (role === 'super_admin' || role === 'admin') return true

  switch (role) {
    case 'hr_admin':
      if (module === 'EMPLOYEES' || module === 'ORGANIZATION' || module === 'DOCUMENTS') return true
      if (module === 'LEAVES' || module === 'ATTENDANCE') return true
      if (module === 'AUDIT_LOGS' || module === 'REPORTS') return action === 'view'
      if (module === 'PROJECTS' || module === 'TASKS') return action === 'view'
      if (module === 'FINANCE') return action === 'view' || action === 'create' // own expense
      if (module === 'CRM') return action === 'view'
      return false

    case 'project_manager':
      if (module === 'PROJECTS' || module === 'TASKS') return true
      if (module === 'CRM') return true
      if (module === 'EMPLOYEES' || module === 'DOCUMENTS') return action === 'view'
      if (module === 'REPORTS') return action === 'view'
      if (module === 'ATTENDANCE' || module === 'LEAVES') return action === 'view' || action === 'create' // self-service
      if (module === 'FINANCE') return action === 'view' || action === 'create'
      return false

    case 'finance_admin':
      if (module === 'FINANCE') return true
      if (module === 'REPORTS' || module === 'AUDIT_LOGS') return action === 'view'
      if (module === 'CRM') return action === 'view'
      if (module === 'EMPLOYEES' || module === 'PROJECTS' || module === 'DOCUMENTS') return action === 'view'
      if (module === 'ATTENDANCE' || module === 'LEAVES') return action === 'view' || action === 'create'
      return false

    case 'employee':
      if (module === 'EMPLOYEES' || module === 'DOCUMENTS') return action === 'view'
      if (module === 'ATTENDANCE' || module === 'LEAVES' || module === 'FINANCE') {
        return action === 'view' || action === 'create'
      }
      if (module === 'TASKS') return action === 'view' || action === 'edit' // status changes on assigned tasks
      if (module === 'PROJECTS') return action === 'view'
      if (module === 'CRM') return action === 'view'
      return false

    default:
      return false
  }
}

export function signToken(payload: { [k: string]: any }): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token?: string): AuthUser | null {
  if (!token || !JWT_SECRET) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded && decoded.id && decoded.email) {
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name || null,
        role: decoded.role || 'employee',
        departmentId: decoded.departmentId || null,
        employeeProfileId: decoded.employeeProfileId || null,
      }
    }
    return null
  } catch (err) {
    return null
  }
}

export function getTokenFromReq(req: NextApiRequest): string | undefined {
  // Check Authorization header first
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Fallback to cookie
  const cookie = req.headers.cookie || ''
  const match = cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith('st_auth='))
  if (!match) return undefined
  return match.split('=')[1]
}

export async function authenticateApi(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles?: string[]
): Promise<AuthUser | null> {
  const token = getTokenFromReq(req)
  const user = verifyToken(token)

  if (!user) {
    res.status(401).json({ error: 'Authentication required. Please log in.' })
    return null
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Super administrator always has access
    const isSuperAdmin = user.role === 'super_admin' || user.role === 'admin'
    const hasRole = allowedRoles.includes(user.role)

    if (!isSuperAdmin && !hasRole) {
      res.status(403).json({
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
      })
      return null
    }
  }

  return user
}

export async function logAuditAction(options: {
  userId?: number | null
  action: string
  entityType: string
  entityId?: string | number | null
  details?: any
  req?: NextApiRequest
}) {
  try {
    let ip = '127.0.0.1'
    if (options.req) {
      const forwarded = options.req.headers['x-forwarded-for']
      if (typeof forwarded === 'string') {
        ip = forwarded.split(',')[0].trim()
      } else if (Array.isArray(forwarded)) {
        ip = forwarded[0]
      } else if (options.req.socket?.remoteAddress) {
        ip = options.req.socket.remoteAddress
      }
    }

    const detailsStr =
      typeof options.details === 'object'
        ? JSON.stringify(options.details)
        : options.details ? String(options.details) : null

    await prisma.auditLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        entityType: options.entityType,
        entityId: options.entityId ? String(options.entityId) : null,
        details: detailsStr,
        ipAddress: ip,
      },
    })
  } catch (err) {
    console.error('Failed to write audit log:', err)
  }
}
