import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'

export default function BlogDetail({ post, related }: { post: any; related: any[] }) {
  if (!post) return <div>Not found</div>

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">{post.category || 'Insight'}</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                {post.title}
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                {post.excerpt}
              </p>
              <div className="hero-actions">
                <a href="/blog" className="btn btn-primary">
                  Back to blog
                </a>
                <a href="/contact" className="btn btn-secondary">
                  Talk to advisory
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Article snapshot</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Practical context, then clear next steps.
              </h2>
              <p style={{ marginTop: 14 }}>
                Read the article as a starting point, then ask us to translate it into an action plan for your case.
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                <div className="mini-card">
                  <strong>Topic</strong>
                  <span>{post.category || 'General'}</span>
                </div>
                <div className="mini-card">
                  <strong>Format</strong>
                  <span>Editorial insight</span>
                </div>
                <div className="mini-card">
                  <strong>Use case</strong>
                  <span>Decision support</span>
                </div>
                <div className="mini-card">
                  <strong>Next step</strong>
                  <span>Book a consultation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="split-grid">
            <div className="split-content">
              <span className="eyebrow">Article</span>
              <h2>{post.title}</h2>
              <p>{post.content || post.excerpt || 'This article expands on the topic with practical steps and context.'}</p>
              <ul className="bullet-list">
                <li>Useful context for clients and decision makers</li>
                <li>Clear takeaways you can apply immediately</li>
                <li>Optional consultation if you want a tailored interpretation</li>
              </ul>
            </div>

            <div className="panel-card">
              <div className="service-card-kicker">Need help?</div>
              <h3 style={{ marginTop: 12 }}>Turn this into a practical plan.</h3>
              <p style={{ marginTop: 10 }}>
                We can translate any article topic into a specific next-step conversation for your business or personal situation.
              </p>
              <div className="split-actions">
                <a href="/contact" className="btn btn-primary">
                  Book consultation
                </a>
                <a href="/services" className="btn btn-secondary">
                  Explore services
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">More insights</span>
            <h2>Related reading</h2>
          </div>

          <div className="article-grid">
            {related.map(item => (
              <article key={item.slug} className="article-card">
                <div className="article-meta">{item.category || 'Insight'}</div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <Link href={`/blog/${item.slug}`} className="article-footer">
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticPaths() {
  try {
    const posts = await prisma.blogPost.findMany({ select: { slug: true } })
    return {
      paths: posts.map(p => ({ params: { slug: p.slug } })),
      fallback: 'blocking',
    }
  } catch {
    return {
      paths: samplePosts.map(p => ({ params: { slug: p.slug } })),
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps(ctx: any) {
  const { slug } = ctx.params

  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) {
      return {
        notFound: true,
        revalidate: 60,
      }
    }

    const related = await prisma.blogPost.findMany({
      where: { slug: { not: slug } },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    })

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        related: JSON.parse(JSON.stringify(related)),
      },
      revalidate: 60,
    }
  } catch {
    const fallbackPost = samplePosts.find(item => item.slug === slug)
    if (!fallbackPost) {
      return {
        notFound: true,
        revalidate: 60,
      }
    }

    return {
      props: {
        post: fallbackPost,
        related: samplePosts.filter(item => item.slug !== fallbackPost.slug).slice(0, 3),
      },
      revalidate: 60,
    }
  }
}
