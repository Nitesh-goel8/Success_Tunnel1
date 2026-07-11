import { useMemo, useState } from 'react'
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
  const propertyItems = useMemo(
    () => Array.from(new Map([...(properties || []), ...sampleProperties].map(item => [item.slug, item])).values()),
    [properties]
  )

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [sortBy, setSortBy] = useState('Newest')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(100000000)

  const maxPropertyPrice = Math.max(...propertyItems.map(property => property.price || 0), 100000000)

  const filteredProperties = useMemo(() => {
    let results = propertyItems.filter(property => {
      const matchSearch =
        !search ||
        property.title?.toLowerCase().includes(search.toLowerCase()) ||
        property.city?.toLowerCase().includes(search.toLowerCase()) ||
        property.type?.toLowerCase().includes(search.toLowerCase())

      const matchType =
        typeFilter === 'All Types' ||
        property.type?.toLowerCase() === typeFilter.toLowerCase()

      const matchCity =
        cityFilter === 'All Cities' ||
        property.city?.toLowerCase() === cityFilter.toLowerCase()

      const matchPrice = (property.price || 0) >= priceMin && (property.price || 0) <= priceMax
      return matchSearch && matchType && matchCity && matchPrice
    })

    if (sortBy === 'Price: Low to High') results = results.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === 'Price: High to Low') results = results.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === 'Newest') {
      results = results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }

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
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '44px' }}>
          <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>
              REAL ESTATE & SPACES
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', lineHeight: '1.08', letterSpacing: '-0.04em', fontWeight: 800, color: 'var(--primary)', margin: '20px auto 24px' }}>
              Curated properties and workspaces.
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Explore commercial offices, rental units, and residential opportunities with simple filtering and direct enquiry support.
            </p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: '24px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '24px', border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', maxWidth: '520px', width: '100%' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '1.1rem' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, city, or type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid var(--line)', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer' }}
                >
                  {SORTS.map(sort => <option key={sort} value={sort}>{sort}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    style={{
                      border: '1px solid var(--line)',
                      background: typeFilter === type ? 'var(--primary)' : 'transparent',
                      color: typeFilter === type ? '#fff' : 'var(--primary)',
                      padding: '7px 16px',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>

              <button
                onClick={resetFilters}
                style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '7px 16px', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginLeft: 'auto' }}
              >
                Reset filters
              </button>
            </div>
          </div>
        </section>

        <section className="section-surface" id="properties-list">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.4rem', margin: 0 }}>
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} found
              </h2>
              {(search || typeFilter !== 'All Types' || cityFilter !== 'All Cities') && (
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', padding: '6px 14px', background: 'rgba(22,93,245,0.06)', border: '1px solid rgba(22,93,245,0.12)', borderRadius: '999px', fontWeight: 600 }}>
                  Filtered results
                </span>
              )}
            </div>

            {filteredProperties.length > 0 ? (
              <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                {filteredProperties.map(property => (
                  <div key={property.slug} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PropertyCard p={property} />
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
                      }}
                    >
                      Book this space →
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
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="container">
          <div className="cta-banner-container">
            <h2>Looking for a specific office space or property?</h2>
            <div className="cta-actions">
              <Link href="/contact" className="cta-btn-primary">Share requirements</Link>
              <Link href="/services" className="cta-btn-secondary">Explore services</Link>
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
  } catch {
    return {
      props: { properties: sampleProperties },
      revalidate: 60,
    }
  }
}
