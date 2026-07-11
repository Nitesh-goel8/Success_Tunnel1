import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import { EDUCATION_CONTENT_DESCRIPTIONS, EDUCATION_CONTENT_LABELS, EDUCATION_CONTENT_TYPES, EDUCATION_FALLBACK_CONTENT } from '../../lib/educationContent'
import { prisma } from '../../lib/prisma'

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
  showOnHomePopup: boolean
  publishedAt?: string | null
}

function groupByType(items: EducationItem[]) {
  return items.reduce((acc, item) => {
    const key = item.contentType || 'Course'
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {} as Record<string, EducationItem[]>)
}

function ItemThumb({ item }: { item: EducationItem }) {
  return (
    <div
      className="service-card-icon"
      style={{
        width: '100%',
        height: '160px',
        borderRadius: '18px',
        marginBottom: '14px',
        backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : 'linear-gradient(135deg, #0b3a86, #165df5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '14px',
        color: '#fff',
        fontWeight: 800,
        fontSize: '0.95rem',
      }}
    >
      {item.contentType}
    </div>
  )
}

export default function EducationIndex({ items }: { items: EducationItem[] }) {
  const [activeType, setActiveType] = useState('All')
  const featured = items.find(item => item.isFeatured) || items[0] || null
  const grouped = useMemo(() => groupByType(items), [items])
  const filteredItems = activeType === 'All' ? items : items.filter(item => item.contentType === activeType)

  return (
    <div>
      <Nav />
      <main>
        <section
          className="section-surface"
          style={{
            paddingTop: '76px',
            paddingBottom: '26px',
            background: 'linear-gradient(180deg, rgba(22, 93, 245, 0.05), transparent)',
          }}
        >
          <div className="container">
            <div style={{ maxWidth: 760 }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>
                EDUCATION
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.04em',
                  margin: '14px 0 10px',
                  color: 'var(--primary)',
                }}
              >
                Simple learning content in one place.
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: 700, lineHeight: 1.65, margin: 0 }}>
                Publish notes, videos, courses, and tools from the dashboard and keep them organized for students.
              </p>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
              {['All', ...EDUCATION_CONTENT_TYPES].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`btn ${activeType === type ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '9px 14px', borderRadius: 999 }}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="services-grid">
              {filteredItems.length === 0 ? (
                <div className="article-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <h3>No items yet</h3>
                  <p>Add education content from the admin dashboard and it will appear here.</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <Link key={item.id} href={`/education/${item.slug}`} className="service-card">
                    <ItemThumb item={item} />
                    <div className="service-card-kicker">{item.contentType}</div>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt || item.body || EDUCATION_CONTENT_DESCRIPTIONS[item.contentType] || 'Open this learning item.'}</p>
                    <span className="service-card-cta">{item.ctaLabel || 'Open content'} -&gt;</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'left', marginBottom: 20 }}>
              <span className="eyebrow">Library</span>
              <h2>Learning categories</h2>
            </div>
            <div className="hero-board-grid">
              {Object.keys(grouped).length === 0 ? (
                <div className="mini-card" style={{ gridColumn: '1 / -1' }}>
                  <strong>Ready</strong>
                  <span>Seeded items are available to show the structure.</span>
                </div>
              ) : (
                Object.entries(grouped).map(([type, list]) => (
                  <div key={type} className="mini-card">
                    <strong>{list.length}</strong>
                    <span>{EDUCATION_CONTENT_LABELS[type] || type}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {featured && (
          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div className="section-heading" style={{ textAlign: 'left', marginBottom: 20 }}>
                <span className="eyebrow">Featured content</span>
                <h2>One highlighted item below the main library.</h2>
                <p>Use this as a subtle promo for a course, video, note, or tool without crowding the page.</p>
              </div>
              <div
                className="callout-banner"
                style={{
                  marginBottom: 0,
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: 18,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    minHeight: '120px',
                    borderRadius: '18px',
                    backgroundImage: featured.thumbnailUrl ? `url(${featured.thumbnailUrl})` : 'linear-gradient(135deg, #0b3a86, #165df5)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div>
                  <span className="eyebrow" style={{ marginBottom: 8, display: 'inline-block' }}>
                    {featured.contentType || 'Education'}
                  </span>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem' }}>{featured.title}</h3>
                  <p style={{ maxWidth: 700, margin: '0 0 14px' }}>
                    {featured.excerpt || featured.body || 'Featured learning content from the dashboard.'}
                  </p>
                  <div className="cta-actions">
                    <Link href={`/education/${featured.slug}`} className="cta-btn-primary">
                      {featured.ctaLabel || 'Open item'}
                    </Link>
                    <Link href="/admin/education" className="cta-btn-secondary">
                      Manage content
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const items = await prisma.educationContent.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    const nextItems =
      items.length > 0
        ? items
        : EDUCATION_FALLBACK_CONTENT.map((item, index) => ({
            ...item,
            id: index + 1,
            showOnHomePopup: !!(item as any).showOnHomePopup,
            publishedAt: new Date().toISOString(),
          }))

    return {
      props: { items: JSON.parse(JSON.stringify(nextItems)) },
      revalidate: 60,
    }
  } catch {
    return {
      props: {
        items: EDUCATION_FALLBACK_CONTENT.map((item, index) => ({
          ...item,
          id: index + 1,
          showOnHomePopup: !!(item as any).showOnHomePopup,
          publishedAt: new Date().toISOString(),
        })),
      },
      revalidate: 60,
    }
  }
}
