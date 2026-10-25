import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'niteshgoel@successtunnel.in'
  const rawPassword = 'Nitesh@2005!'
  const hashedPassword = await bcrypt.hash(rawPassword, 10)

  console.log(`Setting up super_admin account for: ${email}`)

  // Ensure an executive department exists
  let dept = await prisma.department.findFirst({
    where: { code: 'EXEC' }
  })

  if (!dept) {
    dept = await prisma.department.create({
      data: {
        name: 'Executive Leadership',
        code: 'EXEC',
        description: 'Managing Director & Strategic Corporate Counsel',
      }
    })
    console.log('Created Executive Leadership Department:', dept.id)
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { employeeProfile: true }
  })

  let user
  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: {
        name: 'Nitesh Goel',
        password: hashedPassword,
        role: 'super_admin',
        status: 'active',
        departmentId: dept.id,
      }
    })
    console.log(`Updated existing user #${user.id} with new password and super_admin privileges.`)
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Nitesh Goel',
        email,
        password: hashedPassword,
        role: 'super_admin',
        status: 'active',
        departmentId: dept.id,
      }
    })
    console.log(`Created new super_admin user #${user.id}`)
  }

  // Ensure employee profile exists
  await prisma.employeeProfile.upsert({
    where: { userId: user.id },
    update: {
      designation: 'Managing Director & Principal Architect',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    },
    create: {
      userId: user.id,
      employeeCode: 'ST-DIR-001',
      designation: 'Managing Director & Principal Architect',
      workLocation: 'Headquarters',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    }
  })

  console.log('EmployeeProfile linked successfully.')
  console.log('Verification test:')
  const verifyMatch = await bcrypt.compare(rawPassword, user.password)
  console.log(`Password verification matches: ${verifyMatch}`)
}

main()
  .catch((err) => {
    console.error('Error seeding user:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
