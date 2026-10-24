import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GuidedEnquiry from '../components/GuidedEnquiry'
import EducationVideoPromo from '../components/EducationVideoPromo'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import {
  HiShieldCheck, HiGlobeAlt, HiLocationMarker, HiPhone, HiMail, HiClock,
  HiCheckCircle, HiArrowRight, HiBriefcase, HiChartBar, HiAcademicCap,
  HiTrendingUp, HiOfficeBuilding, HiKey, HiSparkles
} from 'react-icons/hi'
import { FaWhatsapp, FaRocket, FaIndustry, FaStore, FaUniversity, FaTools } from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

// Dynamic import for the full-page 3D Particle Constellation (client-side only)
const FullPageParticleStream = dynamic(
  () => import('../components/3d/FullPageParticleStream'),
  { ssr: false }
)

const practicePillars = [
  { name: 'Corporate Consultancy', slug: 'consultancy', icon: <HiBriefcase size={22} />, desc: 'Statutory compliance, corporate restructuring, income tax filings, GST representation, and MCA governance.' },
  { name: 'Corporate Finance', slug: 'finance', icon: <HiChartBar size={22} />, desc: 'Working capital facilitation, project financing, debt syndication, and disciplined capital advisory.' },
  { name: 'Executive Education', slug: 'education', icon: <HiAcademicCap size={22} />, desc: 'Structured corporate training, executive taxation notes, and professional accounting upskilling.' },
  { name: 'Investment Advisory', slug: 'investment', icon: <HiTrendingUp size={22} />, desc: 'Disciplined capital preservation, corporate treasury management, and structured risk mitigation.' },
  { name: 'Commercial Real Estate', slug: 'real-estate', icon: <HiOfficeBuilding size={22} />, desc: 'Commercial asset acquisition, high-street retail portfolios, and strategic lease negotiations in Haryana.' },
  { name: 'Managed Workspaces', slug: 'rental-space', icon: <HiKey size={22} />, desc: 'Furnished corporate office suites, meeting rooms, and flexible executive workspace in Sudarshan Tower, Panipat.' }
]

const coreServices = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    icon: <HiBriefcase size={26} />,
    excerpt: 'Comprehensive statutory compliance, corporate restructuring, income tax filings, GST representation, and MCA secretarial governance.',
    tags: ['Income Tax Filings', 'GST Representation', 'MCA Governance', 'Entity Incorporation']
  },
  {
    title: 'Corporate Finance',
    slug: 'finance',
    icon: <HiChartBar size={26} />,
    excerpt: 'Working capital facilitation, project financing, debt syndication, and disciplined capital advisory for expanding enterprises.',
    tags: ['Working Capital', 'Debt Syndication', 'Project Finance', 'CMA & Credit Advisory']
  },
  {
    title: 'Executive Education',
    slug: 'education',
    icon: <HiAcademicCap size={26} />,
    excerpt: 'Structured corporate training, executive taxation notes, and professional accounting programs for management teams.',
    tags: ['Taxation Modules', 'GST & Tally Practical', 'Financial Accounting', 'Corporate Upskilling']
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    icon: <HiTrendingUp size={26} />,
    excerpt: 'Disciplined capital preservation, corporate treasury management, and portfolio structuring aligned with long-term security.',
    tags: ['Treasury Planning', 'Capital Preservation', 'Asset Allocation', 'Risk Mitigation']
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    icon: <HiOfficeBuilding size={26} />,
    excerpt: 'Commercial asset acquisition, high-street retail portfolios, and strategic lease negotiations in Panipat and North India.',
    tags: ['Commercial Asset Acquisition', 'Lease Negotiation', 'Portfolio Valuation', 'Due Diligence']
  },
  {
    title: 'Managed Workspaces',
    slug: 'rental-space',
    icon: <HiKey size={26} />,
    excerpt: 'Furnished corporate office suites, meeting rooms, and flexible executive workspace solutions located in central Panipat.',
    tags: ['Plug & Play Offices', 'Executive Boardrooms', 'Flexible Leases', 'Panipat City Centre']
  },
]

const trustedPillars = [
  'Statutory Tax Filings',
  'MCA Corporate Compliance',
  'Commercial Real Estate',
  'Debt Syndication & Finance',
  'Managed Office Suites',
  'Executive Training Portals',
]

const industries = [
  {
    id: 'manufacturing',
    name: 'Manufacturing & Textiles',
    icon: <FaIndustry size={20} />,
    desc: 'Customized GST audit, supply chain financing, and large industrial asset acquisition support for textile and manufacturing hubs in Panipat and Haryana.'
  },
  {
    id: 'startups',
    name: 'Emerging Startups',
    icon: <FaRocket size={20} />,
    desc: 'End-to-end private limited incorporation, DPIIT recognition, compliance roadmaps, and initial seed round documentation.'
  },
  {
    id: 'msme',
    name: 'MSME Enterprises',
    icon: <FaTools size={20} />,
    desc: 'Working capital limit enhancements, subsidy guidance, statutory book closure, and cost optimization advisory.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Diagnostics',
    icon: <MdHealthAndSafety size={20} />,
    desc: 'Clinical asset leasing, specialized regulatory registrations, and structured financing for medical facilities.'
  },
  {
    id: 'retail',
    name: 'Retail & Distribution',
    icon: <FaStore size={20} />,
    desc: 'Prime high-street commercial leasing, multi-state GST registrations, and store inventory credit management.'
  },
  {
    id: 'banking',
    name: 'Financial Institutions',
    icon: <FaUniversity size={20} />,
    desc: 'Independent title due diligence, commercial property valuation audits, and specialized compliance verification.'
  }
]

export default function Home({ services, featuredEducationContent }: { services: any[]; featuredEducationContent: any | null }) {
  const settings = useSiteSettings()
  const [activeInd, setActiveInd] = useState('manufacturing')
  const [active3DPractice, setActive3DPractice] = useState(0)

  return (
    <>
      <Head>
        <title>Success Tunnel — Strategic Corporate Advisory, Finance &amp; Commercial Real Estate | Panipat</title>
        <meta
          name="description"
          content="Move business forward with Success Tunnel. Strategic guidance and professional services across corporate taxation, project finance, executive education, and commercial real estate in Panipat, Haryana."
        />
        <link rel="canonical" href="https://successtunnel.in" />
        <meta property="og:title" content="Success Tunnel — Move Business Forward" />
        <meta
          property="og:description"
          content="Strategic guidance and professional services designed to help businesses navigate complexity and unlock their next stage of growth."
        />
        <meta property="og:url" content="https://successtunnel.in" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: settings.businessName || 'Success Tunnel',
              url: 'https://successtunnel.in',
              logo: 'https://successtunnel.in/logo.jpeg',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: settings.contactPhone1 || '+91 98765 43210',
                contactType: 'customer service',
                email: settings.contactEmail || 'contact@successtunnel.in',
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana',
                addressLocality: 'Panipat',
                addressRegion: 'Haryana',
                postalCode: '132103',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </Head>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
        {/* Full-Page Interactive Three.js Particle Constellation Stream */}
        <FullPageParticleStream />

        <Nav />

        <main style={{ position: 'relative', zIndex: 1 }}>
          {/* =========================================================
              1. HERO: EXPANSIVE LEAD GENERATION & 3D PARTICLE MESH
              ========================================================= */}
          <section
            style={{
              position: 'relative',
              paddingTop: '56px',
              paddingBottom: '72px',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div className="container">
              {/* 2-Column Hero: Headline & Trust on Left + Floating Lead Gen on Right */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '48px',
                  alignItems: 'center'
                }}
              >
                {/* Left Column: Authoritative Editorial & Value Proposition */}
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'rgba(239, 246, 255, 0.9)',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '20px',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <span className="pulse-dot" />
                    Panipat Corporate Headquarters &bull; Multidisciplinary Advisory
                  </div>

                  <h1
                    style={{
                      fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
                      lineHeight: '1.06',
                      letterSpacing: '-0.035em',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      margin: '0 0 18px 0',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    Coordinated Enterprise Advisory.<br />
                    <span style={{ color: 'var(--accent)' }}>One Accountable Partner.</span>
                  </h1>

                  <p
                    style={{
                      fontSize: 'clamp(1.05rem, 1.8vw, 1.22rem)',
                      lineHeight: '1.68',
                      color: 'var(--muted)',
                      margin: '0 0 28px 0',
                      maxWidth: '640px'
                    }}
                  >
                    Unifying statutory corporate taxation, MCA compliance, debt syndication, and commercial workspaces under one roof in central Panipat—eliminating inter-firm friction for growing businesses.
                  </p>

                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '36px' }}>
                    <a href="#contact" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.98rem', fontWeight: 700 }}>
                      Schedule Strategic Advisory &rarr;
                    </a>
                    <a href="#services" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '0.98rem', fontWeight: 600 }}>
                      Explore 6 Practice Areas
                    </a>
                  </div>

                  {/* Factual Capability Pillars Bar */}
                  <div className="credential-strip" style={{ marginTop: '24px', paddingTop: '20px' }}>
                    <div className="credential-item">
                      <div className="credential-icon">
                        <HiShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="credential-label">Direct Statutory Governance</div>
                        <div className="credential-sub">MCA, Income Tax &amp; GST lodgement</div>
                      </div>
                    </div>

                    <div className="credential-item">
                      <div className="credential-icon">
                        <HiGlobeAlt size={20} />
                      </div>
                      <div>
                        <div className="credential-label">Unified Multidisciplinary Scope</div>
                        <div className="credential-sub">6 synchronized enterprise practices</div>
                      </div>
                    </div>

                    <div className="credential-item">
                      <div className="credential-icon">
                        <HiLocationMarker size={20} />
                      </div>
                      <div>
                        <div className="credential-label">Panipat Regional Chambers</div>
                        <div className="credential-sub">Sudarshan Tower, Tau Devi Lal Complex</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Floating Frosted-Glass Lead Gen / Callback Card */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '24px',
                    padding: '32px 28px',
                    boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="hub-metric-badge">
                      <HiSparkles /> Priority Advisory Desk
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>
                      Panipat &bull; Response &lt; 4 hrs
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 8px 0', lineHeight: 1.25 }}>
                    Schedule Strategic Consultation
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.55', margin: '0 0 20px 0' }}>
                    Connect directly with our designated practice partners across statutory filings, capital procurement, or prime commercial leases.
                  </p>

                  <GuidedEnquiry
                    page="Hero Consultation"
                    title="Direct Partner Callback"
                    subtitle="Select your primary business objective to begin:"
                  />

                  {/* Factual Trust Metrics Footer */}
                  <div
                    style={{
                      marginTop: '24px',
                      paddingTop: '20px',
                      borderTop: '1px solid var(--line)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>MCA &bull; Tax</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Direct Filing</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>6 Practice</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Disciplines</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>Sudarshan</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Tower HQ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              2. CAPABILITY TICKER / PRACTICE PILLARS
              ========================================================= */}
          <section style={{ background: '#ffffff', borderBottom: '1px solid var(--line)', padding: '18px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Core Advisory Practice Pillars
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  {trustedPillars.map((pillar, idx) => (
                    <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--accent)' }}>&bull;</span>
                      {pillar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              3. PRACTICE ECOSYSTEM / 6 CORE PRACTICE CARDS
              ========================================================= */}
          <section className="section-surface" id="services" style={{ background: '#ffffff' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  Multidisciplinary Practice Hub
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.025em' }}>
                  6 Integrated Disciplines Across Enterprise Lifecycles
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  Direct partner engagement across corporate law, capital planning, taxation, and physical infrastructure without inter-firm handoffs.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {coreServices.map((service, index) => (
                  <div key={service.slug} className="expertise-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="expertise-icon-wrapper">
                        {service.icon}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted-dark)', fontFamily: 'sans-serif' }}>
                        0{index + 1}
                      </span>
                    </div>

                    <h3>{service.title}</h3>
                    <p>{service.excerpt}</p>

                    <div className="expertise-tag-list">
                      {service.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="expertise-pill-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                      <Link href={service.slug === 'education' ? '/education' : `/services/${service.slug}`} className="expertise-card-link">
                        Explore Advisory Practice <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              4. SPATIAL STORYTELLING / THE INTEGRATED ADVANTAGE
              ========================================================= */}
          <section className="container" style={{ margin: '64px auto' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '24px', padding: '48px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: '#eff6ff',
                      color: 'var(--accent)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '14px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                    Single Point of Accountability
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', color: 'var(--primary)', fontWeight: 800, margin: '0 0 18px', letterSpacing: '-0.025em' }}>
                    One Coordinated Mandate.<br />Zero Inter-Firm Fragmentation.
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '20px' }}>
                    Growing businesses lose precious momentum when advice is fragmented across separate accounting firms, commercial brokers, and financial lenders who operate in silos.
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.7', margin: 0 }}>
                    Success Tunnel unifies the complete advisory spectrum inside our Panipat chambers—providing clear accountability, synchronized timelines, and mathematically verified execution.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    { step: 'STAGE 01', title: 'Statutory Inception & Tax Structuring', desc: 'MCA filings, GST registrations, and corporate legal compliance.' },
                    { step: 'STAGE 02', title: 'Working Capital & Project Syndication', desc: 'Bank credit facilities, loan appraisals, and structured capital.' },
                    { step: 'STAGE 03', title: 'Physical Infrastructure & Office Leases', desc: 'Strategic commercial acquisition and managed workspace deployment.' },
                    { step: 'STAGE 04', title: 'Continuous Governance & Treasury Oversight', desc: 'Ongoing audit defense, tax optimization, and board reporting.' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 20px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.08em' }}>
                        {item.step}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '4px 0 2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: '1.45' }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              5. SECTOR EXPERIENCE IN HARYANA
              ========================================================= */}
          <section style={{ background: '#ffffff', padding: '72px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  Regional Industry Depth
                </div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 14px', letterSpacing: '-0.025em' }}>
                  Sector-Specific Guidance Across Haryana &amp; National Markets
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                  Select an industry segment to see how our multidisciplinary advisory coordinates compliance, financing, and facilities.
                </p>
              </div>

              {/* Industry Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
                {industries.map(ind => {
                  const isActive = activeInd === ind.id
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setActiveInd(ind.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: isActive ? 'var(--accent)' : 'var(--line)',
                        background: isActive ? '#eff6ff' : '#f8fafc',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {ind.icon}
                      <span>{ind.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active Industry Panel */}
              {(() => {
                const current = industries.find(i => i.id === activeInd) || industries[0]
                return (
                  <div style={{ maxWidth: '780px', margin: '0 auto', background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '10px' }}>
                      {current.name} Practice Brief
                    </div>
                    <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: '1.7', margin: 0 }}>
                      {current.desc}
                    </p>
                  </div>
                )
              })()}
            </div>
          </section>

          {/* =========================================================
              6. ADVISORY PROCESS & APPROACH
              ========================================================= */}
          <section className="section-surface" style={{ background: '#ffffff' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  Execution Methodology
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.025em' }}>
                  The 4-Stage Advisory Approach
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  A disciplined engagement sequence providing complete transparency from first meeting to final statutory outcome.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {[
                  { step: '01', title: 'Understand', desc: 'Diagnostic discovery session analyzing corporate structure, regulatory posture, and capital targets.' },
                  { step: '02', title: 'Strategize', desc: 'Developing the integrated action roadmap with statutory checklists, timelines, and documentation requirements.' },
                  { step: '03', title: 'Execute', desc: 'Direct lodgement and negotiation across MCA, income tax, banking syndicates, and commercial landlords.' },
                  { step: '04', title: 'Govern', desc: 'Continuous annual maintenance, statutory compliance audit defense, and long-term enterprise advisory.' }
                ].map(item => (
                  <div key={item.step} style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '16px', padding: '28px 24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>
                      {item.step} &bull; PROCESS
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 10px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              7. STANDARDS & PROOF (VERIFIED FACTUAL COMMITMENTS)
              ========================================================= */}
          <section style={{ background: '#ffffff', padding: '72px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  Institutional Governance
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.025em' }}>
                  Execution Standards &amp; Client Covenants
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  We operate with transparent client covenants, verified audit trails, and partner accountability.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                {[
                  {
                    title: 'Regulatory Accuracy',
                    desc: 'Timely tax filings, statutory MCA compliance, and audit defense without procedural ambiguities.',
                  },
                  {
                    title: 'Multidisciplinary Standard',
                    desc: 'Accounting, debt advisory, corporate law, and commercial property professionals collaborating on a single mandate.',
                  },
                  {
                    title: 'Confidentiality & Security',
                    desc: 'Strict non-disclosure protocols, secure cloud records, and role-enforced client data access controls.',
                  },
                  {
                    title: 'Milestone Transparency',
                    desc: 'Mathematical tracking from documented scope definitions to final statutory approvals and disbursements.',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '14px' }}>
                      <HiCheckCircle />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href="/projects" className="btn btn-secondary" style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Review Verified Projects &amp; Deliverables <HiArrowRight />
                </Link>
              </div>
            </div>
          </section>

          {/* =========================================================
              8. CORPORATE HEADQUARTERS & PANIPAT ANCHOR
              ========================================================= */}
          <section id="about" style={{ padding: '80px 0', scrollMarginTop: '80px' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: '#eff6ff',
                      color: 'var(--accent)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '14px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                    Panipat Headquarters
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: 'var(--primary)', fontWeight: 800, lineHeight: '1.18', margin: '0 0 20px', letterSpacing: '-0.025em' }}>
                    Regional Chambers.<br />Multidisciplinary Depth.
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '16px' }}>
                    Success Tunnel was founded in Panipat to resolve the fragmentation that slows business leaders down. In conventional setups, promoters must separately engage distinct CA firms, loan brokers, real estate brokers, and corporate lawyers who rarely communicate with one another.
                  </p>
                  <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '28px' }}>
                    Our integrated advisory model brings all essential enterprise growth disciplines under one roof, providing accountable governance, rapid execution, and complete strategic alignment.
                  </p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <a href="#contact" className="btn btn-primary" style={{ padding: '12px 26px' }}>
                      Schedule Consultation &rarr;
                    </a>
                    <Link href="/about" className="btn btn-secondary" style={{ padding: '12px 26px' }}>
                      Read Firm Overview
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { title: 'Statutory Advisory', desc: 'Income Tax, GST, MCA Corporate Filings & Registrations' },
                    { title: 'Capital Planning', desc: 'Working Capital, Project Loans & Structured Financing' },
                    { title: 'Commercial Property', desc: 'Prime Corporate Asset Acquisition & Managed Workspaces' },
                    { title: 'Knowledge Portals', desc: 'Executive Tax Training, Case Studies & Calculators' },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', textAlign: 'left', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, marginBottom: '8px' }}>
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                        {stat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              9. FINAL CTA & EXECUTIVE CONTACT
              ========================================================= */}
          <section className="section-surface" id="contact" style={{ scrollMarginTop: '80px', background: '#ffffff' }}>
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  Direct Consultation
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                  Speak Directly with Our Advisory Partners
                </h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <HiLocationMarker size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: 'var(--text)' }}>Panipat Headquarters</h4>
                    <p style={{ color: 'var(--muted)' }}>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <HiPhone size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: 'var(--text)' }}>Telephone Support</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: 'var(--text)', fontWeight: 700, display: 'block' }}>{settings.contactPhone1}</a>
                      {settings.contactPhone2 && (
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>{settings.contactPhone2}</a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <HiMail size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: 'var(--text)' }}>Corporate Email</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>
                        {settings.contactEmail || 'contact@successtunnel.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ color: '#22c55e' }}>
                    <FaWhatsapp size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: 'var(--text)' }}>WhatsApp Direct</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#22c55e', fontWeight: 700 }}>
                        Chat with our Advisory Desk &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <HiClock size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: 'var(--text)' }}>Working Hours</h4>
                    <p style={{ color: 'var(--muted)' }}>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <GuidedEnquiry
                  page="Homepage Footer"
                  title="Schedule Advisory Callback"
                  subtitle="Specify your business requirement to connect with the designated practice partner."
                />
              </div>
            </div>
          </section>
        </main>

        <EducationVideoPromo video={featuredEducationContent} />
        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    const featuredEducationContent = await prisma.educationContent.findFirst({
      where: { isPublished: true, showOnHomePopup: true },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    return {
      props: {
        services: JSON.parse(JSON.stringify(services)),
        featuredEducationContent: featuredEducationContent ? JSON.parse(JSON.stringify(featuredEducationContent)) : null
      },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: { services: sampleServices, featuredEducationContent: null },
      revalidate: 60
    }
  }
}
