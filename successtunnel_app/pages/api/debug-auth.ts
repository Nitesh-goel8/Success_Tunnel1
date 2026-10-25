import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbUrl = process.env.DATABASE_URL || ''
  const sanitizedUrl = dbUrl.replace(/:[^:@]+@/, ':***@') // hide password

  const report: any = {
    sanitizedUrl,
    nodeEnv: process.env.NODE_ENV,
    dbConnected: false,
    tables: [],
    error: null,
  }

  try {
    // Test 1: Check connection
    if (dbUrl.startsWith('file:') || !dbUrl.includes('postgres')) {
      report.note = 'DATABASE_URL appears to be SQLite or file-based.'
    }

    // Try a simple ping
    try {
      const ping = await prisma.$queryRawUnsafe('SELECT 1 as ping')
      report.dbConnected = true
      report.ping = ping
    } catch (pingErr: any) {
      report.pingError = pingErr.message
    }

    // Test 2: Check User table schema
    try {
      const userCount = await prisma.user.count()
      report.userCount = userCount
    } catch (countErr: any) {
      report.userCountError = countErr.message
    }

    // Test 3: Auto-heal departmentId column
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "departmentId" INTEGER;')
      report.alterUserStatus = 'Successfully executed ALTER TABLE User ADD COLUMN IF NOT EXISTS departmentId'
    } catch (alterErr: any) {
      try {
        await prisma.$executeRawUnsafe('ALTER TABLE User ADD COLUMN departmentId INTEGER;')
        report.alterUserStatus = 'Successfully executed SQLite ALTER TABLE User ADD COLUMN departmentId'
      } catch (alterErr2: any) {
        report.alterUserError = alterErr2.message
      }
    }

    // Test 4: Ensure Nitesh Goel user exists with super_admin role
    try {
      const hashedPassword = await bcrypt.hash('Nitesh@2005!', 10)
      const existing = await prisma.user.findUnique({
        where: { email: 'niteshgoel@successtunnel.in' },
        select: { id: true, email: true, role: true },
      })

      if (existing) {
        await prisma.user.update({
          where: { email: 'niteshgoel@successtunnel.in' },
          data: {
            password: hashedPassword,
            role: 'super_admin',
            status: 'active',
          },
        })
        report.userSeeded = 'Updated existing Nitesh Goel to super_admin'
      } else {
        await prisma.user.create({
          data: {
            name: 'Nitesh Goel',
            email: 'niteshgoel@successtunnel.in',
            password: hashedPassword,
            role: 'super_admin',
            status: 'active',
          },
        })
        report.userSeeded = 'Created new super_admin user Nitesh Goel'
      }
    } catch (seedErr: any) {
      report.userSeedError = seedErr.message
    }

    return res.status(200).json(report)
  } catch (err: any) {
    report.fatalError = err.message
    return res.status(200).json(report)
  }
}
