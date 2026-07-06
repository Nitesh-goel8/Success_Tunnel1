import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method === 'GET'){
    const services = await prisma.service.findMany({
      include: { subservices: true },
      orderBy: { createdAt: 'asc' }
    })
    return res.json(services)
  }
  return res.status(405).end()
}
