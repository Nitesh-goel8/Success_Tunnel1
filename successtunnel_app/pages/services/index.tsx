import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PerspectiveServiceCard from '../../components/home/PerspectiveServiceCard'
import InteractiveServiceExplorer from '../../components/home/InteractiveServiceExplorer'
import ProcessTimeline from '../../components/home/ProcessTimeline'
import { prisma } from '../../lib/prisma'
import { sampleServices } from '../../lib/sampleData'
import {
  HiBriefcase,
  HiChartBar,
  HiAcademicCap,
  HiTrendingUp,
  HiOfficeBuilding,
  HiKey,
  HiArrowRight,
  HiShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
} from 'react-icons/hi'

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

export default function Services({ services }: { services: any[] }) {
  return (
    <>
      <Head>
        <title>Professional Services Ecosystem — Success Tunnel | Panipat HQ</title>
        <meta
          name="description"
          content="Explore Success Tunnel practice areas: corporate consultancy, business finance, practical education, investment direction, and commercial real estate in Panipat, Haryana."
        />
        <link rel="canonical" href="https://successtunnel.in/services" />
        <meta property="og:title" content="Professional Services Ecosystem — Success Tunnel" />
        <meta
          property="og:description"
          content="We unify corporate consulting, finance, education, investment, and commercial property into one coordinated advisory practice in Panipat, Haryana."
        />
        <meta property="og:url" content="https://successtunnel.in/services" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="cinematic-theme-root">
        <Nav />

        <main>
          {/* Hero Section */}
          <section
            style={{
              paddingTop: 'clamp(50px, 8vw, 90px)',
              paddingBottom: 'clamp(40px, 6vw, 70px)',
              textAlign: 'center',
            }}
          >
            <div className="container" style={{ maxWidth: '840px' }}>
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
                  marginBottom: '20px',
                }}
              >
                PRACTICE ECOSYSTEM &bull; PANIPAT HEADQUARTERS
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 auto 24px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Disciplined Advisory Across Every Stage of Growth.
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.75', margin: '0 auto 36px' }}>
                We coordinate statutory tax compliance, debt syndication, professional workforce training, investment modeling, and commercial real estate under one unified leadership team in Panipat, Haryana.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                <a
                  href="#practice-grid"
                  className="btn btn-primary"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  Explore Practice Grid <HiArrowRight />
                </a>

                <Link
                  href="/contact"
                  className="btn btn-secondary"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </section>

          {/* 3D Perspective Practice Cards */}
          <section id="practice-grid" style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 56px' }}>
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                  SIX INTEGRATED PRACTICES
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    margin: '14px 0 14px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Practice Areas &amp; Core Competencies
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Select any card to review statutory scope, required documentation, and direct advisory steps.
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
                    pillarNumber={service.pillarNumber}
                    keyTags={service.keyTags}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Service Explorer */}
          <InteractiveServiceExplorer />

          {/* Process Timeline */}
          <ProcessTimeline />

          {/* Closing Consultation CTA */}
          <section className="container" style={{ padding: '80px 0 96px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '24px',
                padding: 'clamp(28px, 4vw, 48px)',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: '#f8fafc', fontWeight: 800, margin: '0 0 16px', fontFamily: "'Sora', sans-serif" }}>
                Need Tailored Advisory for Your Business?
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 28px' }}>
                Schedule a confidential consultation with our principal advisors at our Panipat headquarters or online via video conference.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                <Link
                  href="/contact"
                  className="btn btn-primary"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  Schedule In-Person Consultation <HiArrowRight />
                </Link>
                <Link
                  href="/projects"
                  className="btn btn-secondary"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  View Public Projects
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    return {
      props: { services: JSON.parse(JSON.stringify(services)) },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: { services: sampleServices },
      revalidate: 60,
    }
  }
}
