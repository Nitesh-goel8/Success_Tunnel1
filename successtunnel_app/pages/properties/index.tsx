import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PropertyCard from '../../components/PropertyCard'
import { prisma } from '../../lib/prisma'
import { sampleProperties } from '../../lib/sampleData'
import { HiOutlineSearch, HiArrowRight } from 'react-icons/hi'

const TYPES = ['All Types', 'Commercial', 'Residential']
const CITIES = ['All Cities', 'Panipat', 'Gurugram', 'Delhi NCR', 'Chandigarh', 'Mumbai', 'Bengaluru']
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
      <Head>
        <title>Commercial Real Estate &amp; Managed Workspaces — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Explore prime commercial properties, corporate office suites, and flexible workspaces in Panipat, Haryana and major North Indian commercial corridors."
        />
        <link rel="canonical" href="https://successtunnel.in/properties" />
      </Head>

      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
            <div className="editorial-tag" style={{ marginBottom: '20px' }}>
              <span className="editorial-tag-dot" />
              Commercial Assets &amp; Workspaces
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)', margin: '16px auto 24px' }}>
              Commercial Properties &amp; Workspaces.
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.68' }}>
              Strategic retail spaces, corporate executive offices, and managed workspaces in Panipat and prime growth corridors across Haryana and North India.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="container" style={{ paddingBottom: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                  <HiOutlineSearch size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by asset title, location, or property type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '10px', border: '1px solid var(--line)', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Sort:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
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
                      border: '1px solid',
                      borderColor: typeFilter === type ? 'var(--primary)' : 'var(--line)',
                      background: typeFilter === type ? 'var(--primary)' : '#ffffff',
                      color: typeFilter === type ? '#ffffff' : 'var(--muted)',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--line)', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>

              <button
                onClick={resetFilters}
                style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '7px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginLeft: 'auto' }}
              >
                Reset filters
              </button>
            </div>
          </div>
        </section>

        {/* Property Grid */}
        <section className="section-surface" id="properties-list">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.4rem', margin: 0 }}>
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Asset Available' : 'Assets Available'}
              </h2>
              {(search || typeFilter !== 'All Types' || cityFilter !== 'All Cities') && (
                <span className="editorial-tag">
                  <span className="editorial-tag-dot" /> Filtered View
                </span>
              )}
            </div>

            {filteredProperties.length > 0 ? (
              <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
                {filteredProperties.map(property => (
                  <div key={property.slug} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <PropertyCard p={property} />
                    <Link
                      href={`/services/rental-space?property=${encodeURIComponent(property.title)}&amount=${property.price || 1000}`}
                      className="btn btn-primary"
                      style={{
                        padding: '10px',
                        fontSize: '0.88rem',
                        borderRadius: '10px',
                        boxShadow: 'none',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Inquire About This Space &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>No properties found</h3>
                <p>Adjust your search query or city filter to view available opportunities.</p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ marginTop: '16px', padding: '10px 22px' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* In-Person Advisory CTA */}
        <section className="container" style={{ margin: '48px auto' }}>
          <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '20px', padding: '48px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px' }}>
                Seeking Commercial Office Space in Panipat?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.98rem', margin: 0, maxWidth: '600px' }}>
                Visit our chambers at Sudarshan Tower or submit your specific carpet area, power, and lease duration requirements.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700, padding: '12px 24px' }}>
                Submit Requirement &rarr;
              </Link>
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
