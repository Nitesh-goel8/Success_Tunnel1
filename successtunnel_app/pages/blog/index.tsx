import { useMemo, useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'

const DEFAULT_TOPICS = ['Consultancy', 'Finance', 'Education', 'Investment', 'Real Estate']

export default function Blog({ posts }: { posts: any[] }) {
  const blogItems = useMemo(
    () => Array.from(new Map([...(posts || []), ...samplePosts].map(item => [item.slug, item])).values()),
    [posts]
  )
  const [activeTopic, setActiveTopic] = useState('All')

  const topics = useMemo(() => {
    const derived = Array.from(new Set(blogItems.map(item => item.category).filter(Boolean)))
    return ['All', ...derived, ...DEFAULT_TOPICS.filter(topic => !derived.includes(topic))].slice(0, 8)
  }, [blogItems])

  const featured = blogItems[0]
  const filteredPosts = blogItems.filter(post => {
    if (activeTopic === 'All') return true
    return post.category?.toLowerCase() === activeTopic.toLowerCase()
  })

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Insights</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Practical ideas for better decisions.
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                Clear, useful writing across consultancy, finance, education, investment, and property.
              </p>
              <div className="hero-actions">
                <a href="#latest" className="btn btn-primary">
                  Read latest
                </a>
                <a href="/contact" className="btn btn-secondary">
                  Talk to advisory
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Featured article</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                {featured?.title || 'Navigating Tax Regulations'}
              </h2>
              <p style={{ marginTop: 14 }}>
                {featured?.excerpt || 'A practical overview of the most important changes.'}
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                <div className="mini-card">
                  <strong>Focus</strong>
                  <span>{featured?.category || 'Insight'}</span>
                </div>
                <div className="mini-card">
                  <strong>Format</strong>
                  <span>Short advisory reading</span>
                </div>
                <div className="mini-card">
                  <strong>Use case</strong>
                  <span>Decision support and planning</span>
                </div>
                <div className="mini-card">
                  <strong>Access</strong>
                  <span>Open and read anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="partner-strip">
            <div className="partner-label">Browse by topic</div>
            <div className="property-toolbar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  style={{
                    border: '1px solid var(--line)',
                    background: activeTopic === topic ? 'var(--primary)' : 'var(--surface)',
                    color: activeTopic === topic ? '#fff' : 'var(--accent)',
                    padding: '10px 18px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" id="latest">
          <div className="section-heading">
            <span className="eyebrow">Latest stories</span>
            <h2>Short, useful reading for clients and leaders.</h2>
            <p>Use these insights to get a clearer view of the topics that shape our work.</p>
          </div>

          <div className="article-grid">
            {filteredPosts.map(post => (
              <article key={post.slug} className="article-card">
                <div className="article-meta">{post.category || 'Insight'}</div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="article-footer">
                  Read article →
                </Link>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              No articles found matching this topic.
            </div>
          )}
        </section>

        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Why read here</span>
              <h2>Useful guidance without the fluff.</h2>
              <p>Short, relevant updates that stay close to what our clients actually need.</p>
            </div>

            <div className="value-grid">
              <div className="value-card">
                <div className="value-number">01</div>
                <h3>Actionable</h3>
                <p>Every article is designed to help someone make a better decision.</p>
              </div>
              <div className="value-card">
                <div className="value-number dark">02</div>
                <h3>Relevant</h3>
                <p>We focus on topics that affect real consultancy, finance and property decisions.</p>
              </div>
              <div className="value-card">
                <div className="value-number">03</div>
                <h3>Readable</h3>
                <p>Clear structure and simple language keep the experience easy to scan.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Want help applying what you read?</h2>
            <p>We can turn an article topic into a practical advisory conversation for your specific situation.</p>
            <div className="callout-actions">
              <a href="/contact" className="btn btn-ghost">
                Talk to advisory
              </a>
              <a href="/services" className="btn btn-secondary">
                Explore services
              </a>
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
