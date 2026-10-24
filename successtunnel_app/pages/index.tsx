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
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

// High-Precision Monolithic 3D Scene (Client-only, SSR disabled, polished fallback)
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
          width: '240px',
          height: '240px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          LOADING SPATIAL MODEL...
        </span>
      </div>
    </div>
  ),
})

const coreServicesData = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    icon: <HiBriefcase size={22} />,
    pillarNumber: 'P-01',
    excerpt: 'Statutory compliance, direct and indirect taxation, corporate restructuring, and MCA secretarial governance.',
    keyTags: ['Income Tax', 'GST Filings', 'LLP / Pvt Ltd', 'ROC Secretarial'],
  },
  {
    title: 'Financial Direction',
    slug: 'finance',
    icon: <HiChartBar size={22} />,
    pillarNumber: 'P-02',
    excerpt: 'Bank credit syndication, CMA data preparation, debt restructuring, and institutional working capital procurement.',
    keyTags: ['CMA Data', 'Bank Finance', 'Working Capital', 'Project Reports'],
  },
  {
    title: 'Professional Education',
    slug: 'education',
    icon: <HiAcademicCap size={22} />,
    pillarNumber: 'P-03',
    excerpt: 'Industry-calibrated courses in practical accounting, Tally Prime mastery, and live statutory portal filing workflows.',
    keyTags: ['Tally Prime', 'Live Portals', 'GST Training', 'Study Notes'],
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    icon: <HiTrendingUp size={22} />,
    pillarNumber: 'P-04',
    excerpt: 'Disciplined capital allocation, portfolio risk modeling, fixed-income yields, and long-term wealth preservation.',
    keyTags: ['Asset Allocation', 'Capital Preservation', 'Risk Analysis', 'Tax Yields'],
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    icon: <HiOfficeBuilding size={22} />,
    pillarNumber: 'P-05',
    excerpt: 'Commercial property sourcing, legal title due diligence, yield valuation, and institutional portfolio acquisitions.',
    keyTags: ['Commercial Land', 'Due Diligence', 'Rental Yields', 'Title Clearance'],
  },
  {
    title: 'Managed Rental Space',
    slug: 'rental-space',
    icon: <HiKey size={22} />,
    pillarNumber: 'P-06',
    excerpt: 'Executive office suites, dedicated team cabins, and fully serviced workspaces in prime commercial hubs of Panipat.',
    keyTags: ['Executive Suites', 'Plug & Play', 'Boardrooms', 'Panipat Hub'],
  },
]

export default function Home({
  services,
  featuredEducationContent,
}: {
  services: any[]
  featuredEducationContent: any | null
}) {
  const settings = useSiteSettings()

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
          {/* 1. EDITORIAL ASYMMETRIC HERO SECTION */}
          {/* ============================================================ */}
          <section
            className="hero-section"
            style={{
              paddingTop: 'clamp(48px, 6vw, 84px)',
              paddingBottom: 'clamp(56px, 8vw, 96px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="container hero-grid" style={{ alignItems: 'center' }}>
              {/* Left Column: Focused Editorial Copy */}
              <div className="hero-copy">
                {/* Understated Category Label */}
                <div style={{ marginBottom: '20px' }}>
                  <span
                    className="eyebrow"
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                    STRATEGIC ADVISORY &bull; PANIPAT HEADQUARTERS
                  </span>
                </div>

                {/* Primary Headline */}
                <h1
                  style={{
                    fontSize: 'clamp(2.3rem, 5vw, 4.1rem)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.035em',
                    fontWeight: 900,
                    color: '#f8fafc',
                    margin: '0 0 20px 0',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Unified Advisory for Corporate Strategy, Capital &amp; Execution.
                </h1>

                {/* Concise Factual Explanation */}
                <p
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.75',
                    color: '#94a3b8',
                    marginBottom: '32px',
                    maxWidth: '540px',
                  }}
                >
                  Success Tunnel integrates statutory compliance, debt syndication, workforce training, investment modeling, and commercial real estate into a single, coordinated practice in Panipat, Haryana.
                </p>

                {/* Focused CTA Pair (Strictly 1 Primary + 1 Secondary) */}
                <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      borderRadius: '10px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    Book In-Person Consultation <HiArrowRight size={16} />
                  </a>

                  <a
                    href="#practice-grid"
                    className="btn btn-secondary"
                    style={{
                      padding: '14px 24px',
                      borderRadius: '10px',
                      fontSize: '0.96rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    Explore Practice Disciplines
                  </a>
                </div>

                {/* Factual Credibility Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#38bdf8', flexShrink: 0 }}><HiShieldCheck size={20} /></div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>Direct Advisory</strong>
                      Chartered Accountants
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#38bdf8', flexShrink: 0 }}><HiGlobeAlt size={20} /></div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>6 Integrated Pillars</strong>
                      Strategy to Real Estate
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#38bdf8', flexShrink: 0 }}><HiLocationMarker size={20} /></div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong style={{ color: '#f8fafc', display: 'block' }}>Panipat Headquarters</strong>
                      Sudarshan Tower, Panipat
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Precision Monolithic 3D Scene */}
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
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. PRACTICE DISCIPLINES MARQUEE RIBBON */}
          {/* ============================================================ */}
          <section
            style={{
              padding: '20px 0',
              background: 'rgba(13, 21, 39, 0.6)',
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
                  gap: '16px',
                }}
              >
                <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Coordinated Professional Practices &bull; Panipat
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    alignItems: 'center',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  <span>&bull; Corporate Advisory</span>
                  <span>&bull; Statutory Tax &amp; GST</span>
                  <span>&bull; CMA Data &amp; Debt</span>
                  <span>&bull; Tally &amp; Portals</span>
                  <span>&bull; Commercial Property</span>
                  <span>&bull; Managed Suites</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. PRACTICE DISCIPLINES GRID (REFINED ARCHITECTURAL CARDS) */}
          {/* ============================================================ */}
          <section id="practice-grid" style={{ padding: '88px 0', position: 'relative' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 56px' }}>
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                  COMPREHENSIVE ADVISORY PRACTICE
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    margin: '14px 0 14px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Expertise Across All Growth Dimensions
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                  Structured advisory practices led by qualified practitioners. Explore statutory scope, compliance filings, and execution steps.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {coreServicesData.map(service => (
                  <PerspectiveServiceCard
                    key={service.slug}
                    title={service.title}
                    slug={service.slug}
                    icon={service.icon}
                    excerpt={service.excerpt}
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
          {/* 5. SYSTEMATIC ADVISORY LIFECYCLE */}
          {/* ============================================================ */}
          <ProcessTimeline />

          {/* ============================================================ */}
          {/* 6. GOVERNANCE, STANDARDS & PANIPAT HEADQUARTERS */}
          {/* ============================================================ */}
          <BusinessValueStandards />

          {/* ============================================================ */}
          {/* 7. DIRECT ADVISORY & GUIDED CONSULTATION */}
          {/* ============================================================ */}
          <section id="contact" style={{ padding: '88px 0', scrollMarginTop: '80px', position: 'relative' }}>
            <div className="container contact-section-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {/* Left Column: Direct Office Contact Info */}
              <div
                className="contact-info-panel"
                style={{
                  background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.8) 0%, rgba(9, 14, 26, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 4vw, 40px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    DIRECT ADVISORY ACCESS
                  </span>
                  <h3
                    style={{
                      fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                      color: '#f8fafc',
                      fontWeight: 800,
                      margin: '8px 0 0',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    Let&apos;s Discuss Your Vision
                  </h3>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: '1.7', margin: 0 }}>
                  Schedule an in-person meeting at our Panipat headquarters or arrange a virtual video conference with our principal advisors.
                </p>

                {/* Office Address */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(30, 58, 138, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <HiLocationMarker size={18} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 2px' }}>
                      Corporate Headquarters
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.5', margin: 0 }}>
                      {settings.officeAddress}
                    </p>
                  </div>
                </div>

                {/* Phones */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(30, 58, 138, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <HiPhone size={18} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 2px' }}>
                      Advisory Desk
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'block', fontSize: '0.94rem' }}>
                        {settings.contactPhone1}
                      </a>
                      <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#94a3b8', fontSize: '0.84rem', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                        {settings.contactPhone2}
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0,
                    }}
                  >
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 2px' }}>
                      Instant Messaging
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a
                        href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}
                      >
                        Start WhatsApp Consultation &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email & Hours */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(30, 58, 138, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <HiMail size={18} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 2px' }}>
                      Correspondence
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`mailto:${settings.contactEmail}`} style={{ color: '#f8fafc', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>
                        {settings.contactEmail}
                      </a>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                      <HiClock size={14} />
                      <span>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Guided Enquiry Card */}
              <div
                className="contact-form-card"
                style={{
                  background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.8) 0%, rgba(9, 14, 26, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 4vw, 40px)',
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
          {/* 8. CONCLUDING HIGH-IMPACT CALL TO ACTION */}
          {/* ============================================================ */}
          <section className="container" style={{ paddingBottom: '88px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(13, 21, 39, 0.8) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '24px',
                padding: 'clamp(36px, 5vw, 56px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <span
                  className="eyebrow"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    display: 'inline-block',
                    marginBottom: '16px',
                  }}
                >
                  TAKE THE NEXT STRATEGIC STEP
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    lineHeight: '1.2',
                    letterSpacing: '-0.03em',
                    margin: '0 0 16px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Ready to Accelerate Your Enterprise Growth?
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '28px' }}>
                  Partner with an established advisory practice that coordinates statutory compliance, finance, and real estate execution under one roof.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <a
                    href="#contact"
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      borderRadius: '10px',
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                      color: '#ffffff',
                      border: 'none',
                    }}
                  >
                    Book In-Person Consultation
                  </a>

                  <Link
                    href="/contact"
                    className="btn btn-secondary"
                    style={{
                      padding: '14px 24px',
                      borderRadius: '10px',
                      fontSize: '0.96rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
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
