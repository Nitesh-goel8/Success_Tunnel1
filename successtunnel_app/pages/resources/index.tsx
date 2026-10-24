import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'
import { HiArrowRight } from 'react-icons/hi'

const resourceChannels = [
  { title: 'Education Hub', href: '/education', icon: '🎬', desc: 'Practical video tutorials, revision notes, and study material for taxation & accounting.' },
  { title: 'Knowledge Base', href: '/blog', icon: '📝', desc: 'Expert commentary, regulatory circular updates, and corporate advisory guides.' },
  { title: 'Documents & Forms', href: '/resources/downloads', icon: '📥', desc: 'Checklists, statutory format templates, and reference documentation.' },
  { title: 'Advisory FAQs', href: '/resources/faqs', icon: '❓', desc: 'Clear answers to procedural questions regarding MCA, GST, and Income Tax.' },
  { title: 'Financial Calculators', href: '/resources/calculators', icon: '🧮', desc: 'Interactive tools for GST estimation, capital gain planning, and loan repayment.' },
  { title: 'Advisory Consultation', href: '/contact', icon: '☎️', desc: 'Connect with a practice partner for bespoke organizational advisory.' },
]

export default function Resources({ posts }: { posts: any[] }) {
  const recentPosts = posts?.length ? posts : samplePosts

  return (
    <>
      <Head>
        <title>Resource Hub &amp; Knowledge Base — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Explore Success Tunnel resources: financial calculators, tax planning downloads, FAQs, educational courses, and corporate advisory guides."
        />
        <link rel="canonical" href="https://successtunnel.in/resources" />
        <meta property="og:title" content="Resource Hub & Knowledge Base — Success Tunnel" />
        <meta property="og:description" content="Insights, downloads, calculators, and quick answers to help enterprises make better decisions." />
        <meta property="og:url" content="https://successtunnel.in/resources" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />
        <main>
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Knowledge &amp; Decision Tools
              </div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)', margin: '16px auto 24px' }}>
                Corporate Resources &amp; Planning Tools.
              </h1>
              <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.68' }}>
                A central repository of reference material, interactive calculators, and statutory circular breakdowns to help leaders move faster with confidence.
              </p>
            </div>
          </section>

          <section className="section-surface" id="resources-menu">
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {resourceChannels.map(channel => (
                  <div key={channel.title} className="expertise-card">
                    <div className="expertise-icon-wrapper" style={{ fontSize: '1.4rem' }}>{channel.icon}</div>
                    <h3 style={{ fontSize: '1.25rem' }}>{channel.title}</h3>
                    <p>{channel.desc}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                      <Link href={channel.href} className="expertise-card-link">
                        Access Resource <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div className="editorial-tag" style={{ marginBottom: '12px' }}>
                    <span className="editorial-tag-dot" />
                    Advisory Insights
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>
                    Recent Regulatory Analysis &amp; Articles
                  </h2>
                </div>
                <Link href="/blog" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                  View All Publications &rarr;
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {recentPosts.slice(0, 3).map((post, index) => {
                  const blogImages: Record<string, string> = {
                    'navigating-tax': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
                    'financial-foundation': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
                    'education-workflow': 'https://images.unsplash.com/photo-1464938050744-13748f5ad1a2?q=80&w=600&auto=format&fit=crop',
                  }
                  const imageUrl = blogImages[post.slug] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'

                  return (
                    <div key={index} className="expertise-card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                          {post.category || 'ADVISORY INSIGHT'}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{post.title}</h3>
                        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', marginBottom: '18px' }}>{post.excerpt}</p>
                        <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                          <Link href={`/blog/${post.slug}`} className="expertise-card-link">
                            Read Analysis <HiArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take: 6
    })
    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: { posts: samplePosts },
      revalidate: 60
    }
  }
}
