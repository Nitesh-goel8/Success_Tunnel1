import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbUrl = process.env.DATABASE_URL || ''
  const sanitizedUrl = dbUrl.replace(/:[^:@]+@/, ':***@')

  const report: any = {
    sanitizedUrl,
    dbConnected: false,
    migrations: [],
    users: [],
    errors: [],
  }

  try {
    // 1. Add all missing columns to User table
    const alterStatements = [
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "departmentId" INTEGER;',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT \'active\';',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;',
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;',
    ]

    for (const stmt of alterStatements) {
      try {
        await prisma.$executeRawUnsafe(stmt)
        report.migrations.push(`OK: ${stmt}`)
      } catch (err: any) {
        report.migrations.push(`ERR: ${stmt} -> ${err.message}`)
      }
    }

    // 2. Ensure Department table exists
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Department" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT UNIQUE NOT NULL,
          "code" TEXT UNIQUE NOT NULL,
          "description" TEXT,
          "headId" INTEGER,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `)
      report.migrations.push('OK: Department table verified')
    } catch (deptErr: any) {
      report.migrations.push(`ERR: Department table -> ${deptErr.message}`)
    }

    // 3. Ensure EmployeeProfile table exists
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "EmployeeProfile" (
          "id" SERIAL PRIMARY KEY,
          "userId" INTEGER UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
          "employeeCode" TEXT UNIQUE NOT NULL,
          "designation" TEXT NOT NULL,
          "workLocation" TEXT NOT NULL DEFAULT 'Headquarters',
          "employmentType" TEXT NOT NULL DEFAULT 'Full-time',
          "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "emergencyContact" TEXT,
          "managerId" INTEGER,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "isDemo" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `)
      report.migrations.push('OK: EmployeeProfile table verified')
    } catch (empErr: any) {
      report.migrations.push(`ERR: EmployeeProfile table -> ${empErr.message}`)
    }

    // 4. Seed / Update niteshgoel@successtunnel.in with super_admin & password Nitesh@2005!
    const email = 'niteshgoel@successtunnel.in'
    const hashedPassword = await bcrypt.hash('Nitesh@2005!', 10)

    try {
      const existingUser: any = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, role: true },
      })

      if (existingUser) {
        await prisma.$executeRawUnsafe(`
          UPDATE "User"
          SET "password" = '${hashedPassword}', "role" = 'super_admin', "status" = 'active'
          WHERE "email" = '${email}';
        `)
        report.userStatus = `Updated existing user #${existingUser.id} to super_admin with Nitesh@2005!`
      } else {
        await prisma.$executeRawUnsafe(`
          INSERT INTO "User" ("email", "password", "name", "role", "status")
          VALUES ('${email}', '${hashedPassword}', 'Nitesh Goel', 'super_admin', 'active');
        `)
        report.userStatus = `Created new super_admin user ${email} with Nitesh@2005!`
      }
    } catch (userErr: any) {
      report.userError = userErr.message
    }

    // List all users in DB
    try {
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, role: true, status: true },
      })
      report.users = allUsers
    } catch (listErr: any) {
      report.listError = listErr.message
    }

    report.dbConnected = true
    return res.status(200).json(report)
  } catch (err: any) {
    report.fatalError = err.message
    return res.status(500).json(report)
  }
}
