import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'
import RentalPaymentButton from '../../components/RentalPaymentButton'

const cards = [
  { title: 'Houses/Flats/PG', icon: 'HP', excerpt: 'Residential rental space for different budgets and needs.' },
  { title: 'Offices/Warehouses', icon: 'OW', excerpt: 'Commercial rental options for operations and storage.' },
  { title: 'Shops/Retail', icon: 'SR', excerpt: 'Street-facing retail rental spaces.' },
  { title: 'Commercial Space', icon: 'CS', excerpt: 'Broader rental-space support for businesses.' },
]

const steps = [
  { number: '01', title: 'Define', text: 'We capture the space type, city and budget.' },
  { number: '02', title: 'Search', text: 'We shortlist available spaces that fit the criteria.' },
  { number: '03', title: 'Tour', text: 'We support viewings and comparisons.' },
  { number: '04', title: 'Finalize', text: 'We help with the next steps toward occupancy.' },
]

const faqs = [
  { question: 'Can you help with residential rentals?', answer: 'Yes, houses, flats and PG options are part of this category.' },
  { question: 'Do you also handle commercial spaces?', answer: 'Yes, offices, warehouses and retail units are included.' },
  { question: 'Can I send my requirements online?', answer: 'Yes, the enquiry form is ready to capture the need.' },
]

export default function RentalSpace() {
  return (
    <PageShell
      eyebrow="Rental Space"
      title="Space solutions for every need."
      description="A dedicated rental hub for residential and commercial space support."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Rental category</span>
          <h3>Commercial and residential rental options in one place.</h3>
          <p>Designed to make space discovery and enquiry simple.</p>
          <div className="hero-board-grid" style={{ marginBottom: '24px' }}>
            <div className="mini-card">
              <strong>Usage</strong>
              <span>Homes, offices and retail</span>
            </div>
            <div className="mini-card">
              <strong>Action</strong>
              <span>Send your rental requirements</span>
            </div>
          </div>
          <RentalPaymentButton rentalTitle="Premium Corporate/Residential Rental Space" defaultAmount={1000} />
        </div>
      }
    >
      <CategoryHub
        eyebrow="Rental services"
        title="Rental spaces that fit your requirements."
        description="A premium space-finding experience for property seekers."
        stats={[
          { label: 'Space types', value: '04' },
          { label: 'Cities', value: '04' },
          { label: 'Support', value: 'Viewings' },
          { label: 'Speed', value: '24h' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Need help finding the right space?"
        ctaDescription="Share the location and budget and we’ll guide the search."
        formPage="rental-space"
        formTitle="Request rental support"
      />
    </PageShell>
  )
}
