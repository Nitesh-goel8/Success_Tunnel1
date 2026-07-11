import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { EDUCATION_CONTENT_LABELS, EDUCATION_FALLBACK_CONTENT } from '../../lib/educationContent'

type EducationItem = {
  id: number
  title: string
  slug: string
  contentType: string
  category?: string | null
  excerpt?: string | null
  body?: string | null
  thumbnailUrl?: string | null
  assetUrl?: string | null
  externalUrl?: string | null
  ctaLabel?: string | null
  isFeatured: boolean
  publishedAt?: string | null
}

function getAssetKind(item: EducationItem) {
  const url = (item.assetUrl || '').toLowerCase()
  if (item.contentType === 'Video' || url.endsWith('.mp4') || url.includes('video')) return 'video'
  if (item.contentType === 'Download' || url.endsWith('.pdf')) return 'pdf'
  return 'generic'
}

export default function EducationItemPage({ item, related }: { item: EducationItem; related: EducationItem[] }) {
  const assetKind = getAssetKind(item)
  const actionHref = item.externalUrl || item.assetUrl || `/education/${item.slug}`

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)', gap: 24, alignItems: 'start' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>{item.contentType}</span>
              <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.04em', margin: '16px 0 16px', color: 'var(--primary)' }}>
                {item.title}
              </h1>
              <p style={{ fontSize: '1.08rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: 760 }}>
                {item.excerpt || item.body || 'This content item is managed from the education dashboard and can represent a course, note, video, tool, calculator, or download.'}
              </p>
            </div>
            <div className="hero-board">
              <span className="service-card-kicker">Content details</span>
              <h3>{EDUCATION_CONTENT_LABELS[item.contentType] || item.contentType}</h3>
              <p>Direct files, study notes, tools, and learning resources can all use the same content flow.</p>
              <div className="hero-board-grid">
                <div className="mini-card"><strong>{item.category || 'General'}</strong><span>Category</span></div>
                <div className="mini-card"><strong>{item.isFeatured ? 'Yes' : 'No'}</strong><span>Featured</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div className="article-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
              {assetKind === 'video' ? (
                <video controls poster={item.thumbnailUrl || undefined} style={{ width: '100%', display: 'block', background: '#000', maxHeight: 640 }}>
                  <source src={item.assetUrl || undefined} />
                  Your browser does not support the video tag.
                </video>
              ) : assetKind === 'pdf' ? (
                <iframe src={item.assetUrl || undefined} style={{ width: '100%', minHeight: 640, border: 0 }} title={item.title} />
              ) : (
                <div style={{ padding: 28 }}>
                  <h3 style={{ marginTop: 0 }}>This learning item uses a standard content layout.</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                    If you later attach a direct file or external tool, it will be linked through the same dashboard fields.
                  </p>
                </div>
              )}
            </div>

            <div className="article-card" style={{ marginBottom: 28 }}>
              <h3 style={{ marginTop: 0 }}>About this item</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {item.body || 'Use this space for course notes, lesson structure, instructions, or a full article body.'}
              </p>
              <div className="cta-actions" style={{ marginTop: 20 }}>
                <a href={actionHref} target="_blank" rel="noreferrer" className="cta-btn-primary">
                  {item.ctaLabel || 'Open content'}
                </a>
                <Link href="/admin/education" className="cta-btn-secondary">
                  Manage in admin
                </Link>
              </div>
            </div>

            <div className="section-heading" style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="eyebrow">Related</span>
              <h2>More learning content</h2>
            </div>

            <div className="services-grid">
              {related.length === 0 ? (
                <div className="article-card" style={{ gridColumn: '1 / -1' }}>
                  <h3>No related items yet</h3>
                  <p>Add more content in the dashboard to build the learning library.</p>
                </div>
              ) : related.map(entry => (
                <Link key={entry.id} href={`/education/${entry.slug}`} className="service-card">
                  <div className="service-card-icon">✦</div>
                  <div className="service-card-kicker">{entry.contentType}</div>
                  <h3>{entry.title}</h3>
                  <p>{entry.excerpt || entry.body || 'Open this learning item.'}</p>
                  <span className="service-card-cta">{entry.ctaLabel || 'Open content'} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const dbItems = await prisma.educationContent.findMany({
      where: { isPublished: true },
      select: { slug: true },
    })
    const fallbackItems = EDUCATION_FALLBACK_CONTENT.map(item => ({ slug: item.slug }))
    const all = [...dbItems, ...fallbackItems]
    const unique = Array.from(new Map(all.map(item => [item.slug, item])).values())

    return {
      paths: unique.map(item => ({ params: { slug: item.slug } })),
      fallback: false,
    }
  } catch {
    return {
      paths: EDUCATION_FALLBACK_CONTENT.map(item => ({ params: { slug: item.slug } })),
      fallback: false,
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug || '')

  try {
    const dbItem = await prisma.educationContent.findUnique({ where: { slug } })
    const fallbackItem = EDUCATION_FALLBACK_CONTENT.find(item => item.slug === slug)
    const item = dbItem && dbItem.isPublished
      ? dbItem
      : fallbackItem

    if (!item) return { notFound: true }

    const currentId = (item as any).id || 0

    const relatedDb = await prisma.educationContent.findMany({
      where: {
        isPublished: true,
        id: { not: currentId },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 3,
    })

    const relatedFallback = EDUCATION_FALLBACK_CONTENT.filter(entry => entry.slug !== slug).slice(0, 3)
    const related = relatedDb.length > 0
      ? relatedDb
      : relatedFallback.map((entry, index) => ({
          ...entry,
          id: index + 1000,
          isFeatured: !!(entry as any).isFeatured,
          publishedAt: new Date().toISOString(),
        }))

    return {
      props: {
        item: JSON.parse(JSON.stringify(item)),
        related: JSON.parse(JSON.stringify(related)),
      },
      revalidate: 60,
    }
  } catch {
    const fallbackItem = EDUCATION_FALLBACK_CONTENT.find(item => item.slug === slug)
    if (!fallbackItem) return { notFound: true }
    const related = EDUCATION_FALLBACK_CONTENT.filter(entry => entry.slug !== slug).slice(0, 3).map((entry, index) => ({
      ...entry,
      id: index + 1000,
      isFeatured: !!(entry as any).isFeatured,
      publishedAt: new Date().toISOString(),
    }))
    return {
      props: {
        item: {
          ...fallbackItem,
          id: 1,
          isFeatured: !!(fallbackItem as any).isFeatured,
          publishedAt: new Date().toISOString(),
        },
        related,
      },
      revalidate: 60,
    }
  }
}
