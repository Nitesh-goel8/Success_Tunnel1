import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const {name,email,phone,city,service,message,page} = req.body
  if(!name || !email) return res.status(400).json({error:'name and email required'})
  try{
    const e = await prisma.enquiry.create({data:{name,email,phone,city,service,message,page}})
    // TODO: send email notification (SMTP)
    return res.status(201).json({ok:true,id:e.id})
  }catch(err){
    console.error(err)
    return res.status(500).json({error:'server error'})
  }
}
