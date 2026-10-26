import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  HiShieldCheck,
  HiGlobeAlt,
  HiOfficeBuilding,
  HiArrowRight,
  HiChartBar,
  HiAcademicCap,
  HiKey,
  HiTrendingUp,
  HiSparkles,
  HiPlay,
  HiPause,
  HiSun,
  HiMoon,
  HiCursorClick,
} from 'react-icons/hi'
import { campusTowersData } from './3d/ArchitecturalHeroExperience3D'

// Dynamically import the 3D Experience on client side only
const ArchitecturalHeroExperience3D = dynamic(
  () => import('./3d/ArchitecturalHeroExperience3D'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 50%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 0 32px rgba(56, 189, 248, 0.4)',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite',
          }}
        >
          ST
        </div>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.04em', color: '#93c5fd', margin: 0 }}>
          Initializing 3D Architectural Spatial Campus...
        </p>
      </div>
    ),
  }
)

export default function ArchitecturalPortfolioHero() {
  const [activeTower, setActiveTower] = useState(0)
  const [isTwilight, setIsTwilight] = useState(true)
  const [autoTour, setAutoTour] = useState(true)
  const [animatingText, setAnimatingText] = useState(false)

  const currentTower = campusTowersData[activeTower] || campusTowersData[0]

  const handleSelectTower = (index: number) => {
    if (index === activeTower) return
    setAnimatingText(true)
    setTimeout(() => {
      setActiveTower(index)
      setAnimatingText(false)
    }, 150)
  }

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        height: '92vh',
        maxHeight: '940px',
        overflow: 'hidden',
        background: isTwilight ? '#050814' : '#f8fafc',
        color: isTwilight ? '#f8fafc' : '#1d1d1f',
        transition: 'background 0.6s ease',
      }}
    >
      {/* 1. Full-Bleed 3D WebGL Canvas Layer */}
      <ArchitecturalHeroExperience3D
        activeTowerIndex={activeTower}
        onSelectTower={handleSelectTower}
        isTwilightMode={isTwilight}
        autoTourEnabled={autoTour}
        onToggleAutoTour={() => setAutoTour(!autoTour)}
        onToggleLighting={() => setIsTwilight(!isTwilight)}
      />

      {/* 2. Subtle Vignette & Gradient Overlays for Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isTwilight
            ? 'radial-gradient(circle at 25% 45%, rgba(5, 8, 20, 0.82) 0%, rgba(5, 8, 20, 0.4) 55%, rgba(5, 8, 20, 0.75) 100%)'
            : 'radial-gradient(circle at 25% 45%, rgba(248, 250, 252, 0.88) 0%, rgba(248, 250, 252, 0.35) 55%, rgba(248, 250, 252, 0.8) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'background 0.6s ease',
        }}
      />

      {/* 3. Floating Interactive HUD & Camera Controls */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 15,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Auto Tour Toggle */}
        <button
          type="button"
          onClick={() => setAutoTour(!autoTour)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '999px',
            background: isTwilight ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
            border: isTwilight ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(16px)',
            color: autoTour ? '#38bdf8' : (isTwilight ? '#94a3b8' : '#64748b'),
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          }}
          title={autoTour ? 'Pause Cinematic Auto-Tour' : 'Resume Cinematic Auto-Tour'}
        >
          {autoTour ? <HiPause size={14} /> : <HiPlay size={14} />}
          <span>{autoTour ? 'Auto Tour: ON' : 'Auto Tour: OFF'}</span>
        </button>

        {/* Lighting Toggle (Twilight / Daylight) */}
        <button
          type="button"
          onClick={() => setIsTwilight(!isTwilight)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '999px',
            background: isTwilight ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
            border: isTwilight ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(16px)',
            color: isTwilight ? '#fbbf24' : '#0284c7',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          }}
          title="Toggle Twilight / Studio Day Lighting"
        >
          {isTwilight ? <HiMoon size={14} /> : <HiSun size={14} />}
          <span>{isTwilight ? 'Twilight Lux' : 'Studio Day'}</span>
        </button>

        {/* Orbit Drag Tip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '999px',
            background: isTwilight ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
            border: isTwilight ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            fontSize: '0.72rem',
            color: isTwilight ? '#94a3b8' : '#64748b',
            fontWeight: 500,
          }}
        >
          <HiCursorClick size={13} />
          <span>Drag to Orbit 360°</span>
        </div>
      </div>

      {/* 4. Synchronized Foreground Editorial Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '48px',
          paddingBottom: '32px',
          pointerEvents: 'none',
        }}
      >
        {/* Top Editorial Section */}
        <div style={{ maxWidth: '640px', pointerEvents: 'auto' }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: isTwilight ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.08)',
              border: isTwilight ? '1px solid rgba(96, 165, 250, 0.35)' : '1px solid rgba(37, 99, 235, 0.2)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isTwilight ? '#93c5fd' : '#1d4ed8',
              marginBottom: '18px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 10px #38bdf8',
                display: 'inline-block',
              }}
            />
            Success Tunnel &bull; 3D Spatial Architecture Campus
          </div>

          {/* Master Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
              lineHeight: '1.08',
              letterSpacing: '-0.035em',
              fontWeight: 900,
              margin: '0 0 16px 0',
              color: isTwilight ? '#ffffff' : '#0f172a',
              textShadow: isTwilight ? '0 4px 24px rgba(0, 0, 0, 0.5)' : 'none',
            }}
          >
            Strategic Clarity.<br />
            <span
              style={{
                background: isTwilight
                  ? 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Architectural Execution.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.98rem, 1.35vw, 1.15rem)',
              lineHeight: '1.6',
              color: isTwilight ? '#cbd5e1' : '#475569',
              margin: '0 0 24px 0',
              maxWidth: '560px',
              fontWeight: 400,
              textShadow: isTwilight ? '0 2px 12px rgba(0, 0, 0, 0.6)' : 'none',
            }}
          >
            A multi-tower corporate ecosystem unifying statutory corporate governance, institutional debt syndication, and prime commercial real estate under one unified practice.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
            <a
              href="#contact"
              className="btn btn-primary"
              style={{
                padding: '12px 26px',
                fontSize: '0.925rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              }}
            >
              Schedule Private Consultation &rarr;
            </a>

            <a
              href="#services"
              className="btn btn-secondary"
              style={{
                padding: '12px 22px',
                fontSize: '0.925rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: isTwilight ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)',
                color: isTwilight ? '#ffffff' : '#0f172a',
                border: isTwilight ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                backdropFilter: 'blur(12px)',
              }}
            >
              Explore Disciplines
            </a>

            <Link
              href="/portal/dashboard"
              style={{
                padding: '12px 18px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: isTwilight ? '#38bdf8' : '#2563eb',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>ERP Staff Portal</span>
              <HiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 5. Synchronized Active Tower Interactive Showcase Card */}
        <div
          style={{
            maxWidth: '680px',
            pointerEvents: 'auto',
            background: isTwilight ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
            border: isTwilight ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '20px',
            padding: '20px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: isTwilight
              ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.1)'
              : '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 20px rgba(37, 99, 235, 0.06)',
            transition: 'all 0.3s ease',
            opacity: animatingText ? 0.4 : 1,
            transform: animatingText ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          {/* Tower Header & Code */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  background: isTwilight ? '#1e3a8a' : '#eff6ff',
                  color: isTwilight ? '#93c5fd' : '#1d4ed8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                }}
              >
                {currentTower.code}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                Spatial Focus Active
              </span>
            </div>

            {/* KPI Badge */}
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: isTwilight ? '#38bdf8' : '#0284c7',
                background: isTwilight ? 'rgba(56, 189, 248, 0.1)' : '#f0f9ff',
                padding: '3px 10px',
                borderRadius: '999px',
                border: isTwilight ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #bae6fd',
              }}
            >
              {currentTower.keyStat} &bull; {currentTower.statLabel}
            </div>
          </div>

          {/* Tower Name & Tagline */}
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: '0 0 4px 0',
              color: isTwilight ? '#ffffff' : '#0f172a',
            }}
          >
            {currentTower.name} — <span style={{ color: isTwilight ? '#93c5fd' : '#2563eb' }}>{currentTower.discipline}</span>
          </h3>

          <p
            style={{
              fontSize: '0.85rem',
              lineHeight: '1.5',
              color: isTwilight ? '#cbd5e1' : '#64748b',
              margin: '0 0 14px 0',
            }}
          >
            {currentTower.description}
          </p>

          {/* Interactive Tower Switching Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))',
              gap: '6px',
              paddingTop: '12px',
              borderTop: isTwilight ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
            }}
          >
            {campusTowersData.map((tower, idx) => {
              const isSelected = activeTower === idx
              return (
                <button
                  key={tower.id}
                  type="button"
                  onClick={() => handleSelectTower(idx)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isSelected
                      ? '#38bdf8'
                      : (isTwilight ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'),
                    background: isSelected
                      ? (isTwilight ? '#1e3a8a' : '#eff6ff')
                      : (isTwilight ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc'),
                    color: isSelected
                      ? (isTwilight ? '#ffffff' : '#1d4ed8')
                      : (isTwilight ? '#94a3b8' : '#64748b'),
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.15s ease',
                  }}
                  title={tower.name}
                >
                  {tower.code}: {tower.name.split(' ')[0]}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
