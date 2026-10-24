import React, { useState } from 'react'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

interface PerspectiveServiceCardProps {
  title: string
  slug: string
  icon: React.ReactNode
  excerpt: string
  pillarNumber: string
  keyTags: string[]
}

export default function PerspectiveServiceCard({
  title,
  slug,
  icon,
  excerpt,
  pillarNumber,
  keyTags,
}: PerspectiveServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="editorial-service-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: isHovered
            ? 'linear-gradient(180deg, rgba(20, 30, 55, 0.85) 0%, rgba(11, 18, 33, 0.95) 100%)'
            : 'linear-gradient(180deg, rgba(13, 21, 39, 0.7) 0%, rgba(9, 14, 26, 0.9) 100%)',
          border: isHovered ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: 'clamp(24px, 3vw, 32px)',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered
            ? '0 16px 36px rgba(0, 0, 0, 0.35), 0 0 24px rgba(37, 99, 235, 0.12)'
            : '0 4px 16px rgba(0, 0, 0, 0.15)',
          position: 'relative',
        }}
      >
        <div>
          {/* Card Top: Numbering & Subdued Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(30, 58, 138, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              {icon}
            </div>

            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#64748b',
                fontFamily: "'Sora', sans-serif",
                letterSpacing: '0.08em',
              }}
            >
              {pillarNumber}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginBottom: '10px',
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: '1.3',
            }}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.92rem',
              lineHeight: '1.65',
              marginBottom: '20px',
            }}
          >
            {excerpt}
          </p>

          {/* Clean Neutral Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            {keyTags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Link Action */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
          <Link
            href={`/services/${slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              transition: 'gap 0.2s ease',
            }}
          >
            <span>Practice Scope &amp; Filings</span>
            <HiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
