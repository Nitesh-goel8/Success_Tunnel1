import Link from 'next/link'
import PageShell from '../../components/PageShell'
import { samplePosts } from '../../lib/sampleData'

const resources = [
  { title: 'Blogs', slug: '/blog', icon: 'BL', excerpt: 'Thought leadership and service insights.' },
  { title: 'Downloads', slug: '/resources/downloads', icon: 'DL', excerpt: 'Forms, checklists and PDFs to request.' },
  { title: 'Calculators', slug: '/resources/calculators', icon: 'CA', excerpt: 'Placeholder calculators for future releases.' },
  { title: 'FAQs', slug: '/resources/faqs', icon: 'FQ', excerpt: 'Searchable answers to common questions.' },
]

export default function Resources() {
  return (
    <PageShell
      eyebrow="Resources"
      title="Insights, downloads and FAQs."
      description="A central place for blog content, future forms, calculators and answers that help clients move faster."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Resource hub</span>
          <h3>Everything in one place for easy discovery.</h3>
          <p>Use these sections to keep the content structure organized and crawl-friendly.</p>
          <div className="hero-board-grid">
            {resources.map(resource => (
              <div key={resource.title} className="mini-card">
                <strong>{resource.title}</strong>
                <span>{resource.excerpt}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Resource sections</span>
          <h2>Choose the section you need.</h2>
        </div>
        <div className="services-grid">
          {resources.map(resource => (
            <Link key={resource.title} href={resource.slug} className="service-card">
              <div className="service-card-icon">{resource.icon}</div>
              <div className="service-card-kicker">Resource</div>
              <h3>{resource.title}</h3>
              <p>{resource.excerpt}</p>
              <span className="service-card-cta">Open section →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Latest blog</span>
          <h2>Recent editorial content.</h2>
        </div>
        <div className="article-grid">
          {samplePosts.slice(0, 3).map(post => (
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
    </PageShell>
  )
}
