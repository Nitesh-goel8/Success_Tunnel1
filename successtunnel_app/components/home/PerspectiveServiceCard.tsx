import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

interface PerspectiveServiceCardProps {
  title: string
  slug: string
  icon: React.ReactNode
  excerpt: string
  accentColor: string
  pillarNumber: string
  keyTags: string[]
}

export default function PerspectiveServiceCard({
  title,
  slug,
  icon,
  excerpt,
  accentColor,
  pillarNumber,
  keyTags,
}: PerspectiveServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotX = ((y - centerY) / centerY) * -6 // max tilt 6 deg
    const rotY = ((x - centerX) / centerX) * 6
    setRotateX(rotX)
    setRotateY(rotY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        height: '100%',
      }}
    >
      <div
        className="perspective-card-inner"
        style={{
          transform: isHovered ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)` : 'none',
          transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.25s ease' : 'transform 0.4s ease-out, box-shadow 0.4s ease',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(9, 13, 22, 0.95) 100%)',
          border: isHovered ? `1px solid ${accentColor}88` : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '32px 28px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isHovered ? `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${accentColor}25` : '0 8px 24px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Glow Accent Circle */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: accentColor,
            opacity: isHovered ? 0.2 : 0.08,
            filter: 'blur(30px)',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header: Icon & Pillar Number */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${accentColor}22, rgba(15, 23, 42, 0.8))`,
                border: `1px solid ${accentColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accentColor,
              }}
            >
              {icon}
            </div>

            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.25)',
                fontFamily: "'Sora', sans-serif",
                letterSpacing: '0.05em',
              }}
            >
              {pillarNumber}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '12px',
              fontFamily: "'Sora', sans-serif",
              lineHeight: '1.25',
            }}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.94rem',
              lineHeight: '1.65',
              marginBottom: '20px',
            }}
          >
            {excerpt}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            {keyTags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
              gap: '8px',
              color: accentColor,
              fontWeight: 700,
              fontSize: '0.92rem',
              textDecoration: 'none',
              transition: 'gap 0.2s ease',
            }}
          >
            <span>Explore Practice</span>
            <HiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
