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
    const exportCsv = req.query.export === 'csv'
    const enquiries = await prisma.enquiry.findMany({orderBy:{createdAt:'desc'}})
    if(exportCsv){
      const header = 'id,name,email,phone,city,service,message,createdAt\n'
      const rows = enquiries.map(e=> `${e.id},"${e.name}","${e.email}","${e.phone}","${e.city||''}","${e.service||''}","${(e.message||'').replace(/"/g,'""')}","${e.createdAt.toISOString()}"`).join('\n')
      res.setHeader('Content-Type','text/csv')
      res.setHeader('Content-Disposition','attachment; filename="enquiries.csv"')
      return res.send(header+rows)
    }
    return res.json(enquiries)
  }
  return res.status(405).end()
}
