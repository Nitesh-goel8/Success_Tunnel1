import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'

const cards = [
  { title: 'Mutual Funds & SIPs', icon: 'MF', excerpt: 'Long-term wealth creation with disciplined investing.' },
  { title: 'LIC / Term Insurance', icon: 'LI', excerpt: 'Protection-focused planning for families and heirs.' },
  { title: 'ULIPs', icon: 'UL', excerpt: 'Investment-linked protection with flexible features.' },
  { title: 'Shares (Equity)', icon: 'EQ', excerpt: 'Support for equity-focused investing decisions.' },
  { title: 'Real Estate Inv.', icon: 'RI', excerpt: 'Property-aligned investment planning and review.' },
]

const steps = [
  { number: '01', title: 'Review', text: 'We understand your current portfolio or objective.' },
  { number: '02', title: 'Strategize', text: 'We outline a cleaner allocation or product path.' },
  { number: '03', title: 'Execute', text: 'We help you move forward with confidence.' },
  { number: '04', title: 'Optimize', text: 'We remain available for ongoing follow-up support.' },
]

const faqs = [
  { question: 'Do you support both protection and growth products?', answer: 'Yes, the category includes both styles of financial products.' },
  { question: 'Can I compare SIPs and insurance products?', answer: 'Yes, this page is structured to make those conversations easier.' },
  { question: 'Is property investment part of this category?', answer: 'Yes, real-estate-linked investment support is included.' },
]

export default function Investment() {
  return (
    <PageShell
      eyebrow="Investment"
      title="Investment framework."
      description="A structured hub for growth, protection and long-term planning."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Investment category</span>
          <h3>Methodical planning for capital growth and protection.</h3>
          <p>Use this page to explain the investment offering clearly.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Focus</strong>
              <span>Growth, protection and planning</span>
            </div>
            <div className="mini-card">
              <strong>Support</strong>
              <span>Decision guidance and follow-up</span>
            </div>
          </div>
        </div>
      }
    >
      <CategoryHub
        eyebrow="Investment services"
        title="Investment options for different goals."
        description="A refined investment section that makes product discovery simple."
        stats={[
          { label: 'Products', value: '05' },
          { label: 'Response time', value: '24h' },
          { label: 'Approach', value: 'Advisory' },
          { label: 'Confidence', value: '98%' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Need help choosing the right investment path?"
        ctaDescription="We can help compare products and align them to your goals."
        formPage="investment"
        formTitle="Request investment support"
      />
    </PageShell>
  )
}
