import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import EmiCalculator from '../../components/finance/EmiCalculator'
import CourseCard from '../../components/education/CourseCard'

const financeTabs = [
  {
    id: 'planning',
    title: 'Wealth Planning',
    content: 'Comprehensive financial planning to secure your future. We analyze your current assets, understand your long-term goals, and create a structured roadmap for capital growth and stability.'
  },
  {
    id: 'funding',
    title: 'Corporate Funding',
    content: 'Strategic guidance on acquiring loans, managing credit lines, and accessing capital markets. We help MSMEs and enterprises secure the liquidity needed for expansion.'
  },
  {
    id: 'risk',
    title: 'Risk Management',
    content: 'Identify and mitigate financial risks before they impact your business. From cash flow management to market volatility strategies, we provide clear decision support.'
  }
]

const financeCourses = [
  {
    title: 'Advanced Financial Modeling',
    excerpt: 'Master financial modeling techniques for MSME scaling and capital procurement.',
    slug: 'advanced-financial-modeling',
    duration: '6 Weeks',
    rating: 4.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Risk & Compliance Fundamentals',
    excerpt: 'Learn to navigate complex financial regulations and build robust compliance frameworks.',
    slug: 'risk-and-compliance',
    duration: '4 Weeks',
    rating: 4.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
  }
]

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState(financeTabs[0].id)

  return (
    <div>
      <Head>
        <title>Corporate Finance &amp; Capital Planning — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="End-to-end financial solutions designed for clarity, capital control, and enterprise growth in Panipat, Haryana. Working capital, project loans, and debt syndication."
        />
        <link rel="canonical" href="https://successtunnel.in/services/finance" />
      </Head>

      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Capital Planning &amp; Debt Advisory
              </div>
              <h1 style={{ margin: '14px 0 20px', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)' }}>
                Corporate Finance Hub
              </h1>
              <p style={{ margin: '0 0 28px', maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: 1.68 }}>
                Structured capital advisory designed to deliver liquidity, fiscal governance, and growth. From corporate debt syndication to enterprise wealth preservation in Panipat.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#enquiry" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Book Consultation &rarr;
                </a>
                <Link href="/services" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  All Practice Areas
                </Link>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '18px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Interactive Projection
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                Estimate Commitments Instantly
              </h3>
              <p style={{ marginTop: 0, marginBottom: 20, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Use our built-in calculator to project monthly EMI, interest schedules, and funding capacity.
              </p>
              <EmiCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Focus Disciplines
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>Comprehensive Financial Advisory</h2>
              <p style={{ maxWidth: 600, margin: '8px auto 0', color: 'var(--muted)', fontSize: '1rem' }}>Tailored capital pathways for expanding enterprises and promoters.</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                {financeTabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '10px 20px',
                      background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                      color: activeTab === tab.id ? 'white' : 'var(--muted)',
                      border: '1px solid',
                      borderColor: activeTab === tab.id ? 'var(--primary)' : 'var(--line)',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div style={{ background: 'white', padding: '36px', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
                {financeTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '14px', color: 'var(--primary)', fontWeight: 800 }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Discuss this requirement &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIAL EDUCATION SECTION */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Knowledge &amp; Capacity
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                  Corporate Financial Literacy
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.68', marginBottom: '20px' }}>
                  Financial literacy accelerates organizational resilience. Upskill your accounting and treasury personnel with our executive learning modules.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/education" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                    Explore All Modules &rarr;
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {financeCourses.map(course => (
                  <CourseCard key={course.slug} {...course} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED ENQUIRY */}
        <section className="section-surface" id="enquiry">
          <div className="container" style={{ maxWidth: '720px' }}>
            <GuidedEnquiry
              page="service:finance"
              title="Speak with a Financial Advisory Partner"
              subtitle="Specify your capital requirements or credit scope to connect directly with our finance desk."
              selectedService="Finance"
              serviceOptions={['Wealth Planning', 'Corporate Funding', 'Risk Management', 'Financial Education']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
