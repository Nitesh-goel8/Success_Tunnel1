import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export function signToken(payload:{[k:string]:any}){
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '7d'})
}

export function verifyToken(token?:string){
  if(!token) return null
  try{ return jwt.verify(token, JWT_SECRET) }catch(err){ return null }
}

export function getTokenFromReq(req:NextApiRequest): string | undefined {
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('st_auth='))
  if(!match) return undefined
  return match.split('=')[1]
}
