import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getOptimizedDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL
  if (!url || url.startsWith('file:')) return url

  try {
    const parsed = new URL(url)
    const isSupabasePooler = parsed.hostname.includes('pooler.supabase.com')

    // If Supabase pooler is configured on port 5432 (session mode limit 15), switch to port 6543 (transaction pooler)
    if (isSupabasePooler && parsed.port === '5432') {
      parsed.port = '6543'
    }

    // When connecting via port 6543 or pooler, enable pgbouncer mode for Prisma compatibility
    if (parsed.port === '6543' || isSupabasePooler) {
      if (!parsed.searchParams.has('pgbouncer')) {
        parsed.searchParams.set('pgbouncer', 'true')
      }
    }

    // Set connection limit to 5 per serverless lambda (allows concurrent Promise.all without connection starvation)
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '5')
    }

    // Fail-fast connection & pool timeouts (10 seconds) instead of hanging indefinitely
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '10')
    }
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '10')
    }

    return parsed.toString()
  } catch (e) {
    return url
  }
}

const optimizedUrl = getOptimizedDatabaseUrl()

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: optimizedUrl ? { db: { url: optimizedUrl } } : undefined,
  })

// Persist prisma singleton globally across all environments (including Vercel warm lambdas)
global.prisma = prisma
