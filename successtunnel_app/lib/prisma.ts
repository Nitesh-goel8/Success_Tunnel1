import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getOptimizedDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL
  if (!url) return undefined

  // Supabase Serverless Pooler optimization:
  // Convert port 5432 (session mode max 15) to 6543 (transaction pooler)
  if (url.includes('.pooler.supabase.com:5432')) {
    url = url.replace(':5432', ':6543')
    if (!url.includes('pgbouncer=true')) {
      const sep = url.includes('?') ? '&' : '?'
      url = `${url}${sep}pgbouncer=true&connection_limit=1`
    }
  } else if (!url.includes('connection_limit=') && !url.startsWith('file:')) {
    const sep = url.includes('?') ? '&' : '?'
    url = `${url}${sep}connection_limit=1`
  }
  return url
}

const optimizedUrl = getOptimizedDatabaseUrl()

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: optimizedUrl ? { db: { url: optimizedUrl } } : undefined,
  })

// Persist prisma singleton globally across all environments (including Vercel warm lambdas)
global.prisma = prisma
