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
import ArchitecturalPortfolioHero from '../components/ArchitecturalPortfolioHero'

const practicePillars = [
  { name: 'Corporate Advisory', slug: 'consultancy', icon: <HiBriefcase size={20} />, code: 'ADV-01', desc: 'MCA compliance, statutory restructuring, tax litigation, and corporate legal governance.' },
  { name: 'Capital & Finance', slug: 'finance', icon: <HiChartBar size={20} />, code: 'FIN-02', desc: 'Working capital syndication, project debt financing, and credit facilitation.' },
  { name: 'Commercial Real Estate', slug: 'real-estate', icon: <HiOfficeBuilding size={20} />, code: 'CRE-03', desc: 'Prime commercial asset acquisition, retail portfolios, and strategic lease management.' },
  { name: 'Managed Workspaces', slug: 'rental-space', icon: <HiKey size={20} />, code: 'WKS-04', desc: 'Furnished executive suites, boardrooms, and plug-and-play offices in Sudarshan Tower.' },
  { name: 'Treasury & Investment', slug: 'investment', icon: <HiTrendingUp size={20} />, code: 'INV-05', desc: 'Disciplined corporate treasury management and long-term capital preservation.' },
  { name: 'Executive Education', slug: 'education', icon: <HiAcademicCap size={20} />, code: 'EDU-06', desc: 'Structured taxation modules, corporate GST training, and executive accounting programs.' }
]

const coreServices = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    icon: <HiBriefcase size={24} />,
    excerpt: 'Comprehensive statutory compliance, corporate restructuring, income tax filings, GST representation, and MCA governance.',
    tags: ['MCA Filings', 'GST Litigation', 'Corporate Structuring', 'Entity Formation'],
    highlight: 'Comprehensive Governance'
  },
  {
    title: 'Corporate Finance',
    slug: 'finance',
    icon: <HiChartBar size={24} />,
    excerpt: 'Working capital facilitation, project financing, debt syndication, and disciplined capital advisory for expanding enterprises.',
    tags: ['Working Capital', 'Debt Syndication', 'CMA & Credit', 'Project Finance'],
    highlight: 'Capital Deployment'
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    icon: <HiOfficeBuilding size={24} />,
    excerpt: 'Commercial asset acquisition, high-street retail portfolios, and strategic lease negotiations across Haryana.',
    tags: ['Asset Acquisition', 'High-Street Retail', 'Title Due Diligence', 'Valuations'],
    highlight: 'Physical Assets'
  },
  {
    title: 'Managed Workspaces',
    slug: 'rental-space',
    icon: <HiKey size={24} />,
    excerpt: 'Furnished corporate office suites, meeting rooms, and flexible executive workspace solutions.',
    tags: ['Executive Boardrooms', 'Prime Commercial', 'Flexible Leases', 'Plug & Play'],
    highlight: 'Operational Suites'
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    icon: <HiTrendingUp size={24} />,
    excerpt: 'Disciplined capital preservation, corporate treasury management, and portfolio structuring aligned with long-term security.',
    tags: ['Treasury Planning', 'Capital Preservation', 'Asset Allocation', 'Risk Hedging'],
    highlight: 'Wealth Discipline'
  },
  {
    title: 'Executive Education',
    slug: 'education',
    icon: <HiAcademicCap size={24} />,
    excerpt: 'Structured corporate training, executive taxation notes, and professional accounting programs for management teams.',
    tags: ['Corporate Taxation', 'GST Practical', 'Financial Accounting', 'Team Upskilling'],
    highlight: 'Executive Training'
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
    icon: <FaIndustry size={18} />,
    desc: 'Customized GST audit defense, supply chain credit limits, and large industrial real estate acquisitions for enterprise manufacturing and supply-chain hubs.'
  },
  {
    id: 'startups',
    name: 'Emerging Startups',
    icon: <FaRocket size={18} />,
    desc: 'End-to-end Private Limited incorporation, DPIIT recognition, statutory tax structuring, and investor compliance roadmaps.'
  },
  {
    id: 'msme',
    name: 'MSME Enterprises',
    icon: <FaTools size={18} />,
    desc: 'Bank working capital enhancements, interest subsidy applications, annual statutory audits, and balance sheet structuring.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Diagnostics',
    icon: <MdHealthAndSafety size={18} />,
    desc: 'Clinical asset leasing, specialized regulatory registrations, medical equipment credit syndication, and operational facilities.'
  },
  {
    id: 'retail',
    name: 'Retail & Distribution',
    icon: <FaStore size={18} />,
    desc: 'Prime high-street commercial leasing, multi-state GST registrations, and store inventory credit line management.'
  },
  {
    id: 'banking',
    name: 'Financial Institutions',
    icon: <FaUniversity size={18} />,
    desc: 'Independent title due diligence, commercial property valuation audits, and specialized compliance verification.'
  }
]

export default function Home({ services, featuredEducationContent }: { services: any[]; featuredEducationContent: any | null }) {
  const settings = useSiteSettings()
  const [activeInd, setActiveInd] = useState('manufacturing')

  return (
    <>
      <Head>
        <title>Success Tunnel — Strategic Corporate Advisory, Finance &amp; Commercial Real Estate </title>
        <meta
          name="description"
          content="Strategic clarity and architectural execution. Professional enterprise services across corporate taxation, debt syndication, executive education, and commercial real estate."
        />
        <link rel="canonical" href="https://successtunnel.in" />
        <meta property="og:title" content="Success Tunnel — Strategic Clarity &amp; Architectural Execution" />
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

      <div style={{ background: '#fbfbfd', minHeight: '100vh', color: '#1d1d1f' }}>
        <Nav />

        <main>
          {/* =========================================================
              1. 3D ARCHITECTURAL SPATIAL CAMPUS HERO & SYNCHRONIZED PORTFOLIO
              ========================================================= */}
          <ArchitecturalPortfolioHero />

          {/* =========================================================
              2. CAPABILITY TICKER / PRACTICE PILLARS
              ========================================================= */}
          <section style={{ background: '#ffffff', borderBottom: '1px solid #e5e5ea', padding: '18px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0071e3' }}>
                  Core Advisory Practice Pillars
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  {trustedPillars.map((pillar, idx) => (
                    <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 500, color: '#515154' }}>
                      <span style={{ color: '#0071e3' }}>&bull;</span>
                      {pillar}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              3. PRACTICE ECOSYSTEM / 6 CORE PRACTICE BENTO CARDS
              ========================================================= */}
          <section id="services" style={{ padding: '96px 0', background: '#fbfbfd' }}>
            <div className="container">
              <div style={{ maxWidth: '780px', marginBottom: '56px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#f5f5f7',
                    border: '1px solid #e5e5ea',
                    color: '#0071e3',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Multidisciplinary Portfolio
                </div>
                <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: '#1d1d1f', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em' }}>
                  Six Integrated Practices.<br />One Accountable Standard.
                </h2>
                <p style={{ color: '#86868b', fontSize: '1.1rem', lineHeight: '1.65', margin: 0 }}>
                  Direct partner engagement across statutory law, debt syndication, commercial property, and physical workspaces without inter-firm handoffs.
                </p>
              </div>

              {/* Apple-Style Minimalist Bento Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {coreServices.map((service, index) => (
                  <div
                    key={service.slug}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5ea',
                      borderRadius: '24px',
                      padding: '36px 32px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: '#f5f5f7',
                          border: '1px solid #e5e5ea',
                          color: '#0071e3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {service.icon}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#86868b', background: '#f5f5f7', padding: '4px 10px', borderRadius: '999px', border: '1px solid #e5e5ea' }}>
                        0{index + 1} &bull; {service.highlight}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1d1d1f', margin: '0 0 10px' }}>
                      {service.title}
                    </h3>
                    <p style={{ color: '#86868b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
                      {service.excerpt}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                      {service.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            background: '#f5f5f7',
                            color: '#515154',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: '1px solid #e5e5ea',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #f5f5f7' }}>
                      <Link
                        href={service.slug === 'education' ? '/education' : `/services/${service.slug}`}
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: '#0071e3',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        Explore Practice Portfolio <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              4. SPATIAL STORYTELLING / THE COORDINATION ADVANTAGE
              ========================================================= */}
          <section style={{ padding: '96px 0', background: '#ffffff', borderTop: '1px solid #e5e5ea', borderBottom: '1px solid #e5e5ea' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '56px', alignItems: 'center' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: '#f5f5f7',
                      color: '#0071e3',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                    Single Mandate Coordination
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1d1d1f', fontWeight: 800, margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    One Coordinated Mandate.<br />Zero Inter-Firm Fragmentation.
                  </h2>
                  <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '20px' }}>
                    Growing businesses lose precious momentum when advice is fragmented across separate accounting firms, commercial brokers, and financial lenders who operate in silos.
                  </p>
                  <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: '1.75', margin: 0 }}>
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
                    <div
                      key={idx}
                      style={{
                        background: '#fbfbfd',
                        border: '1px solid #e5e5ea',
                        borderRadius: '16px',
                        padding: '18px 24px',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0071e3', letterSpacing: '0.08em' }}>
                        {item.step}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1d1d1f', margin: '4px 0 2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: '#86868b', lineHeight: '1.5' }}>
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
          <section style={{ padding: '80px 0', background: '#fbfbfd' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#f5f5f7',
                    border: '1px solid #e5e5ea',
                    color: '#0071e3',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Regional Industry Depth
                </div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', color: '#1d1d1f', fontWeight: 800, margin: '8px 0 14px', letterSpacing: '-0.025em' }}>
                  Sector-Specific Guidance Across Key Enterprise Markets
                </h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#86868b', fontSize: '1rem', lineHeight: '1.6' }}>
                  Select an industry segment to inspect how our multidisciplinary advisory coordinates compliance, financing, and facilities.
                </p>
              </div>

              {/* Industry Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
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
                        borderRadius: '999px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: isActive ? '#0071e3' : '#e5e5ea',
                        background: isActive ? '#eff6ff' : '#ffffff',
                        color: isActive ? '#0071e3' : '#515154',
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
                  <div style={{ maxWidth: '780px', margin: '0 auto', background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '20px', padding: '36px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d1d1f', marginBottom: '10px' }}>
                      {current.name} Practice Brief
                    </div>
                    <p style={{ fontSize: '1.02rem', color: '#86868b', lineHeight: '1.7', margin: 0 }}>
                      {current.desc}
                    </p>
                  </div>
                )
              })()}
            </div>
          </section>

          {/* =========================================================
              6. STANDARDS & PROOF (VERIFIED FACTUAL COMMITMENTS)
              ========================================================= */}
          <section style={{ background: '#ffffff', padding: '80px 0', borderTop: '1px solid #e5e5ea', borderBottom: '1px solid #e5e5ea' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#f5f5f7',
                    color: '#0071e3',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Institutional Governance
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: '#1d1d1f', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.025em' }}>
                  Execution Standards &amp; Client Covenants
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: '#86868b', fontSize: '1.05rem', lineHeight: '1.6' }}>
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
                  <div key={idx} style={{ background: '#fbfbfd', border: '1px solid #e5e5ea', borderRadius: '18px', padding: '32px 28px' }}>
                    <div style={{ color: '#0071e3', fontSize: '1.6rem', marginBottom: '14px' }}>
                      <HiCheckCircle />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#86868b', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href="/projects" className="btn btn-secondary" style={{ padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Review Verified Projects &amp; Deliverables <HiArrowRight />
                </Link>
              </div>
            </div>
          </section>

          {/* =========================================================
              7. CORPORATE HEADQUARTERS & ADVISORY CHAMBERS
              ========================================================= */}
          <section id="about" style={{ padding: '80px 0', scrollMarginTop: '80px', background: '#fbfbfd' }}>
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
                      background: '#f5f5f7',
                      color: '#0071e3',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                    Corporate Headquarters
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#1d1d1f', fontWeight: 800, lineHeight: '1.18', margin: '0 0 20px', letterSpacing: '-0.025em' }}>
                    Institutional Chambers.<br />Multidisciplinary Depth.
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: '#86868b', lineHeight: '1.75', marginBottom: '16px' }}>
                    Success Tunnel was established to resolve the fragmentation that slows business leaders down. In conventional setups, promoters must separately engage distinct CA firms, loan brokers, real estate brokers, and corporate lawyers who rarely communicate with one another.
                  </p>
                  <p style={{ fontSize: '1.05rem', color: '#86868b', lineHeight: '1.75', marginBottom: '28px' }}>
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
                    <div key={i} style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '16px', padding: '24px 20px', textAlign: 'left', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1d1d1f', lineHeight: 1.3, marginBottom: '8px' }}>
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#86868b', lineHeight: '1.5' }}>
                        {stat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              8. FINAL CTA & EXECUTIVE CONTACT
              ========================================================= */}
          <section id="contact" style={{ scrollMarginTop: '80px', padding: '80px 0', background: '#ffffff', borderTop: '1px solid #e5e5ea' }}>
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#f5f5f7',
                    color: '#0071e3',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Direct Consultation
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#1d1d1f', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                  Speak Directly with Our Advisory Partners
                </h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f5f5f7', color: '#0071e3', border: '1px solid #e5e5ea' }}>
                    <HiLocationMarker size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#1d1d1f' }}>Corporate Headquarters</h4>
                    <p style={{ color: '#86868b' }}>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f5f5f7', color: '#0071e3', border: '1px solid #e5e5ea' }}>
                    <HiPhone size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#1d1d1f' }}>Telephone Support</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#1d1d1f', fontWeight: 600, display: 'block' }}>{settings.contactPhone1}</a>
                      {settings.contactPhone2 && (
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#86868b', fontSize: '0.9rem', display: 'block' }}>{settings.contactPhone2}</a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f5f5f7', color: '#0071e3', border: '1px solid #e5e5ea' }}>
                    <HiMail size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#1d1d1f' }}>Corporate Email</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: '#0071e3', fontWeight: 600 }}>
                        {settings.contactEmail || 'contact@successtunnel.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f5f5f7', color: '#34c759', border: '1px solid #e5e5ea' }}>
                    <FaWhatsapp size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#1d1d1f' }}>WhatsApp Direct</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#34c759', fontWeight: 600 }}>
                        Chat with our Advisory Desk &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f5f5f7', color: '#0071e3', border: '1px solid #e5e5ea' }}>
                    <HiClock size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#1d1d1f' }}>Working Hours</h4>
                    <p style={{ color: '#86868b' }}>{settings.workingHours || 'Mon - Sat: 9:00 AM - 5:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card" style={{ background: '#ffffff', border: '1px solid #e5e5ea', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)' }}>
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
