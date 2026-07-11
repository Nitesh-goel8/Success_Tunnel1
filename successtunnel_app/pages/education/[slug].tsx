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

function Thumbnail({ item }: { item: EducationItem }) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: 220,
        borderRadius: '20px',
        marginBottom: 20,
        backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : 'linear-gradient(135deg, #0b3a86, #165df5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}

export default function EducationItemPage({ item, related }: { item: EducationItem; related: EducationItem[] }) {
  const assetKind = getAssetKind(item)
  const actionHref = item.externalUrl || item.assetUrl || `/education/${item.slug}`

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)', gap: 24, alignItems: 'start' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>{item.contentType}</span>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)', lineHeight: 1.06, letterSpacing: '-0.04em', margin: '14px 0 12px', color: 'var(--primary)' }}>
                {item.title}
              </h1>
              <p style={{ fontSize: '1.02rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: 720 }}>
                {item.excerpt || 'A simple learning item that can be a course, note, video, tool, calculator, or download.'}
              </p>
            </div>
            <div className="hero-board">
              <span className="service-card-kicker">Quick view</span>
              <h3>{EDUCATION_CONTENT_LABELS[item.contentType] || item.contentType}</h3>
              <p>Clean layout, direct file support, and easy admin updates.</p>
              <div className="hero-board-grid">
                <div className="mini-card"><strong>{item.category || 'General'}</strong><span>Category</span></div>
                <div className="mini-card"><strong>{item.isFeatured ? 'Yes' : 'No'}</strong><span>Featured</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <Thumbnail item={item} />

            <div className="article-card" style={{ marginBottom: 24 }}>
              {assetKind === 'video' ? (
                <video controls poster={item.thumbnailUrl || undefined} style={{ width: '100%', display: 'block', background: '#000', maxHeight: 560, borderRadius: 16 }}>
                  <source src={item.assetUrl || undefined} />
                  Your browser does not support the video tag.
                </video>
              ) : assetKind === 'pdf' ? (
                <iframe src={item.assetUrl || undefined} style={{ width: '100%', minHeight: 560, border: 0, borderRadius: 16 }} title={item.title} />
              ) : (
                <div style={{ padding: 18 }}>
                  <h3 style={{ marginTop: 0 }}>About this item</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {item.body || 'Use this space for lesson text, notes, or tool instructions.'}
                  </p>
                </div>
              )}
            </div>

            <div className="article-card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginTop: 0 }}>Summary</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {item.body || 'This placeholder content can be replaced from the dashboard whenever you are ready.'}
              </p>
              <div className="cta-actions" style={{ marginTop: 16 }}>
                <a href={actionHref} target="_blank" rel="noreferrer" className="cta-btn-primary">
                  {item.ctaLabel || 'Open content'}
                </a>
                <Link href="/contact" className="cta-btn-secondary">
                  Request update
                </Link>
              </div>
            </div>

            <div className="section-heading" style={{ textAlign: 'left', marginBottom: 20 }}>
              <span className="eyebrow">Related</span>
              <h2>More learning items</h2>
            </div>

            <div className="services-grid">
              {related.length === 0 ? (
                <div className="article-card" style={{ gridColumn: '1 / -1' }}>
                  <h3>No related items yet</h3>
                  <p>Add more content in the dashboard to build out the learning library.</p>
                </div>
              ) : related.map(entry => (
                <Link key={entry.id} href={`/education/${entry.slug}`} className="service-card">
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      borderRadius: '18px',
                      marginBottom: '14px',
                      backgroundImage: entry.thumbnailUrl ? `url(${entry.thumbnailUrl})` : 'linear-gradient(135deg, #0b3a86, #165df5)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
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
    const unique = Array.from(new Map([...dbItems, ...fallbackItems].map(item => [item.slug, item])).values())

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
    const item = dbItem && dbItem.isPublished ? dbItem : fallbackItem

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
