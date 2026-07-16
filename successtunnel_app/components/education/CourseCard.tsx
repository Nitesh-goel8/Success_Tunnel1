import Link from 'next/link'
import { HiArrowRight, HiClock, HiStar } from 'react-icons/hi'

type CourseCardProps = {
  title: string
  excerpt: string
  slug: string
  thumbnailUrl?: string
  duration?: string
  rating?: number
}

export default function CourseCard({ title, excerpt, slug, thumbnailUrl, duration, rating }: CourseCardProps) {
  return (
    <Link href={`/education/${slug}`} className="service-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div 
        style={{
          width: '100%',
          height: '200px',
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'linear-gradient(135deg, var(--primary), var(--accent))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {duration && (
            <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
              <HiClock /> {duration}
            </span>
          )}
          {rating && (
            <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fbbf24', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
              <HiStar /> {rating}
            </span>
          )}
        </div>
      </div>
      <div style={{ padding: '24px' }}>
        <div className="service-card-kicker">Course</div>
        <h3 style={{ margin: '8px 0', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ margin: '0 0 20px', fontSize: '0.95rem', color: 'var(--muted)' }}>{excerpt}</p>
        <span className="service-card-cta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Enroll Now <HiArrowRight /></span>
      </div>
    </Link>
  )
}
