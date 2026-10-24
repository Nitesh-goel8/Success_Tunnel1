import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import {
  HiShieldCheck,
  HiGlobeAlt,
  HiOutlineScale,
  HiOutlineCheckCircle,
  HiLocationMarker,
  HiArrowRight,
  HiCheckCircle,
} from 'react-icons/hi'

const coreValues = [
  {
    title: 'Multidisciplinary Coordination',
    text: 'A unified advisory practice bridging corporate compliance, accounting, capital finance, and commercial property under one roof.',
    color: '#38bdf8',
  },
  {
    title: 'Statutory Rigor & Integrity',
    text: 'We adhere to absolute regulatory accuracy in tax filings, audit documentation, and registry governance without shortcuts.',
    color: '#60a5fa',
  },
  {
    title: 'Client-Centric Execution',
    text: 'Clear deliverables, transparent timelines, and measurable milestone progression eliminating bureaucratic friction.',
    color: '#a855f7',
  },
  {
    title: 'Data Confidentiality',
    text: 'Institutional non-disclosure agreements, encrypted document handling, and role-enforced access protect all client records.',
    color: '#10b981',
  },
]

const advisoryProcess = [
  {
    step: '01',
    title: 'Engagement & Practice Scoping',
    text: 'We assess the scope, regulatory dependencies, and timeline to map out the exact advisory track required.',
  },
  {
    step: '02',
    title: 'Due Diligence & Documentation',
    text: 'Our team verifies statutory records, financial statements, or commercial titles to build an airtight basis.',
  },
  {
    step: '03',
    title: 'Strategy & Direct Execution',
    text: 'We execute filings, bank CMA dossiers, syllabus modules, or lease agreements with transparent milestone reporting.',
  },
  {
    step: '04',
    title: 'Ongoing Governance & Support',
    text: 'Post-delivery follow-ups, periodic compliance reviews, and proactive guidance to sustain long-term business health.',
  },
]

const servicePillars = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    text: 'Income Tax, GST, LLP & Company registrations, statutory audits, and corporate secretarial governance.',
  },
  {
    title: 'Financial Direction',
    slug: 'finance',
    text: 'CMA data preparation, debt syndication, project financing, and capital restructuring for scaling MSMEs.',
  },
  {
    title: 'Professional Education',
    slug: 'education',
    text: 'Practical accounting workshops, live tax portal filing masterclasses, and certified corporate curriculum.',
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    text: 'Asset allocation strategies, risk modeling, and capital preservation across verified asset classes.',
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    text: 'Prime commercial land, title due diligence, yield modeling, and corporate portfolio acquisition.',
  },
  {
    title: 'Managed Rental Space',
    slug: 'rental-space',
    text: 'Ready-to-occupy executive suites, private cabins, and serviced conference rooms in central Panipat.',
  },
]

export default function About() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>About Us — Success Tunnel | Strategic Advisory &amp; Execution</title>
        <meta
          name="description"
          content="Learn about Success Tunnel — an integrated multidisciplinary advisory practice headquartered in Panipat, Haryana, delivering corporate consultancy, finance, education, and real estate solutions."
        />
        <link rel="canonical" href="https://successtunnel.in/about" />
        <meta property="og:title" content="About Us — Success Tunnel" />
        <meta
          property="og:description"
          content="An integrated advisory practice uniting corporate tax, finance, practical education, and commercial property in Panipat, Haryana."
        />
        <meta property="og:url" content="https://successtunnel.in/about" />
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
              position: 'relative',
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
                OUR HERITAGE &bull; PANIPAT HEADQUARTERS
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 auto 24px',
                  fontFamily: "'Sora', sans-serif',",
                }}
              >
                One Strategic Partner for Growth, Clarity, and Execution.
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#94a3b8',
                  lineHeight: '1.75',
                  margin: '0 auto 36px',
                }}
              >
                Success Tunnel eliminates the friction of managing fragmented advisors. We integrate corporate compliance, finance, professional training, investment, and commercial property into a unified advisory practice based in Panipat, Haryana.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                <Link
                  href="/contact"
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
                  Schedule Advisory Consultation <HiArrowRight />
                </Link>

                <Link
                  href="/projects"
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
                  Explore Public Projects
                </Link>
              </div>
            </div>
          </section>

          {/* Core Values / Philosophy */}
          <section style={{ padding: '72px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
                <span className="eyebrow" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.08)' }}>
                  OUR OPERATING PRINCIPLES
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
                  How We Drive Measurable Outcomes
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  We replace ambiguous promises with rigorous professional standards, licensed governance, and complete transparency.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px',
                }}
              >
                {coreValues.map((val, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(9, 13, 22, 0.95) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px',
                      padding: '32px 26px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${val.color}22`,
                        border: `1px solid ${val.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: val.color,
                        marginBottom: '18px',
                      }}
                    >
                      <HiShieldCheck size={24} />
                    </div>

                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        marginBottom: '10px',
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      {val.title}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                      {val.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Integrated Practices Overview */}
          <section style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 52px' }}>
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                  COMPREHENSIVE ECOSYSTEM
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
                  Six Integrated Practice Disciplines
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Each practice is led by licensed practitioners with direct operational experience in Indian corporate law, banking, and commerce.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {servicePillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '18px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '8px' }}>
                        PRACTICE 0{idx + 1}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 12px', fontFamily: "'Sora', sans-serif" }}>
                        {pillar.title}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                        {pillar.text}
                      </p>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <Link
                        href={`/services/${pillar.slug}`}
                        style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        Learn more &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4-Step Advisory Process */}
          <section style={{ padding: '80px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
                <span className="eyebrow" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.08)' }}>
                  EXECUTION DISCIPLINE
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
                  Our 4-Stage Advisory Flow
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Structured milestones that keep work moving quickly and transparently.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '24px',
                }}
              >
                {advisoryProcess.map((proc, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '18px',
                      padding: '28px',
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: "'Sora', sans-serif", marginBottom: '12px' }}>
                      {proc.step}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 10px', fontFamily: "'Sora', sans-serif" }}>
                      {proc.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {proc.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panipat HQ Contact Card */}
          <section className="container" style={{ paddingBottom: '96px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '24px',
                padding: 'clamp(28px, 4vw, 48px)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '10px' }}>
                  <HiLocationMarker size={22} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Corporate Office &bull; Panipat
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    margin: '0 0 12px',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Visit Our Panipat Advisory Office
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
                  {settings.officeAddress}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'flex-start' }}>
                <Link
                  href="/contact"
                  className="btn btn-primary"
                  style={{
                    padding: '14px 26px',
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
                  Book Meeting in Panipat <HiArrowRight />
                </Link>

                <a
                  href={`tel:${settings.contactPhone1}`}
                  className="btn btn-secondary"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    textDecoration: 'none',
                  }}
                >
                  Call {settings.contactPhone1}
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
