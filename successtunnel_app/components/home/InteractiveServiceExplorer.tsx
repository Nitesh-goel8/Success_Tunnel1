import React, { useState } from 'react'
import Link from 'next/link'
import {
  HiBriefcase,
  HiChartBar,
  HiAcademicCap,
  HiTrendingUp,
  HiOfficeBuilding,
  HiKey,
  HiCheckCircle,
  HiArrowRight,
  HiShieldCheck,
  HiLightningBolt,
} from 'react-icons/hi'

export interface ServiceDetail {
  id: string
  slug: string
  title: string
  subtitle: string
  icon: React.ReactNode
  accentColor: string
  gradient: string
  description: string
  scopeItems: string[]
  deliverables: string[]
  idealFor: string
  path: string
}

const serviceCatalog: ServiceDetail[] = [
  {
    id: 'consultancy',
    slug: 'consultancy',
    title: 'Corporate Consultancy',
    subtitle: 'Tax, Statutory Compliance & Entity Governance',
    icon: <HiBriefcase size={26} />,
    accentColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(15,23,42,0.85))',
    description:
      'End-to-end statutory advisory for enterprises and founders. We structure tax optimization, handle MCA regulatory filings, resolve complex notices, and ensure total compliance without guesswork.',
    scopeItems: [
      'Income Tax returns, audits & representation before authorities',
      'GST registrations, monthly reconciliations & input credit audits',
      'Private Limited, LLP & Section 8 corporate entity incorporation',
      'ROC annual compliance, shareholder documentation & director KYC',
    ],
    deliverables: ['Statutory Filing Confirmations', 'Compliance Health Reports', 'Tax Advisory Memo'],
    idealFor: 'Growing enterprises, startups, and established trading houses needing rigorous legal & tax hygiene.',
    path: '/services/consultancy',
  },
  {
    id: 'finance',
    slug: 'finance',
    title: 'Financial Direction',
    subtitle: 'Capital Structuring, Debt Procurement & Restructuring',
    icon: <HiChartBar size={26} />,
    accentColor: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(15,23,42,0.85))',
    description:
      'Institutional financial planning and capital procurement. We develop CMA data, business projection models, and debt-equity restructuring roadmaps to secure bank funding and optimize working capital.',
    scopeItems: [
      'Bank finance project reports, CMA data & credit syndication',
      'Working capital limits (Cash Credit, Overdraft & Letter of Credit)',
      'Balance sheet optimization and debt restructuring strategies',
      'Cash flow forecasting and institutional capital allocation',
    ],
    deliverables: ['Detailed Project Reports (DPR)', 'CMA Data Model', 'Bank Proposal Packages'],
    idealFor: 'Manufacturing plants, MSMEs, and expanding distribution companies needing growth liquidity.',
    path: '/services/finance',
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Professional Education',
    subtitle: 'Practical Accounting, GST & Taxation Training',
    icon: <HiAcademicCap size={26} />,
    accentColor: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(15,23,42,0.85))',
    description:
      'Industry-ready professional training designed by seasoned Chartered Accountants and corporate practitioners. Bridging the gap between theoretical textbooks and practical commercial compliance.',
    scopeItems: [
      'Comprehensive Practical Tally Prime & ERP 9 software masterclasses',
      'Live portal training on Income Tax and GST return filing portals',
      'Corporate accounting principles, payroll computation & TDS deductions',
      'Structured study notes, calculator templates and video walkthroughs',
    ],
    deliverables: ['Course Completion Certificates', 'Practical Working Checklists', 'Curated Revision Notes'],
    idealFor: 'Commerce graduates, aspiring accountants, and business owners looking to oversee their accounts.',
    path: '/education',
  },
  {
    id: 'investment',
    slug: 'investment',
    title: 'Investment Advisory',
    subtitle: 'Disciplined Capital Allocation & Wealth Preservation',
    icon: <HiTrendingUp size={26} />,
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(15,23,42,0.85))',
    description:
      'Data-driven investment strategies prioritizing capital preservation, tax-efficient yields, and long-term appreciation across diversified asset classes.',
    scopeItems: [
      'Risk-adjusted portfolio design and asset allocation modeling',
      'Fixed-income securities, commercial debt instruments & mutual funds',
      'Tax-saving investment avenues under applicable Income Tax sections',
      'Periodic portfolio rebalancing and risk mitigation audits',
    ],
    deliverables: ['Personalized Allocation Map', 'Risk Profile Analysis', 'Quarterly Rebalancing Reports'],
    idealFor: 'Business promoters, executives, and family offices seeking disciplined, non-speculative growth.',
    path: '/services/investment',
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'Commercial Real Estate',
    subtitle: 'Property Advisory, Due Diligence & Portfolio Acquisition',
    icon: <HiOfficeBuilding size={26} />,
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.85))',
    description:
      'Rigorous property advisory focusing on prime commercial, industrial, and high-yield residential opportunities across Panipat, Haryana, and the National Capital Region.',
    scopeItems: [
      'Commercial property sourcing, site evaluation & valuation analysis',
      'Legal title verification, municipal approvals & registry documentation',
      'Yield calculations, rental return modeling & capital appreciation forecasts',
      'Industrial plots, retail hubs & corporate headquarters acquisitions',
    ],
    deliverables: ['Property Due Diligence Dossier', 'Yield Analysis Model', 'Legal Clearance Checklist'],
    idealFor: 'Institutional investors, commercial occupiers, and property developers seeking clear titles.',
    path: '/services/real-estate',
  },
  {
    id: 'rental-space',
    slug: 'rental-space',
    title: 'Managed Rental Space',
    subtitle: 'Ready-to-Move Corporate Suites & Managed Workspaces',
    icon: <HiKey size={26} />,
    accentColor: '#ec4899',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(15,23,42,0.85))',
    description:
      'Modern, fully-managed office spaces and conference facilities located in central commercial hubs of Panipat. Zero setup downtime, high-speed fiber connectivity, and professional amenities.',
    scopeItems: [
      'Private dedicated team cabins, executive suites & shared flex desks',
      'High-speed redundant internet, biometric access & 24/7 power backup',
      'Equipped conference rooms with presentation hardware and video conferencing',
      'Flexible lease terms, reception coordination & housekeeping support',
    ],
    deliverables: ['Flexible Lease Agreements', 'Immediate Keys Handover', 'All-Inclusive Facility Services'],
    idealFor: 'Branch offices, corporate advisory teams, consultants, and remote tech workgroups.',
    path: '/services/rental-space',
  },
]

export default function InteractiveServiceExplorer() {
  const [activeTab, setActiveTab] = useState<string>('consultancy')

  const currentService = serviceCatalog.find(s => s.id === activeTab) || serviceCatalog[0]

  return (
    <section className="service-explorer-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }}>
          <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
            INTERACTIVE PRACTICE EXPLORER
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
            Explore How We Accelerate Your Growth
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
            Select any practice area below to inspect concrete capabilities, scope of work, and expected deliverables.
          </p>
        </div>

        {/* Practice Area Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Success Tunnel Practice Areas"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '36px',
          }}
        >
          {serviceCatalog.map(service => {
            const isActive = service.id === activeTab
            return (
              <button
                key={service.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${service.id}`}
                id={`tab-${service.id}`}
                onClick={() => setActiveTab(service.id)}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  transition: 'all 0.25s ease',
                  border: isActive ? `1px solid ${service.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive
                    ? `linear-gradient(135deg, ${service.accentColor}22, rgba(15, 23, 42, 0.95))`
                    : 'rgba(15, 23, 42, 0.65)',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  boxShadow: isActive ? `0 0 20px ${service.accentColor}33` : 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: isActive ? service.accentColor : '#64748b' }}>{service.icon}</span>
                <span>{service.title}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Service Detail Panel */}
        <div
          id={`panel-${currentService.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentService.id}`}
          className="explorer-detail-card"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)',
            border: `1px solid ${currentService.accentColor}44`,
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 48px)',
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${currentService.accentColor}18`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Corner Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: currentService.accentColor,
              opacity: 0.12,
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Scope & Overview */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: currentService.accentColor,
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                <span>{currentService.icon}</span>
                <span>{currentService.subtitle}</span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  color: '#f8fafc',
                  fontWeight: 800,
                  margin: '0 0 16px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                {currentService.title}
              </h3>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.75', marginBottom: '28px' }}>
                {currentService.description}
              </p>

              {/* Scope Checklist */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  Core Advisory Scope
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentService.scopeItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: currentService.accentColor, marginTop: '3px', flexShrink: 0 }}>
                        <HiCheckCircle size={18} />
                      </span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.94rem', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                <Link
                  href={currentService.path}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${currentService.accentColor}, #2563eb)`,
                    color: '#ffffff',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: `0 8px 24px ${currentService.accentColor}44`,
                  }}
                >
                  Explore Detailed Practice <HiArrowRight />
                </Link>

                <a
                  href="#contact"
                  className="btn btn-secondary"
                  style={{
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  Request Consultation
                </a>
              </div>
            </div>

            {/* Right Column: Key Deliverables & Target Audience Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Deliverables */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '12px' }}>
                  <HiLightningBolt size={20} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tangible Deliverables
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentService.deliverables.map((deliv, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        color: '#f1f5f9',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      • {deliv}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal For */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '8px' }}>
                  <HiShieldCheck size={20} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ideal Client Profile
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  {currentService.idealFor}
                </p>
              </div>

              {/* Panipat HQ Governance Note */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  HQ
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.4' }}>
                  Governed directly by licensed advisors at our Panipat, Haryana corporate headquarters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
