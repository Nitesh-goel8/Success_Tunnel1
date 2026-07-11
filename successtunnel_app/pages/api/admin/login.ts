import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const {email,password} = req.body
  if(!email || !password) return res.status(400).json({error:'email & password required'})
  const user = await prisma.user.findUnique({where:{email}})
  if(!user) return res.status(401).json({error:'invalid credentials'})
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(401).json({error:'invalid credentials'})
  const token = signToken({id:user.id,email:user.email,role:user.role})
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `st_auth=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}; SameSite=Lax${secure}`)
  return res.json({ok:true})
}
