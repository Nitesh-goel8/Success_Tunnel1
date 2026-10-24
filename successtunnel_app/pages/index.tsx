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
  HiShieldCheck, HiGlobeAlt, HiUsers, HiStar,
  HiBriefcase, HiChartBar, HiAcademicCap, HiTrendingUp, HiOfficeBuilding, HiKey,
  HiLocationMarker, HiPhone, HiMail, HiClock, HiChatAlt2, HiCheckCircle, HiArrowRight,
} from 'react-icons/hi'
import { FaWhatsapp, FaRocket, FaIndustry, FaStore, FaUniversity, FaTools } from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

const coreServices = [
  { title: 'Consultancy', slug: 'consultancy', icon: '💼', excerpt: 'Strategic planning, corporate compliance, and tax advisory for scaling enterprises.' },
  { title: 'Finance', slug: 'finance', icon: '📊', excerpt: 'Financial restructuring, investment planning, and capital procurement.' },
  { title: 'Education', slug: 'education', icon: '🎓', excerpt: 'Corporate training programs, notes, and professional skill development.' },
  { title: 'Investment', slug: 'investment', icon: '📈', excerpt: 'Disciplined portfolio allocation and capital preservation advisory.' },
  { title: 'Real Estate', slug: 'real-estate', icon: '🏢', excerpt: 'Property acquisition, commercial portfolio planning, and advisory.' },
  { title: 'Rental Space', slug: 'rental-space', icon: '🔑', excerpt: 'Flexible corporate workspace and managed office solutions.' },
]

const trustedBrands = [
  'Corporate Advisory',
  'Tax & Compliance',
  'Commercial Property',
  'Financial Planning',
  'Corporate Workspace',
  'Learning Portals',
]

const industries = [
  { id: 'startups', name: 'Startups', icon: <FaRocket size={22} /> },
  { id: 'msme', name: 'MSME', icon: <FaIndustry size={22} /> },
  { id: 'healthcare', name: 'Healthcare', icon: <MdHealthAndSafety size={22} /> },
  { id: 'banking', name: 'Banking', icon: <FaUniversity size={22} /> },
  { id: 'construction', name: 'Construction', icon: <FaTools size={22} /> },
  { id: 'retail', name: 'Retail', icon: <FaStore size={22} /> }
]

const blogs = [
  {
    category: 'FINANCE',
    title: 'The Future of MSME Financing in 2024',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Exploring new avenues for debt-free capital in a rising interest rate environment.'
  },
  {
    category: 'MANAGEMENT',
    title: 'Bridging the Corporate Leadership Gap',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
    excerpt: 'How to cultivate the next generation of executives through strategic training.'
  },
  {
    category: 'PROPERTIES',
    title: 'Investing in Sustainable Commercial Spaces',
    image: 'https://images.unsplash.com/photo-1464938050744-13748f5ad1a2?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Why ESG compliance is now the biggest driver for real estate ROI.'
  }
]

export default function Home({ services, featuredEducationContent }: { services: any[]; featuredEducationContent: any | null }) {
  const settings = useSiteSettings()
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...coreServices].map(item => [item.slug, item])).values()
  ).slice(0, 6)

  const [activeInd, setActiveInd] = useState('startups')

  return (
    <>
      <Head>
        <title>Success Tunnel — Corporate Consultancy, Finance, Education & Real Estate</title>
        <meta
          name="description"
          content="Success Tunnel is your strategic advisory partner in India, unifying corporate compliance, business finance, professional education, investment guidance, and real estate solutions."
        />
        <link rel="canonical" href="https://successtunnel.in" />
        <meta property="og:title" content="Success Tunnel — Strategic Advisory & Execution" />
        <meta
          property="og:description"
          content="One coordinated multidisciplinary partner across consulting, tax, finance, and commercial real estate."
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
                streetAddress: settings.officeAddress || 'New Delhi, India',
              },
            }),
          }}
        />
      </Head>

      <div>
        <Nav />

        <main>
          {/* 1. Hero Section */}
          <section className="hero-section" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="container hero-grid" style={{ alignItems: 'center' }}>
              <div className="hero-copy">
                <h1 style={{ 
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)', 
                  lineHeight: '1.05', 
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: 'var(--primary)',
                  margin: '0 0 24px 0',
                  fontFamily: "'Sora', sans-serif"
                }}>
                  A Fastest Way<br />
                  <span style={{ background: 'linear-gradient(135deg, var(--accent), #0b3a86)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>to Big Success.</span>
                </h1>
                <p style={{ 
                  fontSize: '1.15rem', 
                  lineHeight: '1.65', 
                  color: 'var(--muted)', 
                  marginBottom: '32px', 
                  maxWidth: '520px' 
                }}>
                  Strategic consultancy, finance, education, investment, and real estate solutions designed to accelerate your growth and secure your future.
                </p>
                <div className="hero-actions">
                  <a href="#contact" className="btn btn-primary" style={{ padding: '16px 28px' }}>
                    Book Consultation &rarr;
                  </a>
                  <Link href="/services" className="btn btn-secondary" style={{ padding: '16px 28px' }}>
                    Explore Services
                  </Link>
                </div>

                {/* Bottom Metrics inside Hero (Factual capabilities) */}
                <div className="hero-metrics-bar">
                  <div className="hero-metric-item">
                    <div className="hero-metric-icon"><HiShieldCheck size={22} /></div>
                    <div className="hero-metric-text">Direct Advisory<br/>&amp; Governance</div>
                  </div>
                  <div className="hero-metric-item">
                    <div className="hero-metric-icon"><HiGlobeAlt size={22} /></div>
                    <div className="hero-metric-text">Multidisciplinary<br/>Practice</div>
                  </div>
                  <div className="hero-metric-item">
                    <div className="hero-metric-icon"><HiBriefcase size={22} /></div>
                    <div className="hero-metric-text">Coordinated<br/>Execution</div>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Branch Diagram */}
              <div className="hero-diagram-container">
                <svg className="hero-svg-overlay" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(22, 93, 245, 0.12)" strokeWidth="1.5" strokeDasharray="6,6" />
                  <circle cx="250" cy="250" r="90" fill="none" stroke="rgba(22, 93, 245, 0.08)" strokeWidth="1.5" />
                  
                  <line x1="250" y1="250" x2="135" y2="120" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                  <line x1="250" y1="250" x2="365" y2="120" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                  <line x1="250" y1="250" x2="410" y2="250" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                  <line x1="250" y1="250" x2="365" y2="380" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                  <line x1="250" y1="250" x2="135" y2="380" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                  <line x1="250" y1="250" x2="90" y2="250" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />

                  <circle cx="190" cy="185" r="4.5" fill="var(--accent)" />
                  <circle cx="310" cy="185" r="4.5" fill="var(--accent)" />
                  <circle cx="350" cy="250" r="4.5" fill="var(--accent)" />
                  <circle cx="310" cy="315" r="4.5" fill="var(--accent)" />
                  <circle cx="190" cy="315" r="4.5" fill="var(--accent)" />
                  <circle cx="150" cy="250" r="4.5" fill="var(--accent)" />
                </svg>

                <div className="hero-center-node">
                  <Image
                    src="/logo.jpeg"
                    alt="SuccessTunnel"
                    width={70}
                    height={70}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                    priority
                  />
                </div>

                <Link href="/services/consultancy" className="hero-outer-node theme-consultancy" style={{ top: '65px', left: '40px' }}>
                  <span><HiBriefcase size={15} /></span> Consultancy
                </Link>
                <Link href="/services/finance" className="hero-outer-node theme-finance" style={{ top: '65px', right: '40px' }}>
                  <span><HiChartBar size={15} /></span> Finance
                </Link>
                <Link href="/education" className="hero-outer-node theme-education" style={{ top: '228px', right: '10px' }}>
                  <span><HiAcademicCap size={15} /></span> Education
                </Link>
                <Link href="/services/investment" className="hero-outer-node theme-investment" style={{ bottom: '65px', right: '40px' }}>
                  <span><HiTrendingUp size={15} /></span> Investment
                </Link>
                <Link href="/services/real-estate" className="hero-outer-node theme-real-estate" style={{ bottom: '65px', left: '40px' }}>
                  <span><HiOfficeBuilding size={15} /></span> Real Estate
                </Link>
                <Link href="/services/rental-space" className="hero-outer-node theme-rental-space" style={{ top: '228px', left: '10px' }}>
                  <span><HiKey size={15} /></span> Rental Space
                </Link>
              </div>
            </div>
          </section>

          {/* 2. Capability Channels */}
          <section className="trusted-logos-section">
            <div className="container">
              <div className="trusted-title">Coordinated Professional Practice Areas</div>
              <div className="logo-slider">
                <div className="logo-slide-track">
                  {trustedBrands.map((brand, idx) => (
                    <div key={idx} className="logo-item">
                      <span>✓</span> {brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Services Grid */}
          <section className="section-surface" id="services">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span className="eyebrow">PRACTICE ECOSYSTEM</span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                  Expertise Across Growth Channels
                </h2>
              </div>

              <div className="expertise-grid">
                {serviceItems.map(service => (
                  <div key={service.slug} className={`expertise-card theme-${service.slug}`}>
                    <div className="expertise-icon-wrapper">
                      {service.slug === 'consultancy' ? <HiBriefcase size={28} /> :
                       service.slug === 'finance' ? <HiChartBar size={28} /> :
                       service.slug === 'education' ? <HiAcademicCap size={28} /> :
                       service.slug === 'investment' ? <HiTrendingUp size={28} /> :
                       service.slug === 'real-estate' ? <HiOfficeBuilding size={28} /> : <HiKey size={28} />}
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.excerpt}</p>
                    <Link href={`/services/${service.slug}`} className="expertise-card-link">
                      Learn More &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Industries We Serve */}
          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '0' }}>
                  Industries We Support
                </h2>
              </div>

              <div className="industries-pill-grid">
                {industries.map(ind => (
                  <div
                    key={ind.id}
                    className={`industry-pill-item ${activeInd === ind.id ? 'active' : ''}`}
                    onClick={() => setActiveInd(ind.id)}
                  >
                    <div className="industry-icon-container">{ind.icon}</div>
                    <span>{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Execution Standards (Factual principles replacing fake testimonials) */}
          <section className="section-surface">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span className="eyebrow">STANDARDS &amp; GOVERNANCE</span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '10px 0 16px' }}>
                  Execution Standards &amp; Quality Commitments
                </h2>
                <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Our team adheres to strict advisory standards to deliver transparent outcomes with zero ambiguity.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '40px' }}>
                {[
                  {
                    title: 'Regulatory Accuracy',
                    desc: 'Timely tax filings, statutory compliance, and rigorous legal adherence without guesswork.',
                  },
                  {
                    title: 'Multidisciplinary Team',
                    desc: 'Coordinated experts across consultancy, accounting, lending, and property under one roof.',
                  },
                  {
                    title: 'Confidentiality & Security',
                    desc: 'Strict non-disclosure protocols, secure storage, and role-enforced access controls.',
                  },
                  {
                    title: 'Milestone Transparency',
                    desc: 'Progress mathematically verified from completed deliverables and tasks.',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ color: '#2563eb', fontSize: '1.5rem', marginBottom: '12px' }}>
                      <HiCheckCircle />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href="/projects" className="btn btn-secondary" style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Explore Verified Projects &amp; Case Studies <HiArrowRight />
                </Link>
              </div>
            </div>
          </section>

          {/* 6. About Us Section (Cleaned of fake stats) */}
          <section className="section-surface" id="about" style={{ background: '#f8fafc', scrollMarginTop: '100px' }}>
            <div className="container">
              <div className="about-grid">
                <div>
                  <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>ABOUT US</span>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--primary)', fontWeight: 800, lineHeight: '1.15', margin: '16px 0 20px', letterSpacing: '-0.03em' }}>
                    One Partner.<br />Every Growth Need.
                  </h2>
                  <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '20px' }}>
                    Success Tunnel eliminates the friction that holds growing businesses back. Instead of juggling disconnected advisors, you get one strategic partner for consultancy, finance, education, investment, and real estate.
                  </p>
                  <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '32px' }}>
                    Our multidisciplinary team delivers practical solutions with complete clarity at every stage.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href="/contact" className="cta-btn-primary" style={{ fontSize: '0.95rem' }}>Book Consultation &rarr;</Link>
                  </div>
                </div>

                <div className="about-stats-grid">
                  {[
                    { number: 'Consultancy', label: 'Income Tax, GST, MCA & Registrations' },
                    { number: 'Finance', label: 'Financial Direction & Capital Planning' },
                    { number: 'Property', label: 'Commercial Real Estate & Workspace' },
                    { number: 'Education', label: 'Professional Learning & Resources' },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', lineHeight: 1.2 }}>{stat.number}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500, marginTop: '8px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 7. CTA Section */}
          <section className="container">
            <div className="cta-banner-container">
              <h2>Ready to Accelerate Your Business Growth?</h2>
              <div className="cta-actions">
                <a href="#contact" className="cta-btn-primary">Book Consultation</a>
                <Link href="/contact" className="cta-btn-secondary">Contact Us</Link>
              </div>
            </div>
          </section>

          {/* 8. Contact Section */}
          <section className="section-surface" id="contact" style={{ scrollMarginTop: '100px' }}>
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <span className="eyebrow" style={{ marginBottom: '24px' }}>TALK TO US</span>
                <h3>Let&apos;s Discuss Your Vision</h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiLocationMarker size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Office Address</h4>
                    <p>{settings.officeAddress}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiPhone size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Call Us</h4>
                    <p>
                        <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'block' }}>{settings.contactPhone1}</a>
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>{settings.contactPhone2}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiMail size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Email Us</h4>
                    <p><a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{settings.contactEmail}</a></p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><FaWhatsapp size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>WhatsApp</h4>
                    <p><a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>Chat on WhatsApp &rarr;</a></p>
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
                  title="Get a quick callback"
                  subtitle="Tell us what you need and we'll help with the next step."
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
