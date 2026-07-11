import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { samplePosts, sampleProperties, sampleServices } from '../lib/sampleData'
import { EDUCATION_FALLBACK_CONTENT } from '../lib/educationContent'

const prisma = new PrismaClient()

const consultancySubservices = [
  { title: 'Income Tax', slug: 'income-tax', content: 'Income tax filing, planning and compliance support.' },
  { title: 'GST', slug: 'gst', content: 'GST registration, return filing and compliance workflow.' },
  { title: 'MSME Registration', slug: 'msme-registration', content: 'Guided MSME registration support for eligible businesses.' },
  { title: 'Trademark', slug: 'trademark', content: 'Trademark filing and brand protection guidance.' },
]

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@successtunnel.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234'
  const hashed = await bcrypt.hash(adminPassword, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashed
    },
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashed
    }
  })

  for (const service of sampleServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        excerpt: service.excerpt,
        icon: service.icon
      },
      create: {
        title: service.title,
        slug: service.slug,
        excerpt: service.excerpt,
        icon: service.icon
      }
    })
  }

  const consultancy = await prisma.service.findUniqueOrThrow({ where: { slug: 'consultancy' } })

  for (const subservice of consultancySubservices) {
    await prisma.subservice.upsert({
      where: { slug: subservice.slug },
      update: {
        title: subservice.title,
        content: subservice.content,
        serviceId: consultancy.id
      },
      create: {
        ...subservice,
        serviceId: consultancy.id
      }
    })
  }

  for (const property of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {
        title: property.title,
        type: property.type,
        city: property.city,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        images: '[]'
      },
      create: {
        title: property.title,
        slug: property.slug,
        type: property.type,
        city: property.city,
        price: property.price,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        images: '[]'
      }
    })
  }

  for (const post of samplePosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: new Date()
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: new Date()
      }
    })
  }

  for (const item of EDUCATION_FALLBACK_CONTENT) {
    const seedItem = item as any
    await prisma.educationContent.upsert({
      where: { slug: seedItem.slug },
      update: {
        title: seedItem.title,
        contentType: seedItem.contentType,
        category: seedItem.category,
        excerpt: seedItem.excerpt,
        body: seedItem.body,
        thumbnailUrl: seedItem.thumbnailUrl || null,
        assetUrl: seedItem.assetUrl || null,
        externalUrl: seedItem.externalUrl || null,
        ctaLabel: seedItem.ctaLabel || null,
        isPublished: true,
        isFeatured: !!seedItem.isFeatured,
        showOnHomePopup: !!seedItem.showOnHomePopup,
        publishedAt: new Date(),
      },
      create: {
        title: seedItem.title,
        slug: seedItem.slug,
        contentType: seedItem.contentType,
        category: seedItem.category || null,
        excerpt: seedItem.excerpt || null,
        body: seedItem.body || null,
        thumbnailUrl: seedItem.thumbnailUrl || null,
        assetUrl: seedItem.assetUrl || null,
        externalUrl: seedItem.externalUrl || null,
        ctaLabel: seedItem.ctaLabel || null,
        isPublished: true,
        isFeatured: !!seedItem.isFeatured,
        showOnHomePopup: !!seedItem.showOnHomePopup,
        publishedAt: new Date(),
      }
    })
  }

  console.log('Seed completed')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
