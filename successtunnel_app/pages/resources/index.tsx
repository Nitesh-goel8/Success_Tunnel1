import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { samplePosts } from '../../lib/sampleData'
import {
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineQuestionMarkCircle,
  HiOutlineCalculator,
  HiOutlinePhone,
  HiArrowRight,
} from 'react-icons/hi'

const resourceChannels = [
  {
    title: 'Education Hub',
    href: '/education',
    icon: <HiOutlineAcademicCap size={28} />,
    color: '#a855f7',
    desc: 'Courses, notes, video walkthroughs, and practical curriculum for accounting and tax professionals.',
  },
  {
    title: 'Financial Calculators',
    href: '/resources/calculators',
    icon: <HiOutlineCalculator size={28} />,
    color: '#38bdf8',
    desc: 'Interactive calculators for EMI loan amortizations, SIP returns, and commercial rental yield estimates.',
  },
  {
    title: 'Downloads & Checklists',
    href: '/resources/downloads',
    icon: <HiOutlineDownload size={28} />,
    color: '#60a5fa',
    desc: 'Downloadable PDF checklists, statutory filing schedules, and compliance templates.',
  },
  {
    title: 'Frequently Asked Questions',
    href: '/resources/faqs',
    icon: <HiOutlineQuestionMarkCircle size={28} />,
    color: '#10b981',
    desc: 'Clear, direct answers regarding corporate setup, tax filing rules, and Panipat workspace leases.',
  },
  {
    title: 'Blogs & Insights',
    href: '/blog',
    icon: <HiOutlineDocumentText size={28} />,
    color: '#f59e0b',
    desc: 'Expert commentary, practical compliance guides, and MSME regulatory updates.',
  },
  {
    title: 'Consultation Desk',
    href: '/contact',
    icon: <HiOutlinePhone size={28} />,
    color: '#ec4899',
    desc: 'Connect directly with our Panipat advisory office for tailored guidance and appointments.',
  },
]

export default function Resources({ posts }: { posts: any[] }) {
  const recentPosts = posts?.length ? posts : samplePosts

  return (
    <>
      <Head>
        <title>Resource Hub &amp; Tools — Success Tunnel | Panipat HQ</title>
        <meta
          name="description"
          content="Explore Success Tunnel resources: financial calculators, tax planning downloads, FAQs, educational courses, and business advisory guides."
        />
        <link rel="canonical" href="https://successtunnel.in/resources" />
        <meta property="og:title" content="Resource Hub &amp; Tools — Success Tunnel" />
        <meta
          property="og:description"
          content="Insights, downloads, calculators, and quick answers to help you make better decisions."
        />
        <meta property="og:url" content="https://successtunnel.in/resources" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="cinematic-theme-root">
        <Nav />

        <main>
          {/* Hero Section */}
          <section
            style={{
              paddingTop: 'clamp(50px, 8vw, 90px)',
              paddingBottom: 'clamp(40px, 6vw, 60px)',
              textAlign: 'center',
            }}
          >
            <div className="container" style={{ maxWidth: '840px' }}>
              <span
                className="eyebrow"
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                PRACTICE RESOURCES &bull; PANIPAT HQ
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 auto 24px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Insights, Calculators, and Practical Tools.
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.75', margin: '0 auto' }}>
                A centralized portal of validated templates, calculators, and advisory guides designed to assist business promoters and commerce professionals.
              </p>
            </div>
          </section>

          {/* Resources Grid */}
          <section style={{ padding: '60px 0 96px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '28px',
                }}
              >
                {resourceChannels.map((channel) => (
                  <div
                    key={channel.title}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 13, 22, 0.95) 100%)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '32px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '14px',
                          background: `${channel.color}22`,
                          border: `1px solid ${channel.color}44`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: channel.color,
                          marginBottom: '22px',
                        }}
                      >
                        {channel.icon}
                      </div>

                      <h2
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: '#f8fafc',
                          margin: '0 0 12px 0',
                          fontFamily: "'Sora', sans-serif",
                        }}
                      >
                        {channel.title}
                      </h2>

                      <p
                        style={{
                          fontSize: '0.94rem',
                          color: '#94a3b8',
                          lineHeight: '1.65',
                          margin: '0 0 24px 0',
                        }}
                      >
                        {channel.desc}
                      </p>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <Link
                        href={channel.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: channel.color,
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Access Tool</span>
                        <HiArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
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
      take: 3,
      orderBy: { id: 'desc' },
    })
    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: { posts: samplePosts },
      revalidate: 60,
    }
  }
}
