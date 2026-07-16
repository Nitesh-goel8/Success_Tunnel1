import { useState } from 'react'
import { useRouter } from 'next/router'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import LeaseAffordabilityCalculator from '../../components/finance/LeaseAffordabilityCalculator'
import RentalPaymentButton from '../../components/RentalPaymentButton'

const rentalTabs = [
  {
    id: 'residential',
    title: 'Houses, Flats & PGs',
    content: 'Find the perfect residential rental. We curate premium houses, flats, and PG accommodations tailored to your budget and location preferences, ensuring a seamless move-in experience.'
  },
  {
    id: 'offices',
    title: 'Offices & Co-working',
    content: 'Elevate your business operations. Discover premium office spaces, corporate hubs, and flexible co-working environments designed to scale with your team.'
  },
  {
    id: 'retail',
    title: 'Shops & Retail Spaces',
    content: 'Secure high-visibility retail locations. We help brands find street-facing stores and mall spaces that maximize footfall and revenue.'
  },
  {
    id: 'warehouses',
    title: 'Warehouses & Logistics',
    content: 'Optimize your supply chain. We provide access to large-scale, well-connected warehouse spaces and logistics hubs for efficient inventory management.'
  }
]

export default function RentalSpaceHub() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(rentalTabs[0].id)

  // Pre-fill support: if user came from /properties with ?property=... &amount=...
  const prefilledTitle = router.query.property
    ? decodeURIComponent(router.query.property as string)
    : 'Premium Corporate/Residential Rental Space'
  
  const prefilledAmount = router.query.amount
    ? Number(router.query.amount)
    : 1000

  const isPreFilled = !!router.query.property

  return (
    <div>
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Space Discovery</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Rental Hub
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 680, color: 'var(--muted)', fontSize: '1.06rem' }}>
                A premium space-finding experience. Whether you are leasing a high-rise office or finding your next home, we make discovery, viewings, and closing simple.
              </p>
              
              {/* Payment Section for Pre-filled Properties */}
              {isPreFilled && (
                <div style={{ marginTop: '24px', background: 'rgba(22, 93, 245, 0.08)', border: '1px solid rgba(22, 93, 245, 0.2)', borderRadius: '12px', padding: '16px 20px', maxWidth: '500px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>📍 Ready to secure your property?</div>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{prefilledTitle}</strong>
                  <span style={{ color: 'var(--muted)', fontSize: '0.95rem', display: 'block', marginBottom: '16px' }}>Booking Token: ₹{prefilledAmount.toLocaleString('en-IN')}</span>
                  <RentalPaymentButton
                    rentalTitle={prefilledTitle}
                    defaultAmount={prefilledAmount}
                  />
                </div>
              )}

              {!isPreFilled && (
                <div className="hero-actions">
                  <a href="#enquiry" className="btn btn-primary">
                    Start Rental Search
                  </a>
                </div>
              )}
            </div>

            <div className="article-feature">
              <span className="service-card-kicker">Interactive Tools</span>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Calculate your leasing capacity.
              </h2>
              <p style={{ marginTop: 14, marginBottom: 24 }}>
                Use our built-in Lease Affordability Estimator to figure out exactly how much rent you can safely commit to based on your income or business revenue.
              </p>
              <LeaseAffordabilityCalculator />
            </div>
          </div>
        </section>

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Our Focus Areas</span>
              <h2>Curated Rental Spaces</h2>
              <p>Explore our core leasing segments tailored for households, startups, and enterprises.</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
                {rentalTabs.map(tab => (
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
                {rentalTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--primary)' }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--muted)' }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Schedule a viewing &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED ENQUIRY */}
        <section className="section-surface" id="enquiry">
          <div className="container" style={{ maxWidth: '700px' }}>
            <GuidedEnquiry
              page="service:rental-space"
              title="Speak with a Leasing Agent"
              subtitle="Share your target location, budget, and space requirements, and we'll help you secure the perfect rental."
              selectedService="Rental Space"
              serviceOptions={['Houses, Flats & PGs', 'Offices & Co-working', 'Shops & Retail Spaces', 'Warehouses & Logistics']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
