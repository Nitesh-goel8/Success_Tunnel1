import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { sampleServices } from '../../lib/sampleData'
import {
  HiBriefcase, HiChartBar, HiAcademicCap, HiTrendingUp, HiOfficeBuilding, HiKey, HiArrowRight
} from 'react-icons/hi'
import { FaBullseye, FaBolt, FaGem } from 'react-icons/fa'

const coreServices = [
  {
    title: 'Corporate Consultancy',
    slug: 'consultancy',
    excerpt: 'Strategic corporate planning, statutory MCA secretarial filings, income tax representation, and GST advisory for scaling enterprises.',
    tags: ['Income Tax Filings', 'GST Audits', 'MCA Compliances', 'Startup Structuring']
  },
  {
    title: 'Corporate Finance',
    slug: 'finance',
    excerpt: 'Working capital facilitation, balance sheet restructuring, project loans, and institutional debt syndication solutions.',
    tags: ['Working Capital', 'Debt Syndication', 'Project Finance', 'CMA & Credit Advisory']
  },
  {
    title: 'Executive Education',
    slug: 'education',
    excerpt: 'Professional finance, corporate accounting, and practical taxation coursework for enterprise leadership and emerging executives.',
    tags: ['Taxation Modules', 'GST & Tally Practical', 'Financial Accounting', 'Corporate Upskilling']
  },
  {
    title: 'Investment Advisory',
    slug: 'investment',
    excerpt: 'Structured capital preservation, treasury management, and disciplined asset allocation advisory for long-term security.',
    tags: ['Treasury Planning', 'Capital Preservation', 'Asset Allocation', 'Risk Mitigation']
  },
  {
    title: 'Commercial Real Estate',
    slug: 'real-estate',
    excerpt: 'Commercial asset acquisition, high-street retail portfolios, and strategic lease negotiations in Panipat and North India.',
    tags: ['Commercial Asset Acquisition', 'Lease Negotiation', 'Portfolio Valuation', 'Due Diligence']
  },
  {
    title: 'Managed Workspaces',
    slug: 'rental-space',
    excerpt: 'Flexible corporate workspace, fully furnished executive office suites, and turnkey boardrooms in prime Panipat locations.',
    tags: ['Plug & Play Offices', 'Executive Boardrooms', 'Flexible Leases', 'Panipat City Centre']
  },
]

const benefits = [
  {
    icon: <FaBullseye size={22} />,
    title: 'Coordinated Strategy',
    text: 'All your statutory compliance, financial procurement, and real estate needs managed by a unified advisory team to eliminate inter-firm friction.'
  },
  {
    icon: <FaBolt size={22} />,
    title: 'Accountable Execution',
    text: 'Direct regulatory channels, automated tracking, and partner-led communication lines for prompt, predictable outcomes.'
  },
  {
    icon: <FaGem size={22} />,
    title: 'Institutional Transparency',
    text: 'Structured milestone reporting, verified audit logs, and clear engagement covenants with zero hidden ambiguities.'
  }
]

const processFlow = [
  { step: '01', title: 'Diagnostic Consultation', desc: 'Schedule a call or submit an inquiry detailing your organizational objectives and current scope.' },
  { step: '02', title: 'Scope & Requirement Review', desc: 'We examine your regulatory compliance status, financial statements, or commercial real estate specifications.' },
  { step: '03', title: 'Strategy & Structuring', desc: 'We build a clear, documented roadmap with timelines, required deliverables, and milestones.' },
  { step: '04', title: 'Coordinated Execution', desc: 'Our team carries out filings, advisory reviews, lender negotiations, or lease coordination.' },
  { step: '05', title: 'Continuous Governance', desc: 'We remain on hand for recurring statutory maintenance, annual audits, and ongoing strategic advisory.' }
]

const faqs = [
  {
    question: "What service lines does Success Tunnel cover?",
    answer: "We cover comprehensive professional services across six interconnected pillars: Corporate consultancy (income tax, GST, MCA compliance), corporate finance (debt syndication, working capital), executive education, investment advisory, commercial real estate, and managed workspaces."
  },
  {
    question: "Can I bundle multiple advisory disciplines together?",
    answer: "Yes. Most enterprise clients engage us for coordinated multi-disciplinary mandates—such as company incorporation (consultancy) combined with office search (managed workspace) and working capital credit arrangement (finance)."
  },
  {
    question: "Where are your headquarters located?",
    answer: "Our corporate headquarters are located at First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana. We also serve clients nationwide via encrypted virtual channels."
  }
]

export default function Services({ services }: { services: any[] }) {
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...coreServices].map(item => [item.slug, item])).values()
  ).slice(0, 6)

  return (
    <>
      <Head>
        <title>Professional Advisory Ecosystem — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Explore Success Tunnel practice areas: corporate consultancy, business finance, executive education, investment advisory, and commercial real estate."
        />
        <link rel="canonical" href="https://successtunnel.in/services" />
        <meta property="og:title" content="Professional Advisory Ecosystem — Success Tunnel" />
        <meta property="og:description" content="We unify consultancy, finance, education, investment, and property support into one coherent enterprise experience." />
        <meta property="og:url" content="https://successtunnel.in/services" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />
        <main>
          {/* Services Hero */}
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Practice Areas &amp; Capabilities
              </div>
              <h1 style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: 'var(--primary)',
                margin: '16px auto 24px'
              }}>
                Coordinated Enterprise Practice Areas.
              </h1>
              <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.68' }}>
                We unify corporate consultancy, debt syndication, executive learning, capital preservation, and commercial property into a single accountable client standard.
              </p>
            </div>
          </section>

          {/* All Services Grid */}
          <section className="section-surface" id="services-grid">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Practice Portfolio
                </div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  Expertise Across Growth Channels
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {serviceItems.map((service, index) => {
                  const fallbackData = coreServices.find(c => c.slug === service.slug) || coreServices[0]
                  return (
                    <div key={service.slug} className="expertise-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div className="expertise-icon-wrapper">
                          {service.slug === 'consultancy' ? <HiBriefcase size={26} /> :
                           service.slug === 'finance' ? <HiChartBar size={26} /> :
                           service.slug === 'education' ? <HiAcademicCap size={26} /> :
                           service.slug === 'investment' ? <HiTrendingUp size={26} /> :
                           service.slug === 'real-estate' ? <HiOfficeBuilding size={26} /> : <HiKey size={26} />}
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--muted-light)', fontFamily: 'Sora, sans-serif' }}>
                          0{index + 1}
                        </span>
                      </div>

                      <h3>{service.title}</h3>
                      <p>{service.excerpt || fallbackData.excerpt}</p>

                      <div className="expertise-tag-list">
                        {fallbackData.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="expertise-pill-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                        <Link href={service.slug === 'education' ? '/education' : `/services/${service.slug}`} className="expertise-card-link">
                          Explore Practice Scope <HiArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Execution Standard
                </div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  The Success Tunnel Advantage
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {benefits.map((b, i) => (
                  <div key={i} className="expertise-card" style={{ padding: '32px' }}>
                    <div className="expertise-icon-wrapper">{b.icon}</div>
                    <h3 style={{ fontSize: '1.18rem', marginBottom: '10px' }}>{b.title}</h3>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.94rem', lineHeight: '1.6' }}>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="section-surface">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Methodology
                </div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  Structured Delivery Roadmap
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {processFlow.map((flow, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', marginBottom: '8px' }}>
                      {flow.step}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px' }}>
                      {flow.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: '1.55', margin: 0 }}>
                      {flow.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '820px' }}>
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Common Inquiries
                </div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  Practice Area FAQs
                </h2>
              </div>

              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details key={index} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px 22px', marginBottom: '14px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                      {faq.question}
                    </summary>
                    <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: '12px 0 0' }}>
                      {faq.answer}
                    </p>
                  </details>
                ))}
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
    const services = await prisma.service.findMany()
    return {
      props: { services: JSON.parse(JSON.stringify(services)) },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: { services: sampleServices },
      revalidate: 60
    }
  }
}
