import { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromReq, verifyToken, logAuditAction } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getTokenFromReq(req)
  const user = verifyToken(token)

  if (user) {
    await logAuditAction({
      userId: user.id,
      action: 'LOGOUT',
      entityType: 'Auth',
      details: { email: user.email },
      req,
    })
  }

  const isProd = process.env.NODE_ENV === 'production'
  const secureFlag = isProd ? '; Secure' : ''
  res.setHeader('Set-Cookie', `st_auth=deleted; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`)

  return res.status(200).json({ ok: true, message: 'Logged out successfully' })
}
