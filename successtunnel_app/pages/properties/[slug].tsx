import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import EnquiryForm from '../../components/EnquiryForm'
import { prisma } from '../../lib/prisma'
import { sampleProperties } from '../../lib/sampleData'

export default function PropertyDetail({ property }: { property: any }) {
  if (!property) return <div>Not found</div>

  const facts = [
    property.area ? { label: 'Area', value: property.area } : null,
    property.bedrooms !== undefined && property.bedrooms !== null ? { label: 'Bedrooms', value: String(property.bedrooms) } : null,
    property.bathrooms !== undefined && property.bathrooms !== null ? { label: 'Bathrooms', value: String(property.bathrooms) } : null,
    property.type ? { label: 'Type', value: property.type } : null,
  ].filter(Boolean)

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">{property.city || 'Property'}</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                {property.title}
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                {property.description || 'A premium listing with strong value and practical potential.'}
              </p>
              <div className="hero-actions">
                <a href="#enquiry" className="btn btn-primary">
                  Enquire Now
                </a>
                <a href="/properties" className="btn btn-secondary">
                  Back to Listings
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Price</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                ₹{property.price.toLocaleString('en-IN')}
              </h2>
              <p style={{ marginTop: 14 }}>
                {property.type || 'Property'} in {property.city}
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                {facts.map((fact: any) => (
                  <div key={fact.label} className="mini-card">
                    <strong>{fact.label}</strong>
                    <span>{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="split-grid">
            <div className="split-content">
              <span className="eyebrow">Property overview</span>
              <h2>Clean details, simple comparison and direct next steps.</h2>
              <p>
                This page is designed to help you review the listing quickly and then move to a conversation when you
                are ready.
              </p>
              <ul className="bullet-list">
                <li>Easy to scan listing summary</li>
                <li>Clear facts for shortlist comparison</li>
                <li>Fast enquiry path with direct contact support</li>
              </ul>
            </div>

            <div className="panel-card" id="enquiry">
              <div className="service-card-kicker">Enquiry</div>
              <h3 style={{ marginTop: 12 }}>Request a viewing or property discussion</h3>
              <p style={{ marginTop: 10 }}>
                Send your interest and we’ll help you move to the next step.
              </p>
              <div style={{ marginTop: 18 }}>
                <EnquiryForm
                  page={`property:${property.slug}`}
                  title="Speak with our property team"
                  subtitle="Share your budget and timeline and we’ll respond with a useful next step."
                  buttonLabel="Send enquiry"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">More options</span>
            <h2>Browse other listings</h2>
          </div>

          <div className="property-grid">
            {sampleProperties
              .filter(item => item.slug !== property.slug)
              .slice(0, 3)
              .map(item => (
                <Link key={item.slug} href={`/properties/${item.slug}`} className="property-card">
                  <div className="property-top">
                    <div>
                      <div className="property-meta">{item.type}</div>
                      <h3>{item.title}</h3>
                      <p>{item.city}</p>
                    </div>
                    <div className="price">₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                  <p>{item.description}</p>
                  <div className="property-facts">
                    {item.area && <span>{item.area}</span>}
                    {typeof item.bedrooms === 'number' && <span>{item.bedrooms} bed</span>}
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps(ctx: any) {
  const { slug } = ctx.params

  try {
    const property = await prisma.property.findUnique({ where: { slug } })
    return { props: { property: property ? JSON.parse(JSON.stringify(property)) : null } }
  } catch (error) {
    return { props: { property: sampleProperties.find(item => item.slug === slug) || sampleProperties[0] } }
  }
}
