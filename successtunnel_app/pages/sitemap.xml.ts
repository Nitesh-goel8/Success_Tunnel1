import { GetServerSideProps } from 'next'
import { prisma } from '../lib/prisma'
import { samplePosts, sampleProperties, sampleServices } from '../lib/sampleData'
import { DEFAULT_SITE_SETTINGS } from '../lib/siteSettings'

function buildUrlXml(url: string, lastmod?: string) {
  return `<url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_SETTINGS.siteUrl).replace(/\/$/, '')
  const staticRoutes = ['/', '/about', '/contact', '/services', '/properties', '/blog', '/resources', '/privacy', '/terms']

  let services = sampleServices
  let properties = sampleProperties
  let posts = samplePosts

  try {
    const [dbServices, dbProperties, dbPosts] = await Promise.all([
      prisma.service.findMany({ select: { slug: true } }),
      prisma.property.findMany({ select: { slug: true } }),
      prisma.blogPost.findMany({ select: { slug: true, publishedAt: true } }),
    ])

    if (dbServices.length > 0) services = dbServices as any
    if (dbProperties.length > 0) properties = dbProperties as any
    if (dbPosts.length > 0) posts = dbPosts as any
  } catch {
    // Fall back to sample routes when the database is unavailable.
  }

  const urls = [
    ...staticRoutes.map((route) => buildUrlXml(`${siteUrl}${route}`)),
    ...services.map((item: any) => buildUrlXml(`${siteUrl}/services/${item.slug}`)),
    ...properties.map((item: any) => buildUrlXml(`${siteUrl}/properties/${item.slug}`)),
    ...posts.map((item: any) =>
      buildUrlXml(`${siteUrl}/blog/${item.slug}`, item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined)
    ),
  ].join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(body)
  res.end()

  return { props: {} }
}

export default function SitemapXml() {
  return null
}
