import { useState } from 'react'
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
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Financial Advisory</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Finance Hub
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 680, color: 'var(--muted)', fontSize: '1.06rem' }}>
                End-to-end financial solutions designed to deliver clarity, control, and measurable growth. From corporate funding to personal wealth planning.
              </p>
              <div className="hero-actions">
                <a href="#enquiry" className="btn btn-primary">
                  Book Consultation
                </a>
              </div>
            </div>

            <div className="article-feature">
              <span className="service-card-kicker">Interactive Tools</span>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Estimate your commitments instantly.
              </h2>
              <p style={{ marginTop: 14, marginBottom: 24 }}>
                Use our built-in calculator to project your monthly EMI and total interest for upcoming loans or investments.
              </p>
              <EmiCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Our Focus Areas</span>
              <h2>Comprehensive Financial Services</h2>
              <p>Explore our core offerings tailored for both individuals and modern enterprises.</p>
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
                {financeTabs.map(tab => (
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
                <span className="eyebrow">Financial Literacy</span>
                <h2>Success Tunnel Education Hub</h2>
                <p>
                  We believe that financial literacy is the key to enterprise growth. Empower yourself and your team with our premium corporate courses.
                </p>
                <ul className="bullet-list" style={{ marginTop: '20px' }}>
                  <li>Industry-recognized certifications</li>
                  <li>Practical, real-world case studies</li>
                  <li>Designed by senior financial advisors</li>
                </ul>
                <div style={{ marginTop: '32px' }}>
                  <a href="/education" className="btn btn-primary">
                    View all courses
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {financeCourses.map(course => (
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
              page="service:finance"
              title="Speak with a Financial Advisor"
              subtitle="Share your financial goals or funding requirements and we'll route you to the right specialist."
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
