import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import SipCalculator from '../../components/finance/SipCalculator'
import CourseCard from '../../components/education/CourseCard'

const investmentTabs = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & SIPs',
    content: 'Build long-term wealth through disciplined investing. We help you identify top-performing funds that match your risk profile and financial goals, ensuring consistent capital growth.'
  },
  {
    id: 'equity',
    title: 'Shares (Equity)',
    content: 'Direct equity investments for aggressive growth. Our advisory provides research-backed insights to help you build a robust and diversified stock portfolio.'
  },
  {
    id: 'insurance',
    title: 'LIC / Term Insurance',
    content: 'Protect your family and your assets. We guide you through selecting the right term insurance and life cover to ensure absolute financial security against unforeseen events.'
  },
  {
    id: 'ulip',
    title: 'ULIPs',
    content: 'Unit Linked Insurance Plans offer the dual benefit of investment and protection. We help you choose ULIPs that provide market-linked returns along with life cover.'
  }
]

const investmentCourses = [
  {
    title: 'Value Investing Strategies',
    excerpt: 'Learn the fundamentals of evaluating companies and building a long-term equity portfolio.',
    slug: 'value-investing-strategies',
    duration: '5 Weeks',
    rating: 4.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Portfolio Diversification Masterclass',
    excerpt: 'Understand how to balance risk and reward across asset classes to protect your wealth.',
    slug: 'portfolio-diversification',
    duration: '3 Weeks',
    rating: 4.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=600&auto=format&fit=crop'
  }
]

export default function InvestmentHub() {
  const [activeTab, setActiveTab] = useState(investmentTabs[0].id)

  return (
    <div>
      <Head>
        <title>Investment Advisory &amp; Capital Preservation — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Disciplined portfolio structuring, corporate treasury advisory, and capital preservation strategies for long-term growth in Panipat, Haryana."
        />
        <link rel="canonical" href="https://successtunnel.in/services/investment" />
      </Head>

      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Capital Preservation &amp; Growth
              </div>
              <h1 style={{ margin: '14px 0 20px', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)' }}>
                Investment Advisory Hub
              </h1>
              <p style={{ margin: '0 0 28px', maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: 1.68 }}>
                Disciplined asset allocation, corporate treasury planning, and capital protection tailored to business owners and high-net-worth families in Panipat.
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
                SIP &amp; Wealth Projection
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                Calculate Future Returns
              </h3>
              <p style={{ marginTop: 0, marginBottom: 20, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Project your compounding growth over time with our interactive SIP calculator.
              </p>
              <SipCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Investment Channels
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>Tailored Investment Portfolios</h2>
              <p style={{ maxWidth: 600, margin: '8px auto 0', color: 'var(--muted)', fontSize: '1rem' }}>Balancing capital preservation with disciplined market participation.</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                {investmentTabs.map(tab => (
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
                {investmentTabs.map(tab => (
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

        {/* LEARNING TRACK SECTION */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Knowledge &amp; Strategy
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                  Investment Strategy Masterclasses
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.68', marginBottom: '20px' }}>
                  Gain a comprehensive understanding of value investing principles, risk management, and capital preservation frameworks.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/education" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                    Explore All Modules &rarr;
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {investmentCourses.map(course => (
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
              page="service:investment"
              title="Schedule an Investment Advisory Session"
              subtitle="Connect with our investment desk to review your asset allocation strategy."
              selectedService="Investment"
              serviceOptions={['Mutual Funds & SIPs', 'Shares & Equity', 'Insurance & Protection', 'ULIPs']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
