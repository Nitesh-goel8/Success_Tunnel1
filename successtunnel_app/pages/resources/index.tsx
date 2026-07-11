import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'

const resourceChannels = [
  { title: 'Education Hub', href: '/education', icon: '🎬', desc: 'Courses, notes, tools, downloads, videos, and featured learning content.' },
  { title: 'Blogs & Insights', href: '/blog', icon: '📝', desc: 'Expert commentary, practical guides, and business updates.' },
  { title: 'Downloads', href: '/resources/downloads', icon: '📥', desc: 'PDFs, checklists, and supporting documents for common workflows.' },
  { title: 'FAQs', href: '/resources/faqs', icon: '❓', desc: 'Straight answers to the questions clients ask most often.' },
  { title: 'Calculators', href: '/resources/calculators', icon: '🧮', desc: 'Useful calculators for planning, comparison, and quick estimates.' },
  { title: 'Contact Support', href: '/contact', icon: '☎️', desc: 'Talk to us when you want a more tailored recommendation.' },
]

export default function Resources({ posts }: { posts: any[] }) {
  const recentPosts = posts?.length ? posts : samplePosts

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>
              RESOURCE HUB
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: 800, color: 'var(--primary)', margin: '20px auto 30px' }}>
              Insights, downloads, and quick answers.
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              A central place for useful material that helps clients move faster and make better decisions.
            </p>
          </div>
        </section>

        <section className="section-surface" id="resources-menu">
          <div className="container">
            <div className="expertise-grid">
              {resourceChannels.map(channel => (
                <div key={channel.title} className="expertise-card">
                  <div className="expertise-icon-wrapper">{channel.icon}</div>
                  <h3>{channel.title}</h3>
                  <p>{channel.desc}</p>
                  <Link href={channel.href} className="expertise-card-link">
                    Open channel →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-header-row">
              <div className="section-header-left">
                <span className="eyebrow">EDITORIAL</span>
                <h2>Recent insights</h2>
              </div>
              <Link href="/blog" className="view-all-link">
                Read all articles →
              </Link>
            </div>

            <div className="insights-grid">
              {recentPosts.slice(0, 3).map((post, index) => {
                const blogImages: Record<string, string> = {
                  'navigating-tax': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
                  'financial-foundation': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
                  'education-workflow': 'https://images.unsplash.com/photo-1464938050744-13748f5ad1a2?q=80&w=600&auto=format&fit=crop',
                }
                const imageUrl = blogImages[post.slug] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'

                return (
                  <div key={index} className="insight-card-item" style={{ background: 'var(--surface)' }}>
                    <div className="insight-img-container">
                      <img src={imageUrl} alt={post.title} className="insight-img" />
                    </div>
                    <div className="insight-content" style={{ padding: '24px' }}>
                      <span className="insight-category">{post.category || 'INSIGHT'}</span>
                      <h3 className="insight-title" style={{ fontSize: '1.2rem' }}>{post.title}</h3>
                      <p className="insight-excerpt" style={{ fontSize: '0.92rem' }}>{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`} style={{ marginTop: 'auto', fontWeight: 700, color: 'var(--accent)', fontSize: '0.92rem' }}>
                        Read article →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="container">
          <div className="cta-banner-container">
            <h2>Need a custom checklist or resource set?</h2>
            <div className="cta-actions">
              <Link href="/contact" className="cta-btn-primary">Request resources</Link>
              <Link href="/" className="cta-btn-secondary">Back to homepage</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: 'desc' } })
    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
      revalidate: 60,
    }
  } catch {
    return {
      props: { posts: samplePosts },
      revalidate: 60,
    }
  }
}
