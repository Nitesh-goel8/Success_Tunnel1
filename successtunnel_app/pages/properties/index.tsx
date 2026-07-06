import { useState } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PropertyCard from '../../components/PropertyCard'
import { prisma } from '../../lib/prisma'
import { sampleProperties } from '../../lib/sampleData'

const filterChips = ['All', 'Residential', 'Commercial', 'Mumbai', 'Delhi', 'Bengaluru']

export default function Properties({ properties }: { properties: any[] }) {
  const propertyItems = Array.from(new Map([...(properties || []), ...sampleProperties].map(item => [item.slug, item])).values())
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredProperties = propertyItems.filter(p => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Residential') return p.type?.toLowerCase() === 'residential'
    if (activeFilter === 'Commercial') return p.type?.toLowerCase() === 'commercial'
    return p.city?.toLowerCase() === activeFilter.toLowerCase()
  })

  return (
    <div>
      <Nav />
      <main>
        {/* Properties Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>REAL ESTATE</span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
              lineHeight: '1.1', 
              letterSpacing: '-0.04em',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: '20px auto 30px'
            }}>
              Curated Properties &amp; Workspaces
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              Explore handpicked premium commercial office spaces, rental units, and high-value residential properties.
            </p>
          </div>
        </section>

        {/* Filters Toolbar */}
        <section className="container" style={{ paddingBottom: '20px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '16px 24px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Filter Listings</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {filterChips.map(chip => (
                <button 
                  key={chip} 
                  onClick={() => setActiveFilter(chip)}
                  style={{
                    border: '1px solid var(--line)',
                    background: activeFilter === chip ? 'var(--primary)' : 'var(--surface)',
                    color: activeFilter === chip ? '#fff' : 'var(--primary)',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="section-surface" id="properties-list">
          <div className="container">
            <div className="section-header-row">
              <div className="section-header-left">
                <h2>Featured Properties ({filteredProperties.length})</h2>
              </div>
            </div>

            <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {filteredProperties.map(property => (
                <PropertyCard key={property.slug} p={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                No listings found matching the selected filter.
              </div>
            )}
          </div>
        </section>

        {/* Callout */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Looking for a Specific Office space or Property?</h2>
            <div className="cta-actions">
              <Link href="/contact" className="cta-btn-primary">Share Requirements</Link>
              <Link href="/services" className="cta-btn-secondary">Explore Services</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  try {
    const properties = await prisma.property.findMany()
    return {
      props: { properties: JSON.parse(JSON.stringify(properties)) },
      revalidate: 60
    }
  } catch (error) {
    return {
      props: { properties: sampleProperties },
      revalidate: 60
    }
  }
}
