import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import EnquiryForm from '../../components/EnquiryForm'
import { prisma } from '../../lib/prisma'

const fallbackSubservices: Record<string, { title: string; text: string }[]> = {
  consultancy: [
    { title: 'Income Tax', text: 'Tax planning and filing support for individuals and businesses.' },
    { title: 'GST Compliance', text: 'Registration, return filing and audit assistance.' },
    { title: 'MSME Registration', text: 'Structured support for small and medium enterprises.' },
    { title: 'Trademark', text: 'Brand protection, filing and monitoring guidance.' },
    { title: 'Company Services', text: 'Incorporation, filings and governance support.' },
    { title: 'NPO / Trust', text: 'Registration and compliance for mission-driven organizations.' },
  ],
  finance: [
    { title: 'Planning', text: 'Personal and business financial planning support.' },
    { title: 'Funding', text: 'Guidance on loans, credit and capital access.' },
    { title: 'Risk', text: 'Decision support for capital and cash flow management.' },
    { title: 'Reporting', text: 'Clear financial reporting and review cycles.' },
  ],
  education: [
    { title: 'Study Material', text: 'Notes, PDFs and guided learning resources.' },
    { title: 'Tally Course', text: 'Practical accounting and software-based learning.' },
    { title: 'Career Support', text: 'Skill-building and exam preparation support.' },
    { title: 'Student Guidance', text: 'A clear path for learners who need direction.' },
  ],
  investment: [
    { title: 'Portfolio Review', text: 'Current allocation review and next-step advice.' },
    { title: 'Asset Strategy', text: 'Guidance for long-term value and stability.' },
    { title: 'Wealth Planning', text: 'Structured decision support for capital growth.' },
    { title: 'Risk Management', text: 'Keep investments aligned to your comfort level.' },
  ],
  'real-estate': [
    { title: 'Acquisition', text: 'Support for buying the right residential or commercial asset.' },
    { title: 'Portfolio Growth', text: 'Long-term property strategy and expansion planning.' },
    { title: 'Rental Yield', text: 'Advice for improving occupancy and return.' },
    { title: 'Due Diligence', text: 'Better decisions through document review and checks.' },
  ],
  'rental-space': [
    { title: 'Commercial Space', text: 'Office and storefront options for growing teams.' },
    { title: 'Residential Space', text: 'Comfortable living spaces with the right fit.' },
    { title: 'Budget Match', text: 'Filter by budget, area and usage requirements.' },
    { title: 'Lease Support', text: 'Guidance through agreements and move-in planning.' },
  ],
}

const benefits = [
  { title: 'Experienced guidance', text: 'Senior-level advice aligned to your exact service need.' },
  { title: 'Fast response', text: 'Clear next steps with prompt communication and follow-up.' },
  { title: 'Trusted process', text: 'A premium engagement model that keeps work organized.' },
]

const processSteps = [
  { number: '01', title: 'Discovery', text: 'We review your need and capture the exact scope.' },
  { number: '02', title: 'Plan', text: 'We outline deliverables, dependencies and timelines.' },
  { number: '03', title: 'Execute', text: 'We handle the work with careful communication.' },
  { number: '04', title: 'Support', text: 'We stay available for next-step assistance.' },
]

const faqItems = [
  {
    question: 'How quickly can we get started?',
    answer: 'Most enquiries receive a response within one business day, and urgent requests can be prioritized.',
  },
  {
    question: 'Do you support both individuals and businesses?',
    answer: 'Yes. The workflow is adapted to the service type and whether the request is personal or corporate.',
  },
  {
    question: 'Can you tailor the engagement?',
    answer: 'Absolutely. We can refine scope, turnaround, and support level based on your goals and timeline.',
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
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Service detail</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                {service.title}
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 680, color: 'var(--muted)', fontSize: '1.06rem' }}>
                {service.excerpt || 'Executive advisory services designed to deliver clarity, control and measurable value.'}
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  Book Consultation
                </a>
                <a href="/services" className="btn btn-secondary">
                  Back to Services
                </a>
              </div>
            </div>

            <div className="article-feature">
              <span className="service-card-kicker">What to expect</span>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                A premium engagement built to keep your decision-making simple.
              </h2>
              <p style={{ marginTop: 14 }}>
                We combine practical service execution with clear communication and dependable support.
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                {benefits.map(item => (
                  <div key={item.title} className="mini-card">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Core services</span>
            <h2>Specialized support areas under this service.</h2>
            <p>Each subservice is designed to be easy to understand, easy to compare and easy to act on.</p>
          </div>

          <div className="pillars-grid">
            {subserviceItems.map(item => (
              <div key={item.title} className="panel-card">
                <div className="icon-chip">•</div>
                <h3 style={{ marginTop: 14 }}>{item.title}</h3>
                <p style={{ marginTop: 10 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">How we work</span>
            <h2>Four steps to a clear outcome.</h2>
            <p>A lightweight process that keeps the service easy to follow from start to finish.</p>
          </div>

          <div className="timeline-grid">
            {processSteps.map(step => (
              <div key={step.number} className="step-card">
                <div className="step-pill">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-surface">
          <div className="split-grid">
            <div className="split-content">
              <span className="eyebrow">FAQ</span>
              <h2>Questions we hear often.</h2>
              <p>Short answers that help you move forward quickly and with confidence.</p>

              <div className="faq-list" style={{ marginTop: 20 }}>
                {faqItems.map(item => (
                  <details key={item.question} className="faq-item">
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <EnquiryForm
              page={`service:${service.slug}`}
              title={`Request ${service.title}`}
              subtitle="Share your requirements and we will prepare the next step."
              buttonLabel="Send request"
            />
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Need help with a related service too?</h2>
            <p>
              We can connect multiple services into one coordinated plan so your team does not need to manage
              everything separately.
            </p>
            <div className="callout-actions">
              <a href="/#contact" className="btn btn-ghost">
                Talk to Advisory
              </a>
              <a href="/blog" className="btn btn-secondary">
                Read Insights
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export const getStaticPaths = async () => {
  // Pre‑define the service slugs that exist in the site. Add more here if you create new services.
  const slugs = ['consultancy', 'finance', 'education', 'investment', 'real-estate', 'rental-space'];
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params
  // Attempt to load from DB first.
  try {
    const service = await prisma.service.findUnique({ where: { slug } })
    const subservices = await prisma.subservice.findMany({ where: { serviceId: service?.id } })
    if (service) {
      return {
        props: {
          service: JSON.parse(JSON.stringify(service)),
          subservices: JSON.parse(JSON.stringify(subservices)),
        },
        revalidate: 86400, // re‑validate daily
      }
    }
  } catch (e) {
    // DB error – fall back to static data.
  }
  // Fallback data when DB missing or slug not in DB.
  const service = { title: slug.charAt(0).toUpperCase() + slug.slice(1), slug, excerpt: 'Sample service description.' }
  const subservices = fallbackSubservices[slug] || []
  return {
    props: { service, subservices },
    revalidate: 86400,
  }
};
