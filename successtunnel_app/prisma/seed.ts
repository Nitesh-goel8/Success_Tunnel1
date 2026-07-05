import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@successtunnel.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234'
  const hashed = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashed
    }
  })

  const consultancy = await prisma.service.upsert({
    where: { slug: 'consultancy' },
    update: {},
    create: {
      title: 'Consultancy',
      slug: 'consultancy',
      excerpt: 'Strategic advisory services.'
    }
  })

  await prisma.subservice.createMany({
    data: [
      { serviceId: consultancy.id, title: 'Income Tax', slug: 'income-tax', content: 'Income tax services.' },
      { serviceId: consultancy.id, title: 'GST', slug: 'gst', content: 'GST registration and compliance.' }
    ]
  })

  await prisma.property.createMany({
    data: [
      { title: 'Luxury Villa', slug: 'luxury-villa', type: 'Residential', city: 'Mumbai', price: 12500000, area: '4500 sqft', bedrooms: 4, bathrooms: 4, images: '[]' }
    ]
  })

  console.log('Seed completed')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
