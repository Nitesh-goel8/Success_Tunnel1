import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import GuidedEnquiry from '../../components/GuidedEnquiry'
import { prisma } from '../../lib/prisma'
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi'

const fallbackSubservices: Record<string, { title: string; text: string }[]> = {
  consultancy: [
    { title: 'Income Tax Planning & Filings', text: 'Corporate tax compliance, return filings, statutory advance tax, and tax audit support.' },
    { title: 'GST Compliance & Representation', text: 'Monthly/annual filings, input tax credit reconciliation, and GST department audits.' },
    { title: 'MCA & Secretarial Compliances', text: 'Private Limited / LLP annual filings, board resolutions, DIN/DIR-3 KYC, and statutory governance.' },
    { title: 'Startup & MSME Registration', text: 'DPIIT startup recognition, Udyam MSME certificate, and state industrial subsidy support.' },
    { title: 'Trademark & IP Protection', text: 'Brand registration, trademark search reports, objection hearings, and renewal monitoring.' },
    { title: 'Trust, Society & NGO Compliance', text: 'Section 8 company incorporation, 12A/80G approvals, and CSR project advisory.' },
  ],
  finance: [
    { title: 'Working Capital Facilities', text: 'Cash Credit (CC), Overdraft (OD), and LC/BG limits from scheduled commercial banks.' },
    { title: 'Term Loans & Project Financing', text: 'Appraisal reports, CMA preparation, and financial structuring for industrial expansion.' },
    { title: 'Debt Syndication & Restructuring', text: 'Multilateral lender coordination, balance sheet restructuring, and interest rate optimization.' },
    { title: 'Statutory Financial Due Diligence', text: 'In-depth balance sheet reviews, cash flow projections, and lender compliance audits.' },
  ],
  education: [
    { title: 'Executive Tax Masterclasses', text: 'Structured corporate taxation notes, TDS computation, and practical GST workflows.' },
    { title: 'Practical Accounting & Tally', text: 'Real-world business case studies, ledger closure, and ERP ledger maintenance.' },
    { title: 'Corporate Staff Upskilling', text: 'On-site and virtual workforce capacity-building for enterprise finance departments.' },
    { title: 'Exam & Certification Mentorship', text: 'Rigorous modules covering corporate law, taxation guidelines, and compliance standards.' },
  ],
  investment: [
    { title: 'Corporate Treasury Advisory', text: 'Surplus liquidity allocation into disciplined low-risk capital preservation assets.' },
    { title: 'Promoter Asset Allocation', text: 'Strategic portfolio diversification designed for intergenerational wealth security.' },
    { title: 'Capital Preservation Mandates', text: 'Risk-adjusted return profiling protecting business capital from inflation and volatility.' },
    { title: 'Regulatory Compliance Reviews', text: 'Ensuring personal and enterprise investments meet FEMA, RBI, and SEBI regulations.' },
  ],
  'real-estate': [
    { title: 'Commercial Asset Acquisition', text: 'Sourcing, due diligence, and negotiation for prime commercial towers and retail plots in Panipat.' },
    { title: 'High-Street Retail Leases', text: 'Anchor tenant negotiation, lease structuring, and ROI modeling for retail centers.' },
    { title: 'Title Search & Due Diligence', text: 'Comprehensive registry checks, encumbrance verification, and revenue authority clearances.' },
    { title: 'Portfolio Asset Valuation', text: 'Fair market valuation reports for collateral, balance sheet disclosure, and lease renewals.' },
  ],
  'rental-space': [
    { title: 'Turnkey Corporate Suites', text: 'Plug-and-play furnished offices with high-speed internet, power backup, and ergonomics.' },
    { title: 'Executive Boardrooms', text: 'On-demand meeting facilities for client presentations, interviews, and director meetings in Panipat.' },
    { title: 'Flexible Commercial Leases', text: 'Adaptable square-footage arrangements without burdensome multi-year lock-in restrictions.' },
    { title: 'Managed Facilities Maintenance', text: 'Full housekeeping, reception handling, security, and administrative infrastructure.' },
  ],
}

const benefits = [
  { title: 'Partner-Led Accountability', text: 'Engage directly with experienced practice heads rather than rotating junior coordinators.' },
  { title: 'Documented SLA Response', text: 'Transparent 24-hour turnaround commitments with structured statutory checklists.' },
  { title: 'Multidisciplinary Standard', text: 'Tax, legal, and financial dimensions reviewed concurrently under one governance roof.' },
]

const processSteps = [
  { number: '01', title: 'Diagnostic Review', text: 'We examine your entity requirements, statutory deadlines, or property specifications.' },
  { number: '02', title: 'Advisory Architecture', text: 'We formulate a documented engagement scope with timelines and required filings.' },
  { number: '03', title: 'Execution & Lodgement', text: 'Our practice desk executes the mandate, liaising directly with regulatory authorities.' },
  { number: '04', title: 'Ongoing Governance', text: 'We provide closure documentation, verified logs, and ongoing statutory maintenance.' },
]

const faqItems = [
  {
    question: 'How quickly can we initiate this advisory mandate?',
    answer: 'Following our initial diagnostic discussion, we issue the engagement scope within 24 hours and begin execution upon receipt of documents.',
  },
  {
    question: 'Do you offer in-person consultation in Panipat?',
    answer: 'Yes. You can meet our practice directors at our corporate chambers in Sudarshan Tower, Panipat or collaborate virtually over encrypted video channels.',
  },
  {
    question: 'Can this service be combined with other practice areas?',
    answer: 'Yes. Most enterprise clients engage us for bundled multidisciplinary mandates—such as company registration alongside corporate finance and office leasing.',
  },
]

export default function ServiceDetail({ service, subservices }: { service: any; subservices: any[] }) {
  if (!service) return <div>Not found</div>

  const subserviceItems =
    subservices?.length > 0
      ? subservices.map(item => ({ title: item.title, text: item.content || 'Tailored support for this sub-service.' }))
      : fallbackSubservices[service.slug] || []

  return (
    <div>
      <Head>
        <title>{service.title} — Success Tunnel Advisory Group | Panipat</title>
        <meta
          name="description"
          content={`${service.title} advisory and execution by Success Tunnel in Panipat, Haryana. Comprehensive governance, dedicated practice heads, and predictable outcomes.`}
        />
        <link rel="canonical" href={`https://successtunnel.in/services/${service.slug}`} />
      </Head>

      <Nav />
      <main>
        {/* Practice Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Practice Area Overview
              </div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)', margin: '14px 0 20px' }}>
                {service.title}
              </h1>
              <p style={{ maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: '1.68', marginBottom: '28px' }}>
                {service.excerpt || 'Executive advisory services designed to deliver regulatory clarity, financial control, and measurable business outcomes.'}
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a href="#contact-form" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Schedule Consultation &rarr;
                </a>
                <Link href="/services" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  All Practice Areas
                </Link>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '18px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Governance Covenants
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 16px' }}>
                What Clients Can Depend On
              </h3>
              <div style={{ display: 'grid', gap: '14px' }}>
                {benefits.map(item => (
                  <div key={item.title} style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                      <HiCheckCircle style={{ color: 'var(--accent)' }} />
                      {item.title}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Subservices Grid */}
        <section className="section-surface" id="subservices">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Service Scope
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                Core Advisory Deliverables
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {subserviceItems.map((item, index) => (
                <div key={item.title} className="expertise-card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Scope 0{index + 1}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                <span className="editorial-tag-dot" />
                Engagement Flow
              </div>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                The 4-Stage Advisory Workflow
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {processSteps.map(step => (
                <div key={step.number} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', marginBottom: '8px' }}>
                    STAGE {step.number}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.55', margin: 0 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & Quick Consultation Form */}
        <section className="section-surface" id="contact-form">
          <div className="container contact-section-grid">
            <div className="contact-info-panel">
              <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                <span className="editorial-tag-dot" />
                Client Guidance
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 20px' }}>
                Frequently Asked Questions
              </h2>

              <div className="faq-list">
                {faqItems.map(item => (
                  <details key={item.question} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                      {item.question}
                    </summary>
                    <p style={{ marginTop: '10px', color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: '10px 0 0' }}>
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="contact-form-card">
              <GuidedEnquiry
                page={`service:${service.slug}`}
                title={`Schedule Consultation for ${service.title}`}
                subtitle="Submit your requirements to connect with the designated practice director."
                selectedService={service.title}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const staticSlugs = new Set(['consultancy', 'finance', 'education', 'investment', 'real-estate', 'rental-space'])

export async function getStaticPaths() {
  try {
    const services = await prisma.service.findMany({ select: { slug: true } })
    const paths = services
      .filter(s => !staticSlugs.has(s.slug))
      .map(s => ({ params: { slug: s.slug } }))
    return {
      paths,
      fallback: 'blocking',
    }
  } catch {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
      include: { subservices: true },
    })

    if (!service) {
      return { notFound: true }
    }

    return {
      props: {
        service: JSON.parse(JSON.stringify(service)),
        subservices: JSON.parse(JSON.stringify(service.subservices || [])),
      },
      revalidate: 60,
    }
  } catch {
    return { notFound: true }
  }
}
