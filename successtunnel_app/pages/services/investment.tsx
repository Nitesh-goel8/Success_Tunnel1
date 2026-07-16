import { useState } from 'react'
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
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Wealth Management</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Investment Hub
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 680, color: 'var(--muted)', fontSize: '1.06rem' }}>
                A methodical approach to capital growth and protection. From disciplined SIPs to aggressive equity portfolios, we structure your investments for maximum returns.
              </p>
              <div className="hero-actions">
                <a href="#enquiry" className="btn btn-primary">
                  Start Investing
                </a>
              </div>
            </div>

            <div className="article-feature">
              <span className="service-card-kicker">Interactive Tools</span>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Visualize your wealth creation.
              </h2>
              <p style={{ marginTop: 14, marginBottom: 24 }}>
                Use our built-in SIP calculator to project the future value of your disciplined monthly investments based on historical market returns.
              </p>
              <SipCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Our Focus Areas</span>
              <h2>Comprehensive Investment Solutions</h2>
              <p>Explore our core offerings tailored for aggressive growth and capital preservation.</p>
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
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                {investmentTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--muted)' }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Discuss this service &rarr;
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
            <div className="split-grid">
              <div className="split-content">
                <span className="eyebrow">Wealth Literacy</span>
                <h2>Success Tunnel Education Hub</h2>
                <p>
                  We believe that informed investors make the best decisions. Master the markets with our premium investment courses.
                </p>
                <ul className="bullet-list" style={{ marginTop: '20px' }}>
                  <li>Learn directly from market veterans</li>
                  <li>Actionable strategies for immediate application</li>
                  <li>Comprehensive risk management frameworks</li>
                </ul>
                <div style={{ marginTop: '32px' }}>
                  <a href="/education" className="btn btn-primary">
                    View all courses
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {investmentCourses.map(course => (
                  <CourseCard key={course.slug} {...course} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED ENQUIRY */}
        <section className="section-surface" id="enquiry">
          <div className="container" style={{ maxWidth: '700px' }}>
            <GuidedEnquiry
              page="service:investment"
              title="Speak with a Wealth Manager"
              subtitle="Share your financial goals and we'll craft a personalized investment strategy for you."
              selectedService="Investment"
              serviceOptions={['Mutual Funds & SIPs', 'Shares (Equity)', 'LIC / Term Insurance', 'ULIPs', 'Investment Education']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
