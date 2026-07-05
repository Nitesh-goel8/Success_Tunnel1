import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'

const cards = [
  { title: 'Home Loan', icon: 'HL', excerpt: 'Guidance for residential purchase financing.' },
  { title: 'Loan Against Property', icon: 'LP', excerpt: 'Access capital through property-backed lending.' },
  { title: 'Working Capital', icon: 'WC', excerpt: 'Support for daily business funding needs.' },
  { title: 'Personal Loan', icon: 'PL', excerpt: 'Short-term financial support planning.' },
  { title: 'OD Limits', icon: 'OD', excerpt: 'Overdraft solutions for liquidity flexibility.' },
  { title: 'Govt Scheme Loans', icon: 'GS', excerpt: 'Scheme-based lending for eligible applicants.' },
]

const steps = [
  { number: '01', title: 'Assess', text: 'We review your funding need, timeline and profile.' },
  { number: '02', title: 'Shortlist', text: 'We help you compare the relevant options.' },
  { number: '03', title: 'Submit', text: 'We organize the required documents and application path.' },
  { number: '04', title: 'Track', text: 'We keep the process moving and support follow-up.' },
]

const faqs = [
  { question: 'Do you help with both personal and business loans?', answer: 'Yes, we can guide both use cases depending on your need.' },
  { question: 'Can you explain eligibility?', answer: 'We’ll help you understand the high-level requirements before you proceed.' },
  { question: 'Do you support property-backed finance?', answer: 'Yes, loan-against-property style support is part of the finance category.' },
]

export default function Finance() {
  return (
    <PageShell
      eyebrow="Finance"
      title="Clear financial support."
      description="A structured finance landing page for lending and planning services."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Finance category</span>
          <h3>Planning, lending and capital support in one place.</h3>
          <p>Use this page to guide users through the finance pathway.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Need</strong>
              <span>Borrowing and funding support</span>
            </div>
            <div className="mini-card">
              <strong>Scope</strong>
              <span>Loan products and advisory</span>
            </div>
          </div>
        </div>
      }
    >
      <CategoryHub
        eyebrow="Finance services"
        title="Finance solutions for households and businesses."
        description="A practical service hub covering loans, working capital and planning support."
        stats={[
          { label: 'Loan types', value: '06' },
          { label: 'Response time', value: '24h' },
          { label: 'Support mode', value: 'Advisory' },
          { label: 'Confidence', value: '98%' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Need help comparing finance options?"
        ctaDescription="Send your requirement and we’ll help narrow the right path."
        formPage="finance"
        formTitle="Request finance support"
      />
    </PageShell>
  )
}
