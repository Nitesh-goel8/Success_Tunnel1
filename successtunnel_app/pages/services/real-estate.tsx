import { useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import PropertyYieldCalculator from '../../components/finance/PropertyYieldCalculator'
import CourseCard from '../../components/education/CourseCard'

const propertyTabs = [
  {
    id: 'residential',
    title: 'Residential Property',
    content: 'Discover premium homes, apartments, and residential plots. Whether you are looking for your dream home or a high-growth investment property, we help you find and secure the best deals.'
  },
  {
    id: 'commercial',
    title: 'Commercial Land & Offices',
    content: 'Strategic commercial investments that yield high returns. We specialize in acquiring office spaces, corporate parks, and commercial plots with strong visibility and demand.'
  },
  {
    id: 'retail',
    title: 'Shops & Retail',
    content: 'Prime retail units in high-footfall areas. We analyze market trends to ensure your retail investments provide consistent rental yields and strong capital appreciation.'
  },
  {
    id: 'warehouses',
    title: 'Warehouses / Logistics',
    content: 'Large-scale storage and operational spaces. As e-commerce grows, we help businesses and investors acquire functional warehouses with excellent connectivity.'
  }
]

const realEstateCourses = [
  {
    title: 'Property Investment Analysis',
    excerpt: 'Learn how to evaluate property yields, analyze location growth, and calculate ROIs.',
    slug: 'property-investment-analysis',
    duration: '4 Weeks',
    rating: 4.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Commercial Real Estate Strategies',
    excerpt: 'A deep dive into commercial leases, tenant management, and corporate property valuation.',
    slug: 'commercial-real-estate-strategies',
    duration: '6 Weeks',
    rating: 4.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'
  }
]

export default function RealEstateHub() {
  const [activeTab, setActiveTab] = useState(propertyTabs[0].id)

  return (
    <div>
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Property Strategy</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Real Estate Hub
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 680, color: 'var(--muted)', fontSize: '1.06rem' }}>
                A premium end-to-end property experience. Whether you are acquiring commercial land or your next home, we make shortlisting, analyzing, and closing simple.
              </p>
              <div className="hero-actions">
                <a href="#enquiry" className="btn btn-primary">
                  Start Property Search
                </a>
              </div>
            </div>

            <div className="article-feature">
              <span className="service-card-kicker">Interactive Tools</span>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Calculate your rental returns.
              </h2>
              <p style={{ marginTop: 14, marginBottom: 24 }}>
                Use our built-in Property Yield Estimator to instantly calculate the gross annual yield of your prospective residential or commercial investments.
              </p>
              <PropertyYieldCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Our Focus Areas</span>
              <h2>Curated Property Opportunities</h2>
              <p>Explore our core property segments tailored for both living and aggressive investment growth.</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                {propertyTabs.map(tab => (
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
                {propertyTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--muted)' }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Discuss this property type &rarr;
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
                <span className="eyebrow">Property Mastery</span>
                <h2>Success Tunnel Education Hub</h2>
                <p>
                  A great property investment is built on great data. Learn how to analyze markets, negotiate leases, and build a generational real estate portfolio.
                </p>
                <ul className="bullet-list" style={{ marginTop: '20px' }}>
                  <li>Learn directly from real estate developers</li>
                  <li>In-depth commercial leasing strategies</li>
                  <li>Comprehensive market analysis frameworks</li>
                </ul>
                <div style={{ marginTop: '32px' }}>
                  <a href="/education" className="btn btn-primary">
                    View all courses
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {realEstateCourses.map(course => (
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
              page="service:real-estate"
              title="Speak with a Property Advisor"
              subtitle="Share your target location, budget, and requirements, and we'll help you curate the perfect shortlist."
              selectedService="Real Estate"
              serviceOptions={['Residential Property', 'Commercial Land & Offices', 'Shops & Retail', 'Warehouses', 'Real Estate Education']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
