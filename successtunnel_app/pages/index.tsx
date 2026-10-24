import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GuidedEnquiry from '../components/GuidedEnquiry'
import EducationVideoPromo from '../components/EducationVideoPromo'
import PerspectiveServiceCard from '../components/home/PerspectiveServiceCard'
import InteractiveServiceExplorer from '../components/home/InteractiveServiceExplorer'
import ProcessTimeline from '../components/home/ProcessTimeline'
import BusinessValueStandards from '../components/home/BusinessValueStandards'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import {
  HiShieldCheck,
  HiGlobeAlt,
  HiBriefcase,
  HiChartBar,
  HiAcademicCap,
  HiTrendingUp,
  HiOfficeBuilding,
  HiKey,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
  HiArrowRight,
  HiCheckCircle,
} from 'react-icons/hi'
import { FaWhatsapp, FaRocket, FaIndustry, FaStore, FaUniversity, FaTools } from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

// Dynamic Three.js 3D Hero Scene (Client-only, SSR disabled, smooth fallback)
const HeroScene3D = dynamic(() => import('../components/3d/HeroScene3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(15,23,42,0) 70%)',
          border: '1px solid rgba(56,189,248,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          INITIALIZING 3D ECOSYSTEM...
        </span>
      </div>
    </div>
  ),
})

const coreServicesData = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    icon: <HiBriefcase size={26} />,
    accentColor: '#38bdf8',
    pillarNumber: 'P-01',
    excerpt: 'Statutory compliance, direct and indirect taxation, corporate restructuring, and MCA secretarial governance.',
    keyTags: ['Income Tax', 'GST Filings', 'LLP / Pvt Ltd', 'ROC Secretarial'],
  },
  {
    title: 'Financial Direction',
    slug: 'finance',
    icon: <HiChartBar size={26} />,
    accentColor: '#60a5fa',
    pillarNumber: 'P-02',
    excerpt: 'Bank credit syndication, CMA data preparation, debt restructuring, and institutional working capital procurement.',
    keyTags: ['CMA Data', 'Bank Finance', 'Working Capital', 'Project Reports'],
  },
  {
    title: 'Professional Education',
    slug: 'education',
    icon: <HiAcademicCap size={26} />,
    accentColor: '#a855f7',
    pillarNumber: 'P-03',
    excerpt: 'Industry-calibrated courses in practical accounting, Tally Prime mastery, and live statutory portal filing workflows.',
    keyTags: ['Tally Prime', 'Live Portals', 'GST Training', 'Study Notes'],
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    icon: <HiTrendingUp size={26} />,
    accentColor: '#f59e0b',
    pillarNumber: 'P-04',
    excerpt: 'Disciplined capital allocation, portfolio risk modeling, fixed-income yields, and long-term wealth preservation.',
    keyTags: ['Asset Allocation', 'Capital Preservation', 'Risk Analysis', 'Tax Yields'],
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    icon: <HiOfficeBuilding size={26} />,
    accentColor: '#10b981',
    pillarNumber: 'P-05',
    excerpt: 'Commercial property sourcing, legal title due diligence, yield valuation, and institutional portfolio acquisitions.',
    keyTags: ['Commercial Land', 'Due Diligence', 'Rental Yields', 'Title Clearance'],
  },
  {
    title: 'Managed Rental Space',
    slug: 'rental-space',
    icon: <HiKey size={26} />,
    accentColor: '#ec4899',
    pillarNumber: 'P-06',
    excerpt: 'Executive office suites, dedicated team cabins, and fully serviced workspaces in prime commercial hubs of Panipat.',
    keyTags: ['Executive Suites', 'Plug & Play', 'Boardrooms', 'Panipat Hub'],
  },
]

const verifiedIndustries = [
  { id: 'manufacturing', name: 'Textile & Manufacturing', icon: <FaIndustry size={20} /> },
  { id: 'msme', name: 'MSME & Trade Enterprises', icon: <FaStore size={20} /> },
  { id: 'startups', name: 'Tech & Service Startups', icon: <FaRocket size={20} /> },
  { id: 'banking', name: 'Financial Intermediaries', icon: <FaUniversity size={20} /> },
  { id: 'construction', name: 'Infrastructure & Real Estate', icon: <FaTools size={20} /> },
  { id: 'healthcare', name: 'Healthcare & Pharma', icon: <MdHealthAndSafety size={20} /> },
]

export default function Home({
  services,
  featuredEducationContent,
}: {
  services: any[]
  featuredEducationContent: any | null
}) {
  const settings = useSiteSettings()
  const [activeIndustry, setActiveIndustry] = useState('manufacturing')

  return (
    <>
      <Head>
        <title>Success Tunnel — Corporate Consultancy, Finance, Education &amp; Real Estate | Panipat, Haryana</title>
        <meta
          name="description"
          content="Success Tunnel is your strategic advisory partner in Panipat, Haryana, unifying corporate compliance, business finance, professional education, investment guidance, and commercial real estate solutions."
        />
        <link rel="canonical" href="https://successtunnel.in" />
        <meta property="og:title" content="Success Tunnel — Strategic Advisory &amp; Execution" />
        <meta
          property="og:description"
          content="One coordinated multidisciplinary partner across consulting, tax, finance, education, and commercial real estate in Panipat, Haryana."
        />
        <meta property="og:url" content="https://successtunnel.in" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: settings.businessName || 'Success Tunnel',
              url: 'https://successtunnel.in',
              logo: 'https://successtunnel.in/logo.jpeg',
              telephone: settings.contactPhone1 || '+91 89507 71205',
              email: settings.contactEmail || 'successtunnel.in@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: settings.officeAddress || 'First Floor, Sudarshan Tower, Panipat, Haryana',
                addressLocality: 'Panipat',
                addressRegion: 'Haryana',
                postalCode: '132103',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </Head>

      <div className="cinematic-theme-root">
        <Nav />

        <main>
          {/* ============================================================ */}
          {/* 1. CINEMATIC 3D HERO SECTION */}
          {/* ============================================================ */}
          <section
            className="hero-section"
            style={{
              paddingTop: 'clamp(40px, 6vw, 80px)',
              paddingBottom: 'clamp(50px, 8vw, 100px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="container hero-grid" style={{ alignItems: 'center' }}>
              {/* Left Column: Hero Narrative */}
              <div className="hero-copy">
                {/* Category Label */}
                <div style={{ marginBottom: '20px' }}>
                  <span
                    className="eyebrow"
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                    MULTIDISCIPLINARY STRATEGIC ADVISORY &bull; PANIPAT HQ
                  </span>
                </div>

                {/* Primary Headline */}
                <h1
                  style={{
                    fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                    lineHeight: '1.08',
                    letterSpacing: '-0.04em',
                    fontWeight: 900,
                    color: '#f8fafc',
                    margin: '0 0 24px 0',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  One Platform.{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Multiple Possibilities.
                  </span>
                </h1>

                {/* Concise Factual Explanation */}
                <p
                  style={{
                    fontSize: '1.14rem',
                    lineHeight: '1.75',
                    color: '#94a3b8',
                    marginBottom: '32px',
                    maxWidth: '560px',
                  }}
                >
                  Success Tunnel unifies corporate compliance, strategic finance, professional education, investment advisory, and commercial property into one coordinated advisory practice in Panipat, Haryana.
                </p>

                {/* CTA Actions */}
                <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    style={{
                      padding: '16px 30px',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                    }}
                  >
                    Book Consultation <HiArrowRight />
                  </a>

                  <a
                    href="#services"
                    className="btn btn-secondary"
                    style={{
                      padding: '16px 28px',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    Explore Practices
                  </a>

                  <Link
                    href="/projects"
                    style={{
                      padding: '16px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#cbd5e1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Public Projects &rarr;
                  </Link>
                </div>

                {/* Factual Credibility Strip (Replacing any outdated experience claims) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#38bdf8', flexShrink: 0 }}><HiShieldCheck size={22} /></div>
                    <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>Direct Advisory</strong>
                      Chartered Accountants
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#60a5fa', flexShrink: 0 }}><HiGlobeAlt size={22} /></div>
                    <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>6 Integrated Pillars</strong>
                      Strategy to Real Estate
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#10b981', flexShrink: 0 }}><HiLocationMarker size={22} /></div>
                    <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>Panipat Headquarters</strong>
                      Sudarshan Tower, Panipat
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Three.js Interactive 3D Ecosystem Scene */}
              <div
                className="hero-visual-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  minHeight: '480px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeroScene3D />

                {/* Floating Capability Tags Anchored in 3D Space */}
                <div
                  className="hero-floating-pill"
                  style={{
                    position: 'absolute',
                    top: '12%',
                    left: '5%',
                    zIndex: 10,
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ color: '#38bdf8' }}><HiBriefcase size={16} /></span>
                  <span>Corporate Consultancy</span>
                </div>

                <div
                  className="hero-floating-pill"
                  style={{
                    position: 'absolute',
                    top: '15%',
                    right: '5%',
                    zIndex: 10,
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ color: '#60a5fa' }}><HiChartBar size={16} /></span>
                  <span>Financial Direction</span>
                </div>

                <div
                  className="hero-floating-pill"
                  style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '8%',
                    zIndex: 10,
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ color: '#10b981' }}><HiOfficeBuilding size={16} /></span>
                  <span>Commercial Real Estate</span>
                </div>

                <div
                  className="hero-floating-pill"
                  style={{
                    position: 'absolute',
                    bottom: '14%',
                    right: '8%',
                    zIndex: 10,
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <span style={{ color: '#ec4899' }}><HiKey size={16} /></span>
                  <span>Managed Suites</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. CAPABILITY MARQUEE RIBBON */}
          {/* ============================================================ */}
          <section
            style={{
              padding: '24px 0',
              background: 'rgba(15, 23, 42, 0.5)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div className="container">
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Coordinated Professional Practices &bull; Panipat
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    alignItems: 'center',
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <span>✓ Corporate Advisory</span>
                  <span>✓ Statutory Tax &amp; GST</span>
                  <span>✓ CMA Data &amp; Debt</span>
                  <span>✓ Tally &amp; Portals</span>
                  <span>✓ Commercial Property</span>
                  <span>✓ Managed Suites</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. 3D PERSPECTIVE SERVICES GRID */}
          {/* ============================================================ */}
          <section id="services" style={{ padding: '96px 0', position: 'relative' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px' }}>
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                  COMPREHENSIVE ADVISORY PRACTICE
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    margin: '16px 0 18px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Expertise Across All Growth Dimensions
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
                  Structured advisory practices led by qualified practitioners. Move cursor over any practice card to interact with its perspective depth.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '28px',
                }}
              >
                {coreServicesData.map(service => (
                  <PerspectiveServiceCard
                    key={service.slug}
                    title={service.title}
                    slug={service.slug}
                    icon={service.icon}
                    excerpt={service.excerpt}
                    accentColor={service.accentColor}
                    pillarNumber={service.pillarNumber}
                    keyTags={service.keyTags}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. INTERACTIVE SERVICE EXPLORER */}
          {/* ============================================================ */}
          <InteractiveServiceExplorer />

          {/* ============================================================ */}
          {/* 5. HOW IT WORKS: SYSTEMATIC METHODOLOGY */}
          {/* ============================================================ */}
          <ProcessTimeline />

          {/* ============================================================ */}
          {/* 6. BUSINESS VALUE & ACCOUNTABILITY STANDARDS */}
          {/* ============================================================ */}
          <BusinessValueStandards />

          {/* ============================================================ */}
          {/* 7. INDUSTRIES WE SUPPORT */}
          {/* ============================================================ */}
          <section style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
                <span className="eyebrow" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.08)' }}>
                  CROSS-SECTOR ADVISORY
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    margin: '14px 0 14px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Sectors We Support with Distinction
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Our multidisciplinary framework is tailored to the statutory requirements and operational cycles of diverse industries.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                {verifiedIndustries.map(ind => {
                  const isActive = activeIndustry === ind.id
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setActiveIndustry(ind.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                        color: isActive ? '#f8fafc' : '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ color: isActive ? '#38bdf8' : '#64748b' }}>{ind.icon}</span>
                      <span>{ind.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 8. HIGH-CONVERSION CONTACT & GUIDED ENQUIRY */}
          {/* ============================================================ */}
          <section id="contact" style={{ padding: '96px 0', scrollMarginTop: '80px', position: 'relative' }}>
            <div className="container contact-section-grid">
              {/* Left Column: Direct Office Contact Info */}
              <div
                className="contact-info-panel"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: 'clamp(28px, 4vw, 44px)',
                }}
              >
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', marginBottom: '20px' }}>
                  DIRECT ADVISORY ACCESS
                </span>

                <h3
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    margin: '0 0 16px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Let&apos;s Discuss Your Vision
                </h3>

                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.7', marginBottom: '32px' }}>
                  Schedule an in-person meeting at our Panipat headquarters or arrange a virtual video conference with our principal advisors.
                </p>

                {/* Office Address */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <HiLocationMarker size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Corporate Headquarters
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {settings.officeAddress}
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(96, 165, 250, 0.1)',
                      border: '1px solid rgba(96, 165, 250, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      flexShrink: 0,
                    }}
                  >
                    <HiPhone size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Advisory Desk
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'block' }}>
                        {settings.contactPhone1}
                      </a>
                      <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#94a3b8', fontSize: '0.88rem', textDecoration: 'none', display: 'block' }}>
                        {settings.contactPhone2}
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0,
                    }}
                  >
                    <FaWhatsapp size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Instant Messaging
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a
                        href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}
                      >
                        Chat directly on WhatsApp &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email & Hours */}
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a855f7',
                      flexShrink: 0,
                    }}
                  >
                    <HiMail size={20} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Official Correspondence
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`mailto:${settings.contactEmail}`} style={{ color: '#f8fafc', fontWeight: 600, textDecoration: 'none' }}>
                        {settings.contactEmail}
                      </a>
                    </p>
                    <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'block', marginTop: '4px' }}>
                      {settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Guided Enquiry Card (Connected to /api/enquiries and CRM) */}
              <div
                className="contact-form-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: 'clamp(28px, 4vw, 44px)',
                }}
              >
                <GuidedEnquiry
                  page="Homepage"
                  title="Connect with Our Advisory Team"
                  subtitle="Select your focus area and provide basic details. We respond within one working day."
                />
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 9. FINAL CALL TO ACTION BANNER */}
          {/* ============================================================ */}
          <section className="container" style={{ paddingBottom: '96px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 60%, #070b14 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '28px',
                padding: 'clamp(36px, 5vw, 64px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37, 99, 235, 0.2)',
              }}
            >
              <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <span
                  className="eyebrow"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '6px 16px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    display: 'inline-block',
                    marginBottom: '20px',
                  }}
                >
                  TAKE THE NEXT STRATEGIC STEP
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    lineHeight: '1.15',
                    letterSpacing: '-0.03em',
                    margin: '0 0 18px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Ready to Accelerate Your Enterprise Growth?
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '32px' }}>
                  Partner with an established advisory practice that coordinates statutory compliance, finance, and real estate execution under one roof.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    style={{
                      padding: '16px 32px',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 8px 30px rgba(56, 189, 248, 0.4)',
                    }}
                  >
                    Book In-Person Consultation
                  </a>

                  <Link
                    href="/contact"
                    className="btn btn-secondary"
                    style={{
                      padding: '16px 28px',
                      borderRadius: '14px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    Contact Panipat Office
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {featuredEducationContent && <EducationVideoPromo video={featuredEducationContent} />}
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
        { createdAt: 'desc' },
      ],
    })
    return {
      props: {
        services: JSON.parse(JSON.stringify(services)),
        featuredEducationContent: featuredEducationContent
          ? JSON.parse(JSON.stringify(featuredEducationContent))
          : null,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: { services: sampleServices, featuredEducationContent: null },
      revalidate: 60,
    }
  }
}
