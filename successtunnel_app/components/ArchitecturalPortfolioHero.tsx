import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  HiShieldCheck,
  HiArrowRight,
  HiBriefcase,
  HiChartBar,
  HiAcademicCap,
  HiKey,
  HiTrendingUp,
  HiOfficeBuilding,
  HiSparkles,
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
          width: '100%',
          height: '100%',
          minHeight: '480px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0071e3, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 8px 24px rgba(0, 113, 227, 0.25)',
            marginBottom: '1rem',
          }}
        >
          ST
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0071e3', margin: 0 }}>
          Rendering 3D Architectural Spatial Campus...
        </p>
      </div>
    ),
  }
)

const practicePillIcons = [
  <HiBriefcase key="0" size={15} />,
  <HiChartBar key="1" size={15} />,
  <HiOfficeBuilding key="2" size={15} />,
  <HiKey key="3" size={15} />,
  <HiTrendingUp key="4" size={15} />,
  <HiAcademicCap key="5" size={15} />,
]

export default function ArchitecturalPortfolioHero() {
  const [activeTower, setActiveTower] = useState(0)
  const currentTower = campusTowersData[activeTower] || campusTowersData[0]

  const handleSelectTower = (index: number) => {
    setActiveTower(index)
  }

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        padding: '40px 0 32px 0',
        background: 'radial-gradient(120% 90% at 75% 25%, rgba(0, 113, 227, 0.07) 0%, rgba(251, 251, 253, 0.5) 60%, #fbfbfd 100%), #fbfbfd',
        borderBottom: '1px solid #e5e5ea',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Main 2-Column Split Hero */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            minHeight: '520px',
          }}
        >
          {/* Left Column: Authoritative Editorial & Strategic Vision */}
          <div style={{ maxWidth: '600px' }}>
            {/* Eyebrow Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#0071e3',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#0071e3',
                  boxShadow: '0 0 8px #0071e3',
                  display: 'inline-block',
                }}
              />
              Institutional Corporate Advisory &bull; Panipat Chambers
            </div>

            {/* Master Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                lineHeight: '1.08',
                letterSpacing: '-0.035em',
                fontWeight: 900,
                margin: '0 0 18px 0',
                color: '#0f172a',
              }}
            >
              Strategic Clarity.<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0071e3 0%, #0284c7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Architectural Execution.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: '1.65',
                color: '#64748b',
                margin: '0 0 28px 0',
                fontWeight: 400,
              }}
            >
              Direct partner engagement across corporate taxation, MCA statutory compliance, institutional debt syndication, commercial real estate, and executive facilities under one accountable standard.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '36px',
              }}
            >
              <a
                href="#contact"
                className="btn btn-primary"
                style={{
                  padding: '13px 28px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0, 113, 227, 0.28)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Book Advisory Consultation</span>
                <HiArrowRight size={16} />
              </a>

              <a
                href="#services"
                className="btn btn-secondary"
                style={{
                  padding: '13px 22px',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                Explore 6 Disciplines
              </a>

              <Link
                href="/portal/dashboard"
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#0071e3',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>Staff ERP Portal</span>
                <HiArrowRight size={14} />
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e5ea',
              }}
            >
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  Statutory Adherence
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0071e3', letterSpacing: '-0.02em' }}>
                  ₹500Cr+
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  Debt Facilitated
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  250k+
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  Sq.Ft. CRE Managed
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Architectural Stage */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 48px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 3D WebGL Canvas Component */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
              <ArchitecturalHeroExperience3D
                activeTowerIndex={activeTower}
                onSelectTower={handleSelectTower}
              />
            </div>

            {/* Floating Focus Badge in Upper Right of 3D Canvas */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                maxWidth: '280px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 113, 227, 0.2)',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0071e3', letterSpacing: '0.06em', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                  {currentTower.code}
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} />
                  Spatial Focus
                </span>
              </div>

              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                {currentTower.name}
              </div>

              <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: '1.4', marginBottom: '6px' }}>
                {currentTower.tagline}
              </div>

              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0071e3', borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
                {currentTower.keyStat} &bull; {currentTower.statLabel}
              </div>
            </div>

            {/* Subtle Interactive Instruction at Bottom-Left of 3D Canvas */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                fontSize: '0.72rem',
                color: '#94a3b8',
                fontWeight: 500,
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '4px 10px',
                borderRadius: '999px',
                border: '1px solid #e2e8f0',
                pointerEvents: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>🖱️ Drag to orbit campus &bull; Click any tower to focus</span>
            </div>
          </div>
        </div>

        {/* Integrated 6-Practice Bottom Tab Strip */}
        <div style={{ marginTop: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isSelected ? '#0071e3' : '#e5e5ea',
                    background: isSelected ? '#0071e3' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 16px rgba(0, 113, 227, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: isSelected ? '#ffffff' : '#0071e3' }}>
                    {practicePillIcons[idx] || <HiSparkles size={14} />}
                  </span>
                  <span>{tower.discipline}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                    }}
                  >
                    0{idx + 1}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
