import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GuidedEnquiry from '../components/GuidedEnquiry'
import EducationVideoPromo from '../components/EducationVideoPromo'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import {
  HiShieldCheck, HiGlobeAlt, HiUsers,
  HiBriefcase, HiChartBar, HiAcademicCap, HiTrendingUp, HiOfficeBuilding, HiKey,
  HiLocationMarker, HiPhone, HiMail, HiClock, HiCheckCircle, HiArrowRight,
} from 'react-icons/hi'
import { FaWhatsapp, FaRocket, FaIndustry, FaStore, FaUniversity, FaTools } from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

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
    excerpt: 'Disciplined capital preservation, treasury management, and portfolio structuring aligned with long-term strategic objectives.',
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
    name: 'Healthcare & Pharma',
    icon: <MdHealthAndSafety size={20} />,
    desc: 'Clinical asset leasing, specialized regulatory registrations, and structured financing for medical facilities and diagnostics.'
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

  return (
    <>
      <Head>
        <title>Success Tunnel — Corporate Consultancy, Finance, Real Estate & Advisory | Panipat</title>
        <meta
          name="description"
          content="Success Tunnel is an integrated corporate advisory group headquartered in Panipat, Haryana. Unifying statutory tax compliance, corporate finance, executive education, and commercial real estate."
        />
        <link rel="canonical" href="https://successtunnel.in" />
        <meta property="og:title" content="Success Tunnel — Strategic Advisory & Corporate Execution" />
        <meta
          property="og:description"
          content="One coordinated multidisciplinary advisory partner across corporate consulting, taxation, finance, and commercial real estate in Panipat, Haryana."
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

      <div>
        <Nav />

        <main>
          {/* 1. EDITORIAL CORPORATE HERO */}
          <section className="hero-section" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
            <div className="container hero-grid" style={{ alignItems: 'center' }}>
              <div className="hero-copy">
                <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                  <span className="editorial-tag-dot" />
                  Panipat Corporate Headquarters &bull; Haryana
                </div>

                <h1 style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                  lineHeight: '1.08',
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '0 0 22px 0',
                }}>
                  Integrated Advisory for Growing Enterprises.
                </h1>

                <p style={{
                  fontSize: '1.12rem',
                  lineHeight: '1.68',
                  color: 'var(--muted)',
                  marginBottom: '32px',
                  maxWidth: '540px'
                }}>
                  Unifying corporate legal compliance, tax structuring, working capital financing, and prime commercial real estate under one accountable governance framework.
                </p>

                <div className="hero-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="#contact" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.98rem' }}>
                    Schedule Advisory Consultation &rarr;
                  </a>
                  <a href="#services" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '0.98rem' }}>
                    Explore Practice Areas
                  </a>
                </div>

                {/* Verified Factual Capability Pillars */}
                <div className="credential-strip">
                  <div className="credential-item">
                    <div className="credential-icon"><HiShieldCheck size={20} /></div>
                    <div>
                      <div className="credential-label">Direct Governance</div>
                      <div className="credential-sub">MCA &amp; Income Tax Compliance</div>
                    </div>
                  </div>
                  <div className="credential-item">
                    <div className="credential-icon"><HiGlobeAlt size={20} /></div>
                    <div>
                      <div className="credential-label">Multidisciplinary</div>
                      <div className="credential-sub">6 Coordinated Disciplines</div>
                    </div>
                  </div>
                  <div className="credential-item">
                    <div className="credential-icon"><HiLocationMarker size={20} /></div>
                    <div>
                      <div className="credential-label">Regional Anchor</div>
                      <div className="credential-sub">Panipat Commercial Core</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Architectural Executive Practice Matrix */}
              <div className="editorial-matrix-card">
                <div className="editorial-matrix-header">
                  <div className="editorial-matrix-brand">
                    <Image
                      src="/logo.jpeg"
                      alt="Success Tunnel"
                      width={44}
                      height={44}
                      style={{ borderRadius: '10px', objectFit: 'contain', background: '#fff', border: '1px solid var(--line)', padding: '2px' }}
                      priority
                    />
                    <div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                        Success Tunnel
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Executive Advisory Matrix
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    Active In-Person Hub
                  </div>
                </div>

                <div className="editorial-matrix-grid">
                  <Link href="/services/consultancy" className="editorial-discipline-cell">
                    <div className="editorial-discipline-num">01 / STATUTORY</div>
                    <div className="editorial-discipline-title">Corporate Consultancy</div>
                    <p className="editorial-discipline-desc">Income Tax filings, GST litigation, and MCA legal secretarial governance.</p>
                  </Link>

                  <Link href="/services/finance" className="editorial-discipline-cell">
                    <div className="editorial-discipline-num">02 / CAPITAL</div>
                    <div className="editorial-discipline-title">Corporate Finance</div>
                    <p className="editorial-discipline-desc">Working capital credit limits, project finance, and debt syndication.</p>
                  </Link>

                  <Link href="/services/real-estate" className="editorial-discipline-cell">
                    <div className="editorial-discipline-num">03 / PROPERTY</div>
                    <div className="editorial-discipline-title">Commercial Real Estate</div>
                    <p className="editorial-discipline-desc">High-street retail, commercial acquisition, and strategic leasing.</p>
                  </Link>

                  <Link href="/education" className="editorial-discipline-cell">
                    <div className="editorial-discipline-num">04 / KNOWLEDGE</div>
                    <div className="editorial-discipline-title">Executive Education</div>
                    <p className="editorial-discipline-desc">Corporate tax modules, accounting practice notes, and skills building.</p>
                  </Link>
                </div>

                <div className="editorial-matrix-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HiLocationMarker size={16} style={{ color: 'var(--accent)' }} />
                    <span>Sudarshan Tower, Panipat HQ</span>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    SLA: 24h Advisory Response
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Practice Pillars Ticker */}
          <section style={{ background: '#ffffff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '24px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Core Advisory Practice Pillars
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
                  {trustedPillars.map((pillar, idx) => (
                    <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>&bull;</span>
                      {pillar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. PRACTICE ECOSYSTEM / SERVICES GRID */}
          <section className="section-surface" id="services">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Multidisciplinary Practice Ecosystem
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px' }}>
                  Structured Capabilities Across Enterprise Lifecycles
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.65' }}>
                  Direct engagement across corporate law, capital planning, taxation, and physical infrastructure without inter-firm handoffs.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {coreServices.map((service, index) => (
                  <div key={service.slug} className="expertise-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="expertise-icon-wrapper">
                        {service.icon}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted-light)', fontFamily: 'Sora, sans-serif' }}>
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

          {/* 4. INDUSTRIES WE SUPPORT */}
          <section style={{ background: '#ffffff', padding: '80px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Sector Experience
                </div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 14px' }}>
                  Sector-Specific Guidance Across Haryana &amp; National Markets
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                  Select an industry segment to see how our multidisciplinary advisory coordinates compliance, financing, and facilities.
                </p>
              </div>

              {/* Industry Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                {industries.map(ind => {
                  const isActive = activeInd === ind.id
                  return (
                    <button
                      key={ind.id}
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
                        borderColor: isActive ? 'var(--primary)' : 'var(--line)',
                        background: isActive ? 'var(--primary)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
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
                  <div style={{ maxWidth: '780px', margin: '0 auto', background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
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

          {/* 5. STANDARDS & GOVERNANCE */}
          <section className="section-surface">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Institutional Governance
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 16px' }}>
                  Advisory Governance &amp; Execution Principles
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
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ color: 'var(--accent)', fontSize: '1.6rem', marginBottom: '14px' }}>
                      <HiCheckCircle />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
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

          {/* 6. ABOUT US / PANIPAT HEADQUARTERS */}
          <section id="about" style={{ background: '#ffffff', padding: '96px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', scrollMarginTop: '80px' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '56px', alignItems: 'center' }}>
                <div>
                  <div className="editorial-tag" style={{ marginBottom: '18px' }}>
                    <span className="editorial-tag-dot" />
                    Firm Narrative
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', color: 'var(--primary)', fontWeight: 800, lineHeight: '1.14', margin: '0 0 20px', letterSpacing: '-0.03em' }}>
                    Regional Anchor.<br />Multidisciplinary Depth.
                  </h2>
                  <p style={{ fontSize: '1.08rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '18px' }}>
                    Success Tunnel was founded in Panipat to resolve the fragmentation that slows business leaders down. In conventional setups, promoters must separately engage distinct CA firms, loan brokers, real estate brokers, and corporate lawyers who rarely communicate with one another.
                  </p>
                  <p style={{ fontSize: '1.08rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '32px' }}>
                    Our integrated advisory model brings all essential enterprise growth disciplines under one roof, providing accountable governance, rapid execution, and complete strategic alignment.
                  </p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <a href="#contact" className="btn btn-primary" style={{ padding: '12px 26px' }}>
                      Book Consultation &rarr;
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
                    <div key={i} style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', textAlign: 'left' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Sora, sans-serif', lineHeight: 1.25, marginBottom: '8px' }}>
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

          {/* 7. CTA STRIP */}
          <section className="container" style={{ margin: '48px auto' }}>
            <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '24px', padding: '56px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                  Ready to Coordinate Your Business Growth?
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: 0, maxWidth: '580px' }}>
                  Meet our advisory partners at our Panipat headquarters or connect virtually for a detailed requirement review.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#contact" className="btn" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700, padding: '14px 28px' }}>
                  Schedule In-Person Meeting
                </a>
                <Link href="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', fontWeight: 700, padding: '14px 28px' }}>
                  Submit Enquiry
                </Link>
              </div>
            </div>
          </section>

          {/* 8. EXECUTIVE CONTACT & CALLBACK FORM */}
          <section className="section-surface" id="contact" style={{ scrollMarginTop: '80px' }}>
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <div className="editorial-tag" style={{ marginBottom: '18px' }}>
                  <span className="editorial-tag-dot" />
                  Direct Consultation
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                  Speak Directly with Our Advisory Partners
                </h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiLocationMarker size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Panipat Headquarters</h4>
                    <p>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiPhone size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Telephone Support</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'block' }}>{settings.contactPhone1}</a>
                      {settings.contactPhone2 && (
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>{settings.contactPhone2}</a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiMail size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Corporate Email</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {settings.contactEmail || 'contact@successtunnel.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><FaWhatsapp size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>WhatsApp Direct</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 700 }}>
                        Chat with our Advisory Desk &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiClock size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Working Hours</h4>
                    <p>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <GuidedEnquiry
                  page="Homepage"
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
