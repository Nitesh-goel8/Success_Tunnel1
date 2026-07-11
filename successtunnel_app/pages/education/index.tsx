import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GetStaticProps } from 'next'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { EDUCATION_CONTENT_DESCRIPTIONS, EDUCATION_CONTENT_LABELS, EDUCATION_FALLBACK_CONTENT, EDUCATION_CONTENT_TYPES } from '../../lib/educationContent'

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

const STUDENT_TOOLS = [
  { title: 'Study Planner', href: '/resources/downloads', desc: 'Printable planner sheets and revision schedules.' },
  { title: 'FAQ Finder', href: '/resources/faqs', desc: 'Answer common student and parent questions.' },
  { title: 'Growth Blog', href: '/blog', desc: 'Editorial content for learners and parents.' },
  { title: 'Calculator Lab', href: '/resources/calculators', desc: 'Simple tools for EMI, SIP, and eligibility checks.' },
]

function groupByType(items: EducationItem[]) {
  return items.reduce((acc, item) => {
    const key = item.contentType || 'Course'
    acc[key] = acc[key] || []
    acc[key].push(item)
    return acc
  }, {} as Record<string, EducationItem[]>)
}

export default function EducationIndex({ items }: { items: EducationItem[] }) {
  const [activeType, setActiveType] = useState('All')

  const featured = items.find(item => item.isFeatured) || items[0] || null
  const grouped = useMemo(() => groupByType(items), [items])

  const filteredItems = activeType === 'All' ? items : items.filter(item => item.contentType === activeType)

  const statCards = [
    { value: String(items.length).padStart(2, '0'), label: 'Learning items' },
    { value: String(items.filter(item => item.contentType === 'Course').length).padStart(2, '0'), label: 'Courses' },
    { value: String(items.filter(item => item.contentType === 'Note').length).padStart(2, '0'), label: 'Notes' },
    { value: String(items.filter(item => item.contentType === 'Tool' || item.contentType === 'Calculator').length).padStart(2, '0'), label: 'Tools' },
  ]

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '56px' }}>
          <div className="container" style={{ maxWidth: '980px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>EDUCATION HUB</span>
            <h1 style={{ fontSize: 'clamp(2.9rem, 6vw, 4.8rem)', lineHeight: 1.03, letterSpacing: '-0.04em', margin: '16px 0 18px', color: 'var(--primary)' }}>
              A full learning environment for students, notes, courses, and tools.
            </h1>
            <p style={{ fontSize: '1.12rem', color: 'var(--muted)', maxWidth: 820, lineHeight: 1.7 }}>
              This is the education zone of the website. You can publish videos, course pages, revision notes, PDFs, tools, calculators, and guides from the admin dashboard.
            </p>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div className="hero-board-grid" style={{ marginBottom: 28 }}>
              {statCards.map(card => (
                <div key={card.label} className="mini-card">
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                </div>
              ))}
            </div>

            {featured && (
              <div className="callout-banner" style={{ marginBottom: 28 }}>
                <span className="eyebrow" style={{ marginBottom: 10, display: 'inline-block' }}>Featured content</span>
                <h2 style={{ margin: '0 0 8px' }}>{featured.title}</h2>
                <p style={{ maxWidth: 760 }}>{featured.excerpt || featured.body || 'Featured educational content from the admin dashboard.'}</p>
                <div className="cta-actions">
                  <Link href={`/education/${featured.slug}`} className="cta-btn-primary">{featured.ctaLabel || 'Open item'}</Link>
                  <Link href="/admin/education" className="cta-btn-secondary">Manage content</Link>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {['All', ...EDUCATION_CONTENT_TYPES].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`btn ${activeType === type ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px 16px', borderRadius: 999 }}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="services-grid">
              {filteredItems.length === 0 ? (
                <div className="article-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <h3>No content in this filter yet</h3>
                  <p>Add items in the admin dashboard and they will appear here automatically.</p>
                </div>
              ) : filteredItems.map(item => (
                <Link key={item.id} href={`/education/${item.slug}`} className="service-card">
                  <div className="service-card-icon">▶</div>
                  <div className="service-card-kicker">{item.contentType}</div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt || item.body || EDUCATION_CONTENT_DESCRIPTIONS[item.contentType] || 'Open this learning item.'}</p>
                  <span className="service-card-cta">{item.ctaLabel || 'Open content'} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="eyebrow">Student environment</span>
              <h2>Built like a real education site.</h2>
              <p>These sections give you a richer learning environment even before you add all your final content.</p>
            </div>
            <div className="services-grid">
              {STUDENT_TOOLS.map(tool => (
                <Link key={tool.title} href={tool.href} className="service-card">
                  <div className="service-card-icon">✦</div>
                  <div className="service-card-kicker">Student tool</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  <span className="service-card-cta">Open section →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="eyebrow">Library</span>
              <h2>Grouped learning paths</h2>
              <p>Courses, notes, videos, tools, downloads, guides, calculators, and quizzes all live in one system.</p>
            </div>
            <div className="hero-board-grid">
              {Object.keys(grouped).length === 0 ? (
                <div className="mini-card" style={{ gridColumn: '1 / -1' }}>
                  <strong>Dummy content ready</strong>
                  <span>Seed some items from the admin dashboard or run the seed command.</span>
                </div>
              ) : Object.entries(grouped).map(([type, list]) => (
                <div key={type} className="mini-card">
                  <strong>{list.length}</strong>
                  <span>{EDUCATION_CONTENT_LABELS[type] || type}</span>
                </div>
              ))}
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
    const items = await prisma.educationContent.findMany({
      where: { isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    const nextItems = items.length > 0 ? items : EDUCATION_FALLBACK_CONTENT.map((item, index) => ({
      ...item,
      id: index + 1,
      showOnHomePopup: !!(item as any).showOnHomePopup,
      publishedAt: new Date().toISOString(),
    }))

    return {
      props: {
        items: JSON.parse(JSON.stringify(nextItems)),
      },
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
