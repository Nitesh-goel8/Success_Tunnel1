import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method === 'GET'){
    const properties = await prisma.property.findMany({orderBy:{createdAt:'desc'}})
    return res.json(properties)
  }
  return res.status(405).end()
}
