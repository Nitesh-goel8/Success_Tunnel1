import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `st_auth=deleted; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`)
  return res.json({ok:true})
}
