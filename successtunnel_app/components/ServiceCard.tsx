import Link from 'next/link'

export default function ServiceCard({
  service,
  href,
}: {
  service: { id: number; title: string; slug: string; excerpt?: string; icon?: string }
  href?: string
}) {
  const iconText = service.icon || service.title.split(' ').map(part => part[0]).slice(0, 2).join('')
  const targetHref = href || `/services/${service.slug}`

  return (
    <Link href={targetHref} className="service-card" aria-label={`View ${service.title}`}>
      <div className="service-card-icon">{iconText}</div>
      <div className="service-card-kicker">Specialized service</div>
      <h3>{service.title}</h3>
      <p>{service.excerpt}</p>
      <span className="service-card-cta">Explore service →</span>
    </Link>
  )
}
