import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { HiShieldCheck, HiLocationMarker, HiCheckCircle, HiArrowRight } from 'react-icons/hi'

const strengths = [
  {
    title: 'Multidisciplinary Coherence',
    text: 'A unified advisory group coordinating corporate compliance, taxation, business finance, and commercial real estate under one governance roof.',
  },
  {
    title: 'Direct Partner-Led Accountability',
    text: 'Promoters and executives deal directly with experienced practice leads rather than junior call handlers or rotating account managers.',
  },
  {
    title: 'Strict Statutory Accuracy',
    text: 'Zero guesswork in compliance. Every filing, audit schedule, and submission adheres strictly to current MCA, GST, and Income Tax statutory mandates.',
  },
  {
    title: 'Regional Anchor with Enterprise Standards',
    text: 'Headquartered in Panipat, Haryana, delivering metropolitan corporate standards with high regional market responsiveness.',
  },
]

const process = [
  {
    step: '01',
    title: 'Diagnostic Requirement Review',
    text: 'We assess the organizational scope, statutory timelines, and capital or property requirements to establish clear objectives.',
  },
  {
    step: '02',
    title: 'Advisory Architecture & Structuring',
    text: 'We align the engagement into a practical sequence with defined dependencies, statutory checklists, and responsible practice heads.',
  },
  {
    step: '03',
    title: 'Coordinated Multi-Channel Execution',
    text: 'Our team executes the mandate with precision across legal filings, bank credit syndication, or commercial lease agreements.',
  },
  {
    step: '04',
    title: 'Continuous Governance & Oversight',
    text: 'Following completion, we remain actively engaged to ensure annual compliance maintenance, corporate governance, and growth advisory.',
  },
]

const serviceAreas = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    text: 'Income Tax, GST representation, MCA corporate filings, business registration, and secretarial compliance.',
  },
  {
    title: 'Corporate Finance',
    slug: 'finance',
    text: 'Debt syndication, working capital limits, project financing, and institutional capital direction.',
  },
  {
    title: 'Executive Education',
    slug: 'education',
    text: 'Structured professional courses, corporate tax modules, and practical accounting notes for executive teams.',
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    text: 'Disciplined capital preservation, treasury management, and long-term portfolio structuring.',
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    text: 'Commercial acquisition, prime high-street retail portfolios, and strategic lease advisory in Panipat.',
  },
  {
    title: 'Managed Workspaces',
    slug: 'rental-space',
    text: 'Fully managed corporate office suites, meeting boardrooms, and flexible workspace leases.',
  },
]

export default function About() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>About Us — Success Tunnel | Advisory &amp; Execution Group | Panipat</title>
        <meta
          name="description"
          content="Learn about Success Tunnel — an integrated corporate advisory group headquartered in Panipat, Haryana. Unifying compliance, finance, executive education, and real estate."
        />
        <link rel="canonical" href="https://successtunnel.in/about" />
        <meta property="og:title" content="About Us — Success Tunnel" />
        <meta property="og:description" content="A single coordinated partner for enterprise growth, statutory clarity, and execution across consulting, finance, and real estate." />
        <meta property="og:url" content="https://successtunnel.in/about" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />
        <main>
          {/* Hero */}
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '52px' }}>
            <div className="container" style={{ maxWidth: '840px', textAlign: 'center' }}>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Firm Background &amp; Philosophy
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '16px auto 24px',
                }}
              >
                A Single Multidisciplinary Partner for Scaling Enterprises.
              </h1>
              <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                Success Tunnel unites corporate consulting, statutory compliance, working capital finance, executive learning, and commercial real estate under one accountable standard.
              </p>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="section-surface">
            <div className="container" style={{ maxWidth: '1040px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
                <div>
                  <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                    <span className="editorial-tag-dot" />
                    Our Core Mandate
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                    We Eliminate the Inter-Firm Friction That Stalls Business.
                  </h2>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '1.02rem', marginBottom: '16px' }}>
                    Entrepreneurs frequently lose weeks navigating disconnected service providers: accountants who don&apos;t understand lender credit terms, brokers unfamiliar with zoning bylaws, and consultants operating without legal synchronization.
                  </p>
                  <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '1.02rem', margin: 0 }}>
                    We solve this by unifying the essential corporate advisory spectrum in our Panipat chambers, delivering unified strategy, direct accountability, and rapid execution.
                  </p>
                </div>

                <div style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '18px', padding: '32px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Institutional Values
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                    The Success Tunnel Benchmark
                  </h3>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    {strengths.map(item => (
                      <div key={item.title} style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.98rem', marginBottom: '4px' }}>
                          <HiCheckCircle style={{ color: 'var(--accent)' }} />
                          {item.title}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Practice Coverage */}
          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Practice Spectrum
                </div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  Coordinated Service Architecture
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {serviceAreas.map(item => (
                  <div key={item.title} className="expertise-card" style={{ padding: '28px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      PRACTICE AREA
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: '0 0 18px 0' }}>{item.text}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                      <Link href={item.slug === 'education' ? '/education' : `/services/${item.slug}`} className="expertise-card-link">
                        Explore Scope <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Delivery Methodology */}
          <section className="section-surface">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Methodology
                </div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  The 4-Stage Advisory Lifecycle
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {process.map(item => (
                  <div key={item.step} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', marginBottom: '8px' }}>
                      STAGE {item.step}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.55', margin: 0 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panipat HQ Anchor */}
          <section className="section-surface" style={{ background: '#ffffff' }}>
            <div className="container" style={{ maxWidth: '980px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                    <span className="editorial-tag-dot" />
                    Panipat Headquarters
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                    Regional Chambers &bull; National Capability
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '16px' }}>
                    Operating from Sudarshan Tower in central Panipat, our chambers host specialized practice desks for Haryana&apos;s prominent industrial, textile, manufacturing, and commercial sectors.
                  </p>
                  <div style={{ display: 'grid', gap: '10px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <div><strong style={{ color: 'var(--primary)' }}>Chambers:</strong> First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana</div>
                    <div><strong style={{ color: 'var(--primary)' }}>Telephone:</strong> {settings.contactPhone1}</div>
                    <div><strong style={{ color: 'var(--primary)' }}>Corporate Email:</strong> {settings.contactEmail || 'contact@successtunnel.in'}</div>
                  </div>
                </div>

                <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '18px', padding: '36px' }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 800, margin: '0 0 10px' }}>
                    Initiate an Advisory Engagement
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    Meet our practice leads in-person at our Panipat office or schedule a preliminary virtual session.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/contact" className="btn" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700, padding: '12px 22px' }}>
                      Schedule Consultation &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
