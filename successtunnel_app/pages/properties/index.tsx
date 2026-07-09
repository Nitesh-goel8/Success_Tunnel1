import { useState, useMemo } from 'react'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PropertyCard from '../../components/PropertyCard'
import { prisma } from '../../lib/prisma'
import { sampleProperties } from '../../lib/sampleData'

const TYPES = ['All Types', 'Residential', 'Commercial']
const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai']
const SORTS = ['Newest', 'Price: Low to High', 'Price: High to Low']

export default function Properties({ properties }: { properties: any[] }) {
  const propertyItems = Array.from(
    new Map(
      [...(properties || []), ...sampleProperties].map(item => [item.slug, item])
    ).values()
  )

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [sortBy, setSortBy] = useState('Newest')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(100000000)

  const maxPropertyPrice = Math.max(...propertyItems.map(p => p.price || 0), 100000000)

  const filteredProperties = useMemo(() => {
    let results = propertyItems.filter(p => {
      const matchSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase()) ||
        p.type?.toLowerCase().includes(search.toLowerCase())

      const matchType =
        typeFilter === 'All Types' ||
        p.type?.toLowerCase() === typeFilter.toLowerCase()

      const matchCity =
        cityFilter === 'All Cities' ||
        p.city?.toLowerCase() === cityFilter.toLowerCase()

      const matchPrice = (p.price || 0) >= priceMin && (p.price || 0) <= priceMax

      return matchSearch && matchType && matchCity && matchPrice
    })

    if (sortBy === 'Price: Low to High') results = results.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === 'Price: High to Low') results = results.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === 'Newest') results = results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

    return results
  }, [search, typeFilter, cityFilter, sortBy, priceMin, priceMax, propertyItems])

  const resetFilters = () => {
    setSearch('')
    setTypeFilter('All Types')
    setCityFilter('All Cities')
    setSortBy('Newest')
    setPriceMin(0)
    setPriceMax(maxPropertyPrice)
  }

  return (
    <div>
      <Nav />
      <main>
        {/* Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '50px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>
              REAL ESTATE &amp; SPACES
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: 800, color: 'var(--primary)', margin: '20px auto 24px' }}>
              Curated Properties &amp; Workspaces
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              Explore handpicked premium commercial offices, rental units, and high-value residential properties.
            </p>
          </div>
        </section>

        {/* Search + Filter + Sort Toolbar */}
        <section className="container" style={{ paddingBottom: '24px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '24px', border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Top Row: Search + Sort */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search input */}
              <div style={{ position: 'relative', maxWidth: '520px', width: '100%' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '1.1rem' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, city, or type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                />
              </div>

              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}
                >
                  {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Bottom Row: Type + City filters + Price range + Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Type filter chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    style={{
                      border: '1px solid var(--line)',
                      background: typeFilter === t ? 'var(--primary)' : 'transparent',
                      color: typeFilter === t ? '#fff' : 'var(--primary)',
                      padding: '7px 16px',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* City selector */}
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Reset */}
              <button
                onClick={resetFilters}
                style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '7px 16px', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto' }}
              >
                ✕ Reset
              </button>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="section-surface" id="properties-list">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.4rem', margin: 0 }}>
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} found
              </h2>
              {(search || typeFilter !== 'All Types' || cityFilter !== 'All Cities') && (
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', padding: '6px 14px', background: 'rgba(22,93,245,0.06)', border: '1px solid rgba(22,93,245,0.12)', borderRadius: '999px', fontWeight: 600 }}>
                  Showing filtered results
                </span>
              )}
            </div>

            {filteredProperties.length > 0 ? (
              <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {filteredProperties.map(property => (
                  <div key={property.slug} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PropertyCard p={property} />
                    {/* Direct Booking CTA */}
                    <Link
                      href={`/services/rental-space?property=${encodeURIComponent(property.title)}&amount=${property.price || 1000}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #0b3a86, #165df5)',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        boxShadow: '0 6px 16px rgba(22,93,245,0.15)',
                      }}
                    >
                      Book This Space →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No properties found</h3>
                <p>Try adjusting your search or filters to find matching results.</p>
                <button onClick={resetFilters} style={{ marginTop: '16px', background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Callout Banner */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Looking for a Specific Office Space or Property?</h2>
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
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: { properties: sampleProperties },
      revalidate: 60,
    }
  }
}
