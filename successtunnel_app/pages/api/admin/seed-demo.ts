import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Check existing tables in public schema
    const tables: any = await prisma.$queryRawUnsafe(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)

    const tableNames = tables.map((t: any) => t.table_name)

    return res.status(200).json({
      ok: true,
      tables: tableNames,
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
