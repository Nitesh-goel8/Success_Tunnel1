import Link from 'next/link'

export default function PropertyCard({
  p,
}: {
  p: {
    id: number
    title: string
    slug: string
    city: string
    price: number
    type?: string
    area?: string
    bedrooms?: number
    bathrooms?: number
    description?: string
  }
}) {
  const price = `₹${p.price.toLocaleString('en-IN')}`

  return (
    <Link href={`/properties/${p.slug}`} className="property-card">
      <div className="property-top">
        <div>
          <div className="property-meta">{p.type || 'Property'}</div>
          <h3>{p.title}</h3>
          <p>{p.city}</p>
        </div>
        <div className="price">{price}</div>
      </div>

      <p>{p.description || 'Premium property opportunity with strong long-term value potential.'}</p>

      <div className="property-facts">
        {p.area && <span>{p.area}</span>}
        {typeof p.bedrooms === 'number' && <span>{p.bedrooms} bed</span>}
        {typeof p.bathrooms === 'number' && <span>{p.bathrooms} bath</span>}
      </div>

      <span className="service-card-cta">View details →</span>
    </Link>
  )
}
