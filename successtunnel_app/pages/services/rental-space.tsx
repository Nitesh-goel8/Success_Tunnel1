import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import LeaseAffordabilityCalculator from '../../components/finance/LeaseAffordabilityCalculator'
import RentalPaymentButton from '../../components/RentalPaymentButton'

const rentalTabs = [
  {
    id: 'offices',
    title: 'Offices & Co-working',
    content: 'Elevate your enterprise operations. Discover fully furnished office suites, corporate floors, and flexible co-working environments in central Panipat designed to scale with your team.'
  },
  {
    id: 'retail',
    title: 'Shops & Retail Spaces',
    content: 'Secure high-visibility retail locations. We help brands find street-facing stores and commercial center units that maximize footfall, branding, and revenue.'
  },
  {
    id: 'warehouses',
    title: 'Warehouses & Logistics',
    content: 'Optimize your industrial operations. We provide access to large-scale, well-connected warehouse spaces and logistics hubs for efficient inventory management across Haryana.'
  },
  {
    id: 'residential',
    title: 'Executive Residential',
    content: 'Curated corporate living spaces and executive apartments tailored to leadership teams and visiting specialists, ensuring a smooth transition.'
  }
]

export default function RentalSpaceHub() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(rentalTabs[0].id)

  const prefilledTitle = router.query.property
    ? decodeURIComponent(router.query.property as string)
    : 'Corporate Workspace / Commercial Suite'
  
  const prefilledAmount = router.query.amount
    ? Number(router.query.amount)
    : 1000

  const isPreFilled = !!router.query.property

  return (
    <div>
      <Head>
        <title>Managed Workspaces &amp; Office Leasing — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Flexible corporate office suites, meeting boardrooms, and managed commercial workspace solutions in central Panipat, Haryana."
        />
        <link rel="canonical" href="https://successtunnel.in/services/rental-space" />
      </Head>

      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Managed Commercial Workspaces
              </div>
              <h1 style={{ margin: '14px 0 20px', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)' }}>
                Managed Workspaces &amp; Leases
              </h1>
              <p style={{ margin: '0 0 28px', maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: 1.68 }}>
                Furnished executive suites, boardrooms, and flexible commercial leasing solutions situated in Panipat&apos;s prime commercial core.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#enquiry" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Book Workspace &rarr;
                </a>
                <Link href="/properties" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  Browse Available Units
                </Link>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '18px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Lease Planning
              </div>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                Affordability Calculator
              </h3>
              <p style={{ marginTop: 0, marginBottom: 20, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Determine sustainable monthly lease allocations based on team revenue and operational headcount.
              </p>
              <LeaseAffordabilityCalculator />
            </div>
          </div>
        </section>

        {/* PRE-FILLED PROPERTY ACTION BANNER */}
        {isPreFilled && (
          <section className="container" style={{ paddingBottom: '24px' }}>
            <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '16px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Selected Property Mandate
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{prefilledTitle}</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '2px' }}>Monthly Lease Value: ₹{prefilledAmount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <RentalPaymentButton rentalTitle={prefilledTitle} defaultAmount={prefilledAmount} />
              </div>
            </div>
          </section>
        )}

        {/* INTERACTIVE TABS SECTION */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Workspace Options
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>Tailored Commercial Formats</h2>
              <p style={{ maxWidth: 600, margin: '8px auto 0', color: 'var(--muted)', fontSize: '1rem' }}>Modern infrastructure designed to accelerate enterprise productivity.</p>
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
                {rentalTabs.map(tab => (
                  <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '14px', color: 'var(--primary)', fontWeight: 800 }}>{tab.title}</h3>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{tab.content}</p>
                    <a href="#enquiry" style={{ display: 'inline-flex', marginTop: '24px', fontWeight: 700, color: 'var(--accent)' }}>
                      Inquire regarding availability &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED ENQUIRY */}
        <section className="section-surface" id="enquiry">
          <div className="container" style={{ maxWidth: '720px' }}>
            <GuidedEnquiry
              page="service:rental-space"
              title="Book or Inquire for Workspace in Panipat"
              subtitle="Specify your seat requirement, preferred move-in timeline, and location preferences."
              selectedService="Rental Space"
              serviceOptions={['Offices & Co-working', 'Shops & Retail Spaces', 'Warehouses & Logistics', 'Residential Space']}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
