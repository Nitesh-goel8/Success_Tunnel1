import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import PropertyYieldCalculator from '../../components/finance/PropertyYieldCalculator'
import CourseCard from '../../components/education/CourseCard'

const propertyTabs = [
  {
    id: 'commercial',
    title: 'Commercial Land & Offices',
    content: 'Strategic commercial investments that yield high returns. We specialize in acquiring office spaces, corporate parks, and commercial plots with strong visibility and demand in Panipat and NCR.'
  },
  {
    id: 'retail',
    title: 'Shops & High-Street Retail',
    content: 'Prime retail units in high-footfall areas. We analyze market footfall trends to ensure your retail acquisitions provide strong capital appreciation and consistent rental yields.'
  },
  {
    id: 'warehouses',
    title: 'Warehouses / Logistics',
    content: 'Large-scale storage and industrial operational spaces. We help textile, manufacturing, and e-commerce companies acquire functional warehouses with excellent transit connectivity.'
  },
  {
    id: 'residential',
    title: 'Residential Property',
    content: 'Discover premium homes, luxury apartments, and residential plots. Whether you are looking for an executive residence or a long-term capital growth property, we ensure verified title documentation.'
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
      <Head>
        <title>Commercial Real Estate Advisory — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Commercial property acquisition, retail lease negotiation, title due diligence, and warehouse space advisory in Panipat, Haryana."
        />
        <link rel="canonical" href="https://successtunnel.in/services/real-estate" />
      </Head>

      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Commercial Property &amp; Land Advisory
              </div>
              <h1 style={{ margin: '14px 0 20px', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)' }}>
                Commercial Real Estate
              </h1>
              <p style={{ margin: '0 0 28px', maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: 1.68 }}>
                Strategic acquisition, rigorous title due diligence, and corporate lease negotiations for commercial assets, industrial land, and high-street retail in Panipat and Haryana.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#enquiry" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Book Consultation &rarr;
                </a>
                <Link href="/properties" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  Browse Available Assets
                </Link>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '18px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Yield &amp; ROI Analytics
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                Calculate Property Yield
              </h3>
              <p style={{ marginTop: 0, marginBottom: 20, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Project your annual rental yields and gross capital returns before entering into a transaction.
              </p>
              <PropertyYieldCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Property Channels
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>Strategic Real Estate Assets</h2>
              <p style={{ maxWidth: 600, margin: '8px auto 0', color: 'var(--muted)', fontSize: '1rem' }}>Focused acquisition and portfolio growth in Panipat and North India.</p>
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
                {propertyTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '14px', color: 'var(--primary)', fontWeight: 800 }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Inquire regarding this category &rarr;
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
                  Market Intelligence
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                  Commercial Real Estate Analysis
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.68', marginBottom: '20px' }}>
                  Learn how institutional investors evaluate lease covenants, analyze land zoning, and assess true commercial yield potential.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/education" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                    Explore All Modules &rarr;
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {realEstateCourses.map(course => (
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
              page="service:real-estate"
              title="Speak with a Commercial Property Specialist"
              subtitle="Submit your acquisition or leasing criteria to connect with our Panipat property desk."
              selectedService="Real Estate"
              serviceOptions={['Commercial Land & Offices', 'Shops & Retail', 'Warehouses / Logistics', 'Residential Property']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
