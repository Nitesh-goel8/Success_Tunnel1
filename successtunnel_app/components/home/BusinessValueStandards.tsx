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
    icon: <HiOutlineScale size={24} />,
    title: 'Statutory Accuracy & Governance',
    desc: 'Timely tax filings, MCA corporate compliance, and rigorous legal adherence without guesswork or administrative oversights.',
  },
  {
    icon: <HiOutlineChartPie size={24} />,
    title: 'Multidisciplinary Coordinated Practice',
    desc: 'Chartered Accountants, financial analysts, corporate advocates, and real estate advisors working in direct coordination under one roof.',
  },
  {
    icon: <HiOutlineLockClosed size={24} />,
    title: 'Confidentiality & Data Protection',
    desc: 'Strict non-disclosure standards, encrypted digital records, and role-enforced access controls across all corporate filings and documents.',
  },
  {
    icon: <HiOutlineCheckCircle size={24} />,
    title: 'Verified Deliverable Milestones',
    desc: 'Project progress and advisory deliverables are mathematically tracked from actual completed tasks, eliminating decorative or vague claims.',
  },
]

export default function BusinessValueStandards() {
  return (
    <section className="business-value-section" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
          <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
            GOVERNANCE &amp; ACCOUNTABILITY
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: '#f8fafc',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '14px 0 14px',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            Advisory Standards Grounded in Facts
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
            We replace unsupported marketing slogans with transparent execution principles, institutional discipline, and verified outcomes.
          </p>
        </div>

        {/* Standards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {standards.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.7) 0%, rgba(9, 14, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
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
                  marginBottom: '18px',
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '10px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.88rem',
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
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(13, 21, 39, 0.8) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '18px',
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
              <HiOutlineLocationMarker size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Corporate Headquarters &bull; Panipat, Haryana
              </span>
            </div>
            <h4
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8fafc',
                margin: '0 0 6px',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              First Floor, Sudarshan Tower, Tau Devi Lal Complex
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              Centrally situated behind Hive Hotel in Panipat (132103). Licensed in-person consultations, executive boardroom facilities, and on-site document verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/projects"
              className="btn btn-secondary"
              style={{
                padding: '11px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#f8fafc',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              View Public Projects <HiArrowRight size={14} />
            </Link>

            <Link
              href="/about"
              className="btn btn-primary"
              style={{
                padding: '11px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#ffffff',
                border: 'none',
              }}
            >
              About Company
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
