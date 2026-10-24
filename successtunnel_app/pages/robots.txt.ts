import { GetServerSideProps } from 'next'
import { DEFAULT_SITE_SETTINGS } from '../lib/siteSettings'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_SETTINGS.siteUrl
  const body = `User-agent: *
Allow: /
Disallow: /portal/
Disallow: /admin/
Disallow: /api/
Disallow: /client/

Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain')
  res.write(body)
  res.end()

  return { props: {} }
}

export default function RobotsTxt() {
  return null
}
