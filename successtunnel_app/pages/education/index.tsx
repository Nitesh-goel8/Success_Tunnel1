import Link from 'next/link'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import { EDUCATION_CONTENT_DESCRIPTIONS, EDUCATION_CONTENT_LABELS, EDUCATION_CONTENT_TYPES, EDUCATION_FALLBACK_CONTENT } from '../../lib/educationContent'
import { prisma } from '../../lib/prisma'
import { HiArrowRight } from 'react-icons/hi'

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
      style={{
        width: '100%',
        height: '160px',
        borderRadius: '12px',
        marginBottom: '16px',
        backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : 'none',
        backgroundColor: item.thumbnailUrl ? 'transparent' : 'var(--primary)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '14px',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ background: 'rgba(10, 37, 64, 0.85)', padding: '4px 10px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
        {item.contentType}
      </span>
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
      <Head>
        <title>Executive Education &amp; Capacity Building — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Corporate training, taxation modules, practical accounting revision notes, and executive skill development from Success Tunnel."
        />
        <link rel="canonical" href="https://successtunnel.in/education" />
      </Head>

      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
            <div className="editorial-tag" style={{ marginBottom: '20px' }}>
              <span className="editorial-tag-dot" />
              Executive Learning &amp; Upskilling
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: 'var(--primary)',
                margin: '16px auto 24px',
              }}
            >
              Practical Education for Modern Professionals.
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.68' }}>
              Statutory taxation coursework, Tally and GST practicals, corporate finance revision notes, and video modules curated by seasoned practitioners in Panipat.
            </p>
          </div>
        </section>

        {/* Content Type Filter */}
        <section className="container" style={{ paddingBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['All', ...EDUCATION_CONTENT_TYPES].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                style={{
                  border: '1px solid',
                  borderColor: activeType === type ? 'var(--primary)' : 'var(--line)',
                  background: activeType === type ? 'var(--primary)' : '#ffffff',
                  color: activeType === type ? '#ffffff' : 'var(--muted)',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Course Cards Grid */}
        <section className="section-surface" id="courses-list">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <h3 style={{ fontWeight: 800, color: 'var(--primary)' }}>No learning modules published yet</h3>
                  <p>Curated educational content will be uploaded shortly.</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div key={item.id} className="expertise-card" style={{ padding: '24px' }}>
                    <ItemThumb item={item} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {item.category || item.contentType}
                    </span>
                    <h3 style={{ fontSize: '1.18rem', margin: '0 0 10px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: '0 0 18px' }}>
                      {item.excerpt || item.body || EDUCATION_CONTENT_DESCRIPTIONS[item.contentType] || 'Open this learning item.'}
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                      <Link href={`/education/${item.slug}`} className="expertise-card-link">
                        {item.ctaLabel || 'Access Content'} <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Subject Category Breakdown */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Curriculum Structure
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                Specialized Learning Tracks
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {Object.entries(grouped).map(([type, list]) => (
                <div key={type} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Sora, sans-serif' }}>
                    {list.length}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--muted)', marginTop: '4px' }}>
                    {EDUCATION_CONTENT_LABELS[type] || type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Upskilling Advisory CTA */}
        <section className="container" style={{ margin: '48px auto' }}>
          <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '20px', padding: '48px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px' }}>
                Require Custom In-House Corporate Training?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.98rem', margin: 0, maxWidth: '600px' }}>
                We design tailored workshops for accounting departments, finance controllers, and compliance teams in Haryana and NCR.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700, padding: '12px 24px' }}>
                Inquire for Corporate Training &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const rawItems = await prisma.educationContent.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    const items = rawItems.map(item => ({
      ...item,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
      publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
    }))

    return {
      props: {
        items: items.length > 0 ? items : EDUCATION_FALLBACK_CONTENT,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: {
        items: EDUCATION_FALLBACK_CONTENT,
      },
      revalidate: 60,
    }
  }
}
