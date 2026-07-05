import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req:NextApiRequest){
  const token = getTokenFromReq(req)
  const payload = verifyToken(token as string)
  return payload
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const user = requireAuth(req)
  if(!user) return res.status(401).json({error:'unauthenticated'})
  if(req.method === 'GET'){
    const services = await prisma.service.findMany()
    return res.json(services)
  }
  if(req.method === 'POST'){
    const {title,slug,excerpt,content,icon} = req.body
    const s = await prisma.service.create({data:{title,slug,excerpt,content,icon}})
    return res.status(201).json(s)
  }
  if(req.method === 'DELETE'){
    const {id} = req.body
    await prisma.service.delete({where:{id}})
    return res.json({ok:true})
  }
  return res.status(405).end()
}
