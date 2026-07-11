import Link from 'next/link'
import { useEffect, useState } from 'react'

export type EducationVideoPromoData = {
  slug: string
  title: string
  excerpt?: string | null
  thumbnailUrl?: string | null
  category?: string | null
  contentType?: string | null
}

export default function EducationVideoPromo({ video }: { video: EducationVideoPromoData | null }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!video) return

    const todayKey = `st_education_promo_seen_${new Date().toISOString().slice(0, 10)}`
    if (window.localStorage.getItem(todayKey)) return

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(todayKey, '1')
      setOpen(true)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [video])

  if (!video || !open) return null

  const close = () => {
    const todayKey = `st_education_promo_seen_${new Date().toISOString().slice(0, 10)}`
    window.localStorage.setItem(todayKey, '1')
    setOpen(false)
  }

  return (
    <div className="education-promo-backdrop" role="dialog" aria-modal="true" aria-label="Featured education content">
      <div className="education-promo-card">
        <button type="button" className="education-promo-close" onClick={close} aria-label="Close popup">
          x
        </button>
        <div className="education-promo-thumb" style={video.thumbnailUrl ? { backgroundImage: `url(${video.thumbnailUrl})` } : undefined}>
          {!video.thumbnailUrl && <span>{video.contentType || 'Item'}</span>}
        </div>
        <div className="education-promo-content">
          <span className="education-promo-kicker">{video.contentType || video.category || 'Education'}</span>
          <h3>{video.title}</h3>
          <p>{video.excerpt || 'New educational content is now available.'}</p>
          <div className="education-promo-actions">
            <Link href={`/education/${video.slug}`} onClick={close} className="btn btn-primary" style={{ padding: '10px 16px' }}>
              Open now
            </Link>
            <button type="button" onClick={close} className="btn btn-secondary" style={{ padding: '10px 16px' }}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .education-promo-backdrop {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 1200;
        }
        .education-promo-card {
          width: min(380px, calc(100vw - 40px));
          display: grid;
          grid-template-columns: 92px 1fr;
          gap: 14px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.18);
          padding: 14px;
          position: relative;
          overflow: hidden;
        }
        .education-promo-close {
          position: absolute;
          top: 8px;
          right: 10px;
          border: 0;
          background: transparent;
          color: var(--muted);
          font-size: 26px;
          cursor: pointer;
          line-height: 1;
        }
        .education-promo-thumb {
          border-radius: 14px;
          background: linear-gradient(135deg, #0b3a86, #165df5);
          background-size: cover;
          background-position: center;
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
        }
        .education-promo-content h3 {
          margin: 6px 0 6px;
          font-size: 1.02rem;
          line-height: 1.25;
        }
        .education-promo-content p {
          margin: 0 0 12px;
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .education-promo-kicker {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
        }
        .education-promo-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        @media (max-width: 520px) {
          .education-promo-backdrop {
            right: 12px;
            left: 12px;
            bottom: 12px;
          }
          .education-promo-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
