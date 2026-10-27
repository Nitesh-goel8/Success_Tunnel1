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

const trustedPillars = [
  'Statutory MCA Filings',
  'GST & Income Tax Litigation',
  'Commercial Real Estate',
  'Debt Syndication & Working Capital',
  'Furnished Executive Chambers',
  'Executive Tax & Accounting Programs',
]

const coreServices = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    icon: <HiBriefcase size={22} />,
    code: '01',
    excerpt: 'MCA statutory filings, corporate restructuring, income tax representation, GST litigation defense, and entity governance.',
    tags: ['MCA Governance', 'GST Representation', 'Tax Defense', 'Entity Inception'],
    highlight: 'Statutory Defense'
  },
  {
    title: 'Corporate Finance',
    slug: 'finance',
    icon: <HiChartBar size={22} />,
    code: '02',
    excerpt: 'Working capital facilitation, project financing, consortium debt syndication, and disciplined capital advisory for expanding enterprises.',
    tags: ['Working Capital', 'Debt Syndication', 'CMA & Credit', 'Project Debt'],
    highlight: '₹500Cr+ Syndicated'
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    icon: <HiOfficeBuilding size={22} />,
    code: '03',
    excerpt: 'Prime commercial asset acquisition, high-street retail portfolios, institutional land due diligence, and strategic corporate leasing.',
    tags: ['Asset Acquisition', 'High-Street Retail', 'Title Due Diligence', 'Valuations'],
    highlight: '250k+ Sq.Ft. Vetted'
  },
  {
    title: 'Managed Workspaces',
    slug: 'rental-space',
    icon: <HiKey size={22} />,
    code: '04',
    excerpt: 'Furnished executive office suites, boardrooms, and plug-and-play corporate workspaces at Sudarshan Tower, Panipat.',
    tags: ['Executive Suites', 'Conference Boardrooms', 'Flexible Leases', 'Plug & Play'],
    highlight: 'Sudarshan Chambers'
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    icon: <HiTrendingUp size={22} />,
    code: '05',
    excerpt: 'Disciplined corporate treasury management, capital preservation strategies, and portfolio structuring aligned with long-term security.',
    tags: ['Treasury Planning', 'Capital Preservation', 'Asset Protection', 'Risk Hedging'],
    highlight: 'Capital Discipline'
  },
  {
    title: 'Executive Education',
    slug: 'education',
    icon: <HiAcademicCap size={22} />,
    code: '06',
    excerpt: 'Accredited corporate training, executive taxation modules, balance sheet analysis, and certified financial programs for management teams.',
    tags: ['Corporate Taxation', 'GST Practical', 'Financial Accounting', 'Team Upskilling'],
    highlight: '1,200+ Upskilled'
  },
]

const industries = [
  {
    id: 'manufacturing',
    name: 'Manufacturing & Textiles',
    icon: <FaIndustry size={16} />,
    focus: 'GST audit defense, working capital enhancement, and industrial asset leasing for Panipat’s premier textile & manufacturing cluster.',
    deliverables: ['Working capital bank consortium enhancement', 'Multi-tier GST dispute defense & refunds', 'Industrial zoning title verification'],
  },
  {
    id: 'startups',
    name: 'Emerging Startups',
    icon: <FaRocket size={16} />,
    focus: 'End-to-end Private Limited incorporation, DPIIT recognition, statutory tax structuring, and angel compliance roadmaps.',
    deliverables: ['Fast-track entity inception & ROC filings', 'Seed stage equity & debt advisory', 'Furnished plug-and-play suites at Sudarshan Tower'],
  },
  {
    id: 'msme',
    name: 'MSME Enterprises',
    icon: <FaTools size={16} />,
    focus: 'Bank credit facilities, interest subsidy applications, annual statutory audits, and balance sheet structuring across Haryana.',
    deliverables: ['CMA preparation & credit syndication', 'State government MSME subsidies', 'Statutory compliance & annual MCA returns'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Diagnostics',
    icon: <MdHealthAndSafety size={16} />,
    focus: 'Clinical asset leasing, healthcare regulatory registrations, medical equipment credit syndication, and facility acquisitions.',
    deliverables: ['Equipment financing & lease structures', 'Clinical property due diligence', 'Regulatory licenses & tax exemptions'],
  },
  {
    id: 'retail',
    name: 'Retail & Distribution',
    icon: <FaStore size={16} />,
    focus: 'Prime high-street commercial leasing, multi-state GST registrations, and store inventory credit line syndication.',
    deliverables: ['High-street commercial lease vetting', 'Multi-state GST filings & reconciliation', 'Inventory revolving credit facilities'],
  },
  {
    id: 'banking',
    name: 'Financial Institutions',
    icon: <FaUniversity size={16} />,
    focus: 'Independent title due diligence, commercial property valuation audits, and statutory compliance verification for lenders.',
    deliverables: ['Property search reports & encumbrance vetting', 'Legal opinion on corporate collateral', 'Statutory solvency appraisals'],
  }
]

export default function Home({ services, featuredEducationContent }: { services: any[]; featuredEducationContent: any | null }) {
  const settings = useSiteSettings()
  const [activeInd, setActiveInd] = useState('manufacturing')

  return (
    <>
      <Head>
        <title>Success Tunnel — Strategic Corporate Advisory, Finance &amp; Commercial Real Estate</title>
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
              1. 3D ARCHITECTURAL SPATIAL CAMPUS HERO (2-COLUMN BALANCED)
              ========================================================= */}
          <ArchitecturalPortfolioHero />

          {/* =========================================================
              2. CAPABILITY TICKER / PRACTICE PILLARS
              ========================================================= */}
          <section style={{ background: '#ffffff', borderBottom: '1px solid #e5e5ea', padding: '16px 0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0071e3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Practice Pillars &bull; Panipat Chambers
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                  {trustedPillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#475569',
                        background: '#f8fafc',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <HiCheckCircle size={14} style={{ color: '#0071e3' }} />
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              3. PRACTICE ECOSYSTEM / 6 CORE PRACTICE BENTO CARDS
              ========================================================= */}
          <section id="services" style={{ padding: '80px 0', background: '#fbfbfd' }}>
            <div className="container">
              <div style={{ maxWidth: '780px', marginBottom: '48px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#0071e3',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Multidisciplinary Practices
                </div>
                <h2 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.2rem)', color: '#0f172a', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                  Six Integrated Practices.<br />One Accountable Standard.
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.65', margin: 0 }}>
                  Direct partner engagement across statutory corporate governance, institutional debt syndication, commercial property acquisition, and physical workspaces.
                </p>
              </div>

              {/* Bento Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {coreServices.map((service, index) => (
                  <div
                    key={service.slug}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5ea',
                      borderRadius: '20px',
                      padding: '32px 28px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #eff6ff, #f8fafc)',
                          border: '1px solid #bfdbfe',
                          color: '#0071e3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {service.icon}
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#0071e3',
                          background: '#eff6ff',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: '1px solid #bfdbfe',
                        }}
                      >
                        {service.highlight}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                      {service.title}
                    </h3>

                    <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '22px', flexGrow: 1 }}>
                      {service.excerpt}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                      {service.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: '#f8fafc',
                            color: '#475569',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <Link
                        href={service.slug === 'education' ? '/education' : `/services/${service.slug}`}
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#0071e3',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Explore Practice Portfolio</span>
                        <HiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================
              4. COORDINATION ADVANTAGE / THE SINGLE MANDATE ADVANTAGE
              ========================================================= */}
          <section style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #e5e5ea', borderBottom: '1px solid #e5e5ea' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#0071e3',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                    Single Mandate Governance
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.9rem)', color: '#0f172a', fontWeight: 800, margin: '0 0 18px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    One Coordinated Mandate.<br />Zero Inter-Firm Fragmentation.
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '16px' }}>
                    Growing businesses lose precious momentum when advice is fragmented across separate accounting firms, commercial brokers, and financial lenders who operate in silos.
                  </p>
                  <p style={{ color: '#64748b', fontSize: '1.02rem', lineHeight: '1.7', margin: '0 0 28px 0' }}>
                    Success Tunnel unifies statutory compliance, debt syndication, commercial property acquisition, and physical workspaces inside our Panipat chambers—providing clear accountability and synchronized execution.
                  </p>
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    style={{
                      padding: '12px 24px',
                      fontSize: '0.92rem',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Schedule Partner Assessment</span>
                    <HiArrowRight size={14} />
                  </a>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    { step: '01', title: 'Statutory Inception & Tax Structuring', desc: 'MCA corporate filings, GST registrations, and statutory compliance frameworks.' },
                    { step: '02', title: 'Working Capital & Project Debt Syndication', desc: 'Bank consortium credit appraisals, loan syndication, and structured financing.' },
                    { step: '03', title: 'Physical Infrastructure & Office Leases', desc: 'Prime commercial asset acquisition and furnished managed workspace deployment.' },
                    { step: '04', title: 'Continuous Governance & Treasury Oversight', desc: 'Ongoing audit defense, tax optimization, and board reporting.' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#0071e3',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          flexShrink: 0,
                        }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
                          {item.desc}
                        </div>
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
              <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#0071e3',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Regional Industry Depth
                </div>
                <h2 style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.7rem)', color: '#0f172a', fontWeight: 800, margin: '8px 0 12px', letterSpacing: '-0.025em' }}>
                  Sector-Specific Guidance Across Key Enterprise Markets
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
                  Select an industry segment to inspect how our multidisciplinary advisory coordinates compliance, financing, and facilities across Haryana.
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
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: isActive ? '#0071e3' : '#e2e8f0',
                        background: isActive ? '#0071e3' : '#ffffff',
                        color: isActive ? '#ffffff' : '#475569',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 4px 16px rgba(0, 113, 227, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
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
                  <div
                    style={{
                      maxWidth: '780px',
                      margin: '0 auto',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '32px 36px',
                      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
                      {current.name} Practice Brief
                    </div>
                    <p style={{ fontSize: '0.98rem', color: '#64748b', lineHeight: '1.65', margin: '0 0 20px 0', textAlign: 'center' }}>
                      {current.focus}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      {current.deliverables.map((item, dIdx) => (
                        <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                          <HiCheckCircle size={16} style={{ color: '#0071e3', flexShrink: 0 }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
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
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#0071e3',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Institutional Governance
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 2.7rem)', color: '#0f172a', fontWeight: 800, margin: '8px 0 14px', letterSpacing: '-0.025em' }}>
                  Execution Standards &amp; Client Covenants
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
                  We operate with transparent client covenants, verified audit trails, and partner accountability.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '28px 24px' }}>
                    <div style={{ color: '#0071e3', fontSize: '1.5rem', marginBottom: '12px' }}>
                      <HiCheckCircle />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href="/projects" className="btn btn-secondary" style={{ padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}>
                  <span>Review Verified Projects &amp; Deliverables</span>
                  <HiArrowRight size={14} />
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
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#0071e3',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                    Corporate Headquarters
                  </div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#0f172a', fontWeight: 800, lineHeight: '1.18', margin: '0 0 18px', letterSpacing: '-0.025em' }}>
                    Institutional Chambers.<br />Multidisciplinary Depth.
                  </h2>
                  <p style={{ fontSize: '1.02rem', color: '#64748b', lineHeight: '1.7', marginBottom: '14px' }}>
                    Success Tunnel was established to resolve the fragmentation that slows business leaders down. In conventional setups, promoters must separately engage distinct CA firms, loan brokers, real estate brokers, and corporate lawyers who rarely communicate with one another.
                  </p>
                  <p style={{ fontSize: '1.02rem', color: '#64748b', lineHeight: '1.7', marginBottom: '26px' }}>
                    Our integrated advisory model brings all essential enterprise growth disciplines under one roof inside Sudarshan Tower, Panipat, providing accountable governance and synchronized execution.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="#contact" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                      Schedule Consultation &rarr;
                    </a>
                    <Link href="/about" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
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
                    <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px 18px', textAlign: 'left', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.5' }}>
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
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#0071e3',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0071e3' }} />
                  Direct Consultation
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                  Speak Directly with Our Advisory Partners
                </h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#eff6ff', color: '#0071e3', border: '1px solid #bfdbfe' }}>
                    <HiLocationMarker size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#0f172a', fontWeight: 800 }}>Corporate Headquarters</h4>
                    <p style={{ color: '#64748b' }}>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#eff6ff', color: '#0071e3', border: '1px solid #bfdbfe' }}>
                    <HiPhone size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#0f172a', fontWeight: 800 }}>Telephone Support</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#0f172a', fontWeight: 700, display: 'block' }}>{settings.contactPhone1 || '+91 98765 43210'}</a>
                      {settings.contactPhone2 && (
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#64748b', fontSize: '0.88rem', display: 'block' }}>{settings.contactPhone2}</a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#eff6ff', color: '#0071e3', border: '1px solid #bfdbfe' }}>
                    <HiMail size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#0f172a', fontWeight: 800 }}>Corporate Email</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: '#0071e3', fontWeight: 700 }}>
                        {settings.contactEmail || 'contact@successtunnel.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                    <FaWhatsapp size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#0f172a', fontWeight: 800 }}>WhatsApp Direct</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 700 }}>
                        Chat with our Advisory Desk &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper" style={{ background: '#eff6ff', color: '#0071e3', border: '1px solid #bfdbfe' }}>
                    <HiClock size={22} />
                  </div>
                  <div className="contact-detail-text">
                    <h4 style={{ color: '#0f172a', fontWeight: 800 }}>Working Hours</h4>
                    <p style={{ color: '#64748b' }}>{settings.workingHours || 'Mon - Sat: 9:00 AM - 5:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)' }}>
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
