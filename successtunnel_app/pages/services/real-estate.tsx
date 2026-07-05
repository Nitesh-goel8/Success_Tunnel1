import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'

const cards = [
  { title: 'Residential Land/House', icon: 'RH', excerpt: 'Homes and plots for owner-occupiers and investors.' },
  { title: 'Commercial Land/Offices', icon: 'CO', excerpt: 'Office and land opportunities for businesses.' },
  { title: 'Shops/Retail', icon: 'SR', excerpt: 'Retail units with strong visibility and demand.' },
  { title: 'Offices/Warehouses', icon: 'OW', excerpt: 'Work and storage spaces for operational needs.' },
]

const steps = [
  { number: '01', title: 'Discover', text: 'We review your location, budget and use case.' },
  { number: '02', title: 'Match', text: 'We shortlist options that fit your requirement.' },
  { number: '03', title: 'Review', text: 'We help with comparison and due diligence.' },
  { number: '04', title: 'Close', text: 'We support the next steps and the final handoff.' },
]

const faqs = [
  { question: 'Do you help with both residential and commercial assets?', answer: 'Yes, both use cases are included in this category.' },
  { question: 'Can you help shortlist based on budget?', answer: 'Yes, budget is a core filter in the property workflow.' },
  { question: 'Is this for purchase or investment?', answer: 'It supports both decision paths depending on the client need.' },
]

export default function RealEstate() {
  return (
    <PageShell
      eyebrow="Real Estate"
      title="Property strategy with clarity."
      description="A premium real-estate category hub covering residential and commercial opportunities."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Real estate category</span>
          <h3>Property options for living, working and investing.</h3>
          <p>Shortlisting made clear and simple.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Type</strong>
              <span>Residential and commercial</span>
            </div>
            <div className="mini-card">
              <strong>Support</strong>
              <span>Shortlist and next steps</span>
            </div>
          </div>
        </div>
      }
    >
      <CategoryHub
        eyebrow="Property services"
        title="Curated property opportunities."
        description="A calm, premium experience for viewing and comparing assets."
        stats={[
          { label: 'Categories', value: '04' },
          { label: 'Cities', value: '04' },
          { label: 'Support', value: 'Viewings' },
          { label: 'Confidence', value: '98%' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Looking for a specific property type?"
        ctaDescription="Tell us your target area and budget and we’ll help with the shortlist."
        formPage="real-estate"
        formTitle="Request property support"
      />
    </PageShell>
  )
}
