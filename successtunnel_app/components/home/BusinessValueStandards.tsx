import React from 'react'
import Link from 'next/link'
import {
  HiShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineScale,
  HiOutlineChartPie,
  HiArrowRight,
  HiOutlineLocationMarker,
} from 'react-icons/hi'

const standards = [
  {
    icon: <HiOutlineScale size={26} />,
    title: 'Statutory Accuracy & Governance',
    desc: 'Timely tax filings, MCA statutory compliance, and rigorous legal adherence without guesswork or administrative oversights.',
    color: '#38bdf8',
  },
  {
    icon: <HiOutlineChartPie size={26} />,
    title: 'Multidisciplinary Coordinated Practice',
    desc: 'Chartered Accountants, financial analysts, corporate advocates, and real estate advisors working in direct coordination under one roof.',
    color: '#60a5fa',
  },
  {
    icon: <HiOutlineLockClosed size={26} />,
    title: 'Confidentiality & Data Protection',
    desc: 'Strict non-disclosure standards, encrypted digital records, and role-enforced access controls across all corporate filings and documents.',
    color: '#a855f7',
  },
  {
    icon: <HiOutlineCheckCircle size={26} />,
    title: 'Verified Deliverable Milestones',
    desc: 'Project progress and advisory deliverables are mathematically tracked from actual completed tasks, eliminating decorative or vague claims.',
    color: '#10b981',
  },
]

export default function BusinessValueStandards() {
  return (
    <section className="business-value-section" style={{ position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 52px' }}>
          <span className="eyebrow" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
            ACCOUNTABILITY &amp; INTEGRITY
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              color: '#f8fafc',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '16px 0 18px',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Advisory Standards Grounded in Facts
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
            We replace unsupported marketing slogans with transparent execution principles, institutional discipline, and verified outcomes.
          </p>
        </div>

        {/* Standards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {standards.map((item, idx) => (
            <div
              key={idx}
              className="standard-card"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(9, 13, 22, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '32px 26px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${item.color}22, rgba(15, 23, 42, 0.6))`,
                  border: `1px solid ${item.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  marginBottom: '20px',
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '12px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.92rem',
                  lineHeight: '1.65',
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Panipat Headquarters Trust Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '20px',
            padding: 'clamp(24px, 3.5vw, 36px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px' }}>
              <HiOutlineLocationMarker size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Corporate Headquarters &bull; Panipat, Haryana
              </span>
            </div>
            <h4
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#f8fafc',
                margin: '0 0 8px',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              First Floor, Sudarshan Tower, Tau Devi Lal Complex
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Centrally situated behind Hive Hotel in Panipat (132103). Licensed in-person consultations, executive boardroom facilities, and on-site document verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/projects"
              className="btn btn-secondary"
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#f8fafc',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              View Public Projects <HiArrowRight />
            </Link>

            <Link
              href="/about"
              className="btn btn-primary"
              style={{
                padding: '12px 22px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              Our Company
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
