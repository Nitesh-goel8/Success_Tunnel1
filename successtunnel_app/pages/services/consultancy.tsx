import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'

const cards = [
  { title: 'Income Tax', icon: 'IT', excerpt: 'Compliance, planning and filing support for individuals and businesses.' },
  { title: 'GST Compliance', icon: 'GS', excerpt: 'Registration, return filing and audit support in one structured workflow.' },
  { title: 'MSME Registration', icon: 'MS', excerpt: 'Focused guidance for small and medium enterprises.' },
  { title: 'Trademark', icon: 'TM', excerpt: 'Protect your brand with registration and monitoring support.' },
  { title: 'Company Services', icon: 'CP', excerpt: 'Incorporation, filings and governance support.' },
  { title: 'NPO / Trust', icon: 'NT', excerpt: 'Setup and compliance for purpose-driven organizations.' },
]

const steps = [
  {
    number: '01',
    title: 'Discovery Session',
    text: 'We learn about your structure, current challenges and the service outcomes you want to achieve.',
  },
  {
    number: '02',
    title: 'Strategic Mapping',
    text: 'We identify the right path, required documents and the best sequence for execution.',
  },
  {
    number: '03',
    title: 'Execution Phase',
    text: 'Our team handles the work with discipline, accuracy and transparent communication.',
  },
  {
    number: '04',
    title: 'Operational Handover',
    text: 'We close the loop with support, follow-up and next-step guidance if needed.',
  },
]

const faqs = [
  {
    question: 'What is the typical turnaround for MSME Registration?',
    answer: 'Timing depends on document readiness, but we keep the process clear and well coordinated from the start.',
  },
  {
    question: 'Do you provide ongoing GST audit support?',
    answer: 'Yes. We can support filing, review cycles and follow-up work after the initial setup.',
  },
  {
    question: 'Can you help with trademark filing and monitoring?',
    answer: 'Absolutely. We can manage filing and provide practical guidance for brand protection.',
  },
]

export default function Consultancy() {
  return (
    <PageShell
      eyebrow="Consultancy"
      title="Precision in taxation and registration."
      description="We help founders and business owners move from uncertainty to clarity with a structured, premium consultancy experience."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Consultancy framework</span>
          <h3>Built for high-trust advisory and disciplined execution.</h3>
          <p>From registrations to ongoing compliance, every step stays visible and organized.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Tax</strong>
              <span>Planning and filing support</span>
            </div>
            <div className="mini-card">
              <strong>Setup</strong>
              <span>Company and MSME registration</span>
            </div>
            <div className="mini-card">
              <strong>Brand</strong>
              <span>Trademark filing and protection</span>
            </div>
            <div className="mini-card">
              <strong>Trust</strong>
              <span>NPO and trust compliance</span>
            </div>
          </div>
        </div>
      }
    >
      <CategoryHub
        eyebrow="Core consultancy pillars"
        title="All the support you need in one advisory flow."
        description="The service list below matches the reference experience and gives you the full set of consultancy sections."
        stats={[
          { label: 'Focused service lines', value: '06' },
          { label: 'Average response', value: '24h' },
          { label: 'Execution clarity', value: '01' },
          { label: 'Confidence', value: '98%' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Ready to begin your consultancy project?"
        ctaDescription="Start with a quick enquiry and we’ll guide you to the most suitable next step."
        formPage="consultancy"
        formTitle="Speak with our consultancy team"
      />
    </PageShell>
  )
}

