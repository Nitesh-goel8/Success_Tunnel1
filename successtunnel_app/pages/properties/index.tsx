import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PropertyCard from '../../components/PropertyCard'
import { prisma } from '../../lib/prisma'
import { sampleProperties } from '../../lib/sampleData'

const filterChips = ['All', 'Residential', 'Commercial', 'Mumbai', 'Delhi', 'Bengaluru']

export default function Properties({ properties }: { properties: any[] }) {
  const propertyItems = Array.from(new Map([...(properties || []), ...sampleProperties].map(item => [item.slug, item])).values())

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Property advisory</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Premium spaces for living, working and investing.
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                Explore carefully selected properties and rental opportunities designed to keep the buying experience
                clear and confident.
              </p>
              <div className="hero-actions">
                <a href="#properties-list" className="btn btn-primary">
                  Browse Listings
                </a>
                <a href="/#contact" className="btn btn-secondary">
                  Speak With Us
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Market snapshot</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                A polished property experience with the right level of guidance.
              </h2>
              <p style={{ marginTop: 14 }}>
                We keep the listing experience compact, premium and useful for quick comparison.
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                <div className="mini-card">
                  <strong>Residential</strong>
                  <span>Homes and villas</span>
                </div>
                <div className="mini-card">
                  <strong>Commercial</strong>
                  <span>Offices and retail units</span>
                </div>
                <div className="mini-card">
                  <strong>Rental</strong>
                  <span>Space and lease support</span>
                </div>
                <div className="mini-card">
                  <strong>Support</strong>
                  <span>Shortlist and enquiry help</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="partner-strip">
            <div className="partner-label">Filters</div>
            <div className="property-toolbar">
              {filterChips.map(chip => (
                <span key={chip} className="property-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-band">
          <div className="container stats-grid">
            <div className="stat-card">
              <span>Featured property types</span>
              <strong>03</strong>
            </div>
            <div className="stat-card">
              <span>Key cities</span>
              <strong>04</strong>
            </div>
            <div className="stat-card">
              <span>Listings available</span>
              <strong>04</strong>
            </div>
            <div className="stat-card">
              <span>Support</span>
              <strong>24h</strong>
            </div>
          </div>
        </section>

        <section className="section-surface" id="properties-list">
          <div className="section-heading">
            <span className="eyebrow">Available listings</span>
            <h2>Curated properties and rental spaces.</h2>
            <p>Use this as a starting point for a short conversation about location, budget and fit.</p>
          </div>

          <div className="property-grid">
            {propertyItems.map(property => (
              <PropertyCard key={property.slug} p={property} />
            ))}
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Looking for a specific property type?</h2>
            <p>Send us your requirements and we’ll help you narrow the shortlist quickly.</p>
            <div className="callout-actions">
              <a href="/#contact" className="btn btn-ghost">
                Share Requirements
              </a>
              <a href="/services" className="btn btn-secondary">
                Explore Services
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const properties = await prisma.property.findMany()
    return { props: { properties: JSON.parse(JSON.stringify(properties)) } }
  } catch (error) {
    return { props: { properties: sampleProperties } }
  }
}
