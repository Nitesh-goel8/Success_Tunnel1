import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getTokenFromReq, verifyToken } from '../../../lib/auth'

function requireAuth(req:NextApiRequest){
  const token = getTokenFromReq(req)
  const payload = verifyToken(token)
  return payload
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const user = requireAuth(req)
  if(!user) return res.status(401).json({error:'unauthenticated'})

  if(req.method === 'GET'){
    const properties = await prisma.property.findMany()
    return res.json(properties)
  }

  if(req.method === 'POST'){
    const {title,slug,type,city,price,area,bedrooms,bathrooms,description,images} = req.body
    const p = await prisma.property.create({
      data: {
        title,
        slug,
        type: type || 'Residential',
        city,
        price: parseFloat(price || '0'),
        area,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        description,
        images: images || '[]'
      }
    })
    return res.status(201).json(p)
  }

  if(req.method === 'DELETE'){
    const {id} = req.body
    await prisma.property.delete({where:{id}})
    return res.json({ok:true})
  }

  return res.status(405).end()
}
