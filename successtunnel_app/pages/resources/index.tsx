import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { samplePosts } from '../../lib/sampleData'

const resourceChannels = [
  { title: 'Education Hub', href: '/education', icon: '🎬', desc: 'Courses, notes, tools, downloads, videos, and featured learning content.' },
  { title: 'Blogs & Insights', href: '/blog', icon: '📝', desc: 'Expert commentary, market trends, and policy updates.' },
  { title: 'Downloads', href: '/resources/downloads', icon: '📥', desc: 'Essential PDFs, tax filing checklists, and registration forms.' },
  { title: 'Templates', href: '#', icon: '📁', desc: 'Financial planning spreadsheets, sample agreement drafts, and calculators.' },
  { title: 'Guides', href: '#', icon: '📚', desc: 'Detailed booklets on corporate setup, real estate buying, and investment.' },
  { title: 'FAQs', href: '/resources/faqs', icon: '❓', desc: 'Searchable answers to common questions about our services.' },
  { title: 'News & Press', href: '#', icon: '📰', desc: 'Announcements, company updates, and regulatory announcements.' },
]

export default function Resources() {
  return (
    <div>
      <Nav />
      <main>
        {/* Resources Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>RESOURCE HUB</span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
              lineHeight: '1.1', 
              letterSpacing: '-0.04em',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: '20px auto 30px'
            }}>
              Insights, Downloads &amp; FAQs
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              Your central source for forms, checklists, guides, and corporate insights designed to save you time.
            </p>
          </div>
        </section>

        {/* Resources Menu Grid */}
        <section className="section-surface" id="resources-menu">
          <div className="container">
            <div className="expertise-grid">
              {resourceChannels.map((chan, i) => (
                <div key={i} className="expertise-card">
                  <div className="expertise-icon-wrapper">{chan.icon}</div>
                  <h3>{chan.title}</h3>
                  <p>{chan.desc}</p>
                  {chan.href !== '#' ? (
                    <Link href={chan.href} className="expertise-card-link">
                      Access Channel &rarr;
                    </Link>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 700 }}>
                      Coming Soon &bull; Future Launch
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Latest Blogs */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-header-row">
              <div className="section-header-left">
                <span className="eyebrow">EDITORIAL</span>
                <h2>Recent Insights</h2>
              </div>
              <Link href="/blog" className="view-all-link">
                Read All Articles &rarr;
              </Link>
            </div>

            <div className="insights-grid">
              {samplePosts.slice(0, 3).map((post, i) => {
                const blogImages: Record<string, string> = {
                  'navigating-tax': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
                  'financial-foundation': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
                  'education-workflow': 'https://images.unsplash.com/photo-1464938050744-13748f5ad1a2?q=80&w=600&auto=format&fit=crop'
                }
                const imageUrl = blogImages[post.slug] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'

                return (
                  <div key={i} className="insight-card-item" style={{ background: 'var(--surface)' }}>
                    <div className="insight-img-container">
                      <img src={imageUrl} alt={post.title} className="insight-img" />
                    </div>
                    <div className="insight-content" style={{ padding: '24px' }}>
                      <span className="insight-category">{post.category || 'INSIGHT'}</span>
                      <h3 className="insight-title" style={{ fontSize: '1.2rem' }}>{post.title}</h3>
                      <p className="insight-excerpt" style={{ fontSize: '0.92rem' }}>{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`} style={{ marginTop: 'auto', fontWeight: 700, color: 'var(--accent)', fontSize: '0.92rem' }}>
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Need Custom Templates or Specific Checklists?</h2>
            <div className="cta-actions">
              <Link href="/contact" className="cta-btn-primary">Request Resources</Link>
              <Link href="/" className="cta-btn-secondary">Back to Homepage</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
