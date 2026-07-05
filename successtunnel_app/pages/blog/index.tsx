import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'
import Link from 'next/link'

const topicChips = ['Consultancy', 'Finance', 'Education', 'Investment', 'Real Estate']

export default function Blog({ posts }: { posts: any[] }) {
  const blogItems = Array.from(new Map([...(posts || []), ...samplePosts].map(item => [item.slug, item])).values())

  const featured = blogItems[0]
  const latest = blogItems.slice(1, 7)

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Insights</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Ideas that help you move faster.
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                Thought leadership, practical guidance and useful updates across the services we offer.
              </p>
              <div className="hero-actions">
                <a href="#latest" className="btn btn-primary">
                  Read Latest
                </a>
                <a href="/#contact" className="btn btn-secondary">
                  Get Advisory Support
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Featured article</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                {featured?.title || 'Navigating Tax Regulations'}
              </h2>
              <p style={{ marginTop: 14 }}>{featured?.excerpt || 'A practical overview of the most important changes.'}</p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                {topicChips.map(topic => (
                  <div key={topic} className="mini-card">
                    <strong>{topic}</strong>
                    <span>Latest perspectives and updates</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="partner-strip">
            <div className="partner-label">Browse by topic</div>
            <div className="property-toolbar">
              {topicChips.map(topic => (
                <span key={topic} className="property-chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" id="latest">
          <div className="section-heading">
            <span className="eyebrow">Latest stories</span>
            <h2>Practical reading for clients and leaders.</h2>
            <p>Use these insights to get a clearer view of the topics that shape our work.</p>
          </div>

          <div className="article-grid">
            {blogItems.map(post => (
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
        </section>

        <section className="section-surface">
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
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Want help applying what you read?</h2>
            <p>We can turn an article topic into a practical advisory conversation for your specific situation.</p>
            <div className="callout-actions">
              <a href="/#contact" className="btn btn-ghost">
                Talk to Advisory
              </a>
              <a href="/services" className="btn btn-secondary">
                Explore Services
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: 'desc' } })
    return { props: { posts: JSON.parse(JSON.stringify(posts)) } }
  } catch (error) {
    return { props: { posts: samplePosts } }
  }
}
