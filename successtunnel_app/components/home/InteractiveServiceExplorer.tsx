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
    icon: <HiBriefcase size={22} />,
    description:
      'End-to-end statutory advisory for enterprises and founders. We structure tax optimization, handle MCA regulatory filings, resolve complex notices, and ensure complete legal hygiene without administrative ambiguity.',
    scopeItems: [
      'Income Tax filings, assessment representations & statutory audits',
      'GST returns, monthly reconciliations & input tax credit audits',
      'Private Limited, LLP & Section 8 corporate entity incorporation',
      'ROC annual compliance, board resolutions & director KYC governance',
    ],
    deliverables: ['Statutory Filing Confirmations', 'Compliance Health Dossier', 'Tax Advisory Memorandum'],
    idealFor: 'Growing enterprises, trading houses, and founders requiring rigorous regulatory hygiene.',
    path: '/services/consultancy',
  },
  {
    id: 'finance',
    slug: 'finance',
    title: 'Financial Direction',
    subtitle: 'Capital Structuring, Debt Procurement & Restructuring',
    icon: <HiChartBar size={22} />,
    description:
      'Institutional financial planning and bank credit syndication. We prepare CMA data, detailed project reports (DPR), and debt-equity restructuring roadmaps to secure working capital and long-term liquidity.',
    scopeItems: [
      'Credit syndication, CMA data modeling & bank project dossiers',
      'Working capital facilities (Cash Credit, Overdraft & Letter of Credit)',
      'Balance sheet optimization and structured debt restructuring',
      'Cash flow forecasting and disciplined capital allocation planning',
    ],
    deliverables: ['Detailed Project Reports (DPR)', 'CMA Data Model', 'Bank Credit Submission Package'],
    idealFor: 'Manufacturing plants, MSMEs, and commercial distribution enterprises seeking expansion funding.',
    path: '/services/finance',
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Professional Education',
    subtitle: 'Practical Accounting, GST & Taxation Training',
    icon: <HiAcademicCap size={22} />,
    description:
      'Industry-calibrated professional training designed by seasoned Chartered Accountants. We bridge the gap between academic theory and practical statutory filing workflows.',
    scopeItems: [
      'Practical Tally Prime & ERP enterprise software masterclasses',
      'Hands-on training on live government Income Tax and GST return portals',
      'Corporate accounting principles, payroll computation & TDS deductions',
      'Curated working checklists, revision notes, and video walkthroughs',
    ],
    deliverables: ['Course Completion Certificates', 'Practical Working Checklists', 'Curated Revision Notes'],
    idealFor: 'Commerce graduates, accounting staff, and business owners overseeing in-house accounts.',
    path: '/education',
  },
  {
    id: 'investment',
    slug: 'investment',
    title: 'Investment Advisory',
    subtitle: 'Disciplined Capital Allocation & Wealth Preservation',
    icon: <HiTrendingUp size={22} />,
    description:
      'Data-driven investment advisory prioritizing capital preservation, tax-efficient yields, and structured long-term appreciation across diversified asset classes.',
    scopeItems: [
      'Risk-adjusted portfolio design and asset allocation modeling',
      'Fixed-income securities, commercial debt instruments & mutual funds',
      'Tax-saving investment structures under applicable Income Tax sections',
      'Periodic portfolio rebalancing and risk mitigation audits',
    ],
    deliverables: ['Personalized Allocation Map', 'Risk Profile Analysis', 'Quarterly Rebalancing Reports'],
    idealFor: 'Business promoters, executives, and family offices seeking non-speculative growth.',
    path: '/services/investment',
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    title: 'Commercial Real Estate',
    subtitle: 'Property Advisory, Due Diligence & Portfolio Acquisition',
    icon: <HiOfficeBuilding size={22} />,
    description:
      'Rigorous real estate advisory focusing on prime commercial, industrial, and high-yield opportunities across Panipat, Haryana, and the National Capital Region.',
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
    icon: <HiKey size={22} />,
    description:
      'Modern, fully-managed office spaces and boardroom facilities in central commercial hubs of Panipat. Zero setup downtime, high-speed fiber internet, and executive amenities.',
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
    <section className="service-explorer-section" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
          <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
            DISCIPLINE EXPLORER
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
            Inspect Practice Scope &amp; Deliverables
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
            Select any advisory discipline below to review statutory scope, tangible deliverables, and target client profiles.
          </p>
        </div>

        {/* Practice Area Navigation Tabs (Unified Calm Architecture) */}
        <div
          role="tablist"
          aria-label="Success Tunnel Practice Disciplines"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '32px',
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
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.07)',
                  background: isActive ? 'rgba(30, 58, 138, 0.3)' : 'rgba(15, 23, 42, 0.5)',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  boxShadow: isActive ? '0 4px 16px rgba(56, 189, 248, 0.15)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: isActive ? '#38bdf8' : '#64748b' }}>{service.icon}</span>
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
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 14, 26, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: 'clamp(24px, 4vw, 44px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
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
                  color: '#38bdf8',
                  fontSize: '0.82rem',
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
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  color: '#f8fafc',
                  fontWeight: 800,
                  margin: '0 0 14px',
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: '-0.02em',
                }}
              >
                {currentService.title}
              </h3>

              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                {currentService.description}
              </p>

              {/* Scope Checklist */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 700 }}>
                  Statutory &amp; Advisory Scope
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentService.scopeItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }}>
                        <HiCheckCircle size={17} />
                      </span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: '1.5' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <Link
                  href={currentService.path}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 22px',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  View Complete Discipline Details <HiArrowRight size={15} />
                </Link>

                <a
                  href="#contact"
                  className="btn btn-secondary"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  Book Consultation
                </a>
              </div>
            </div>

            {/* Right Column: Key Deliverables & Client Profile */}
            <div
              style={{
                background: 'rgba(10, 16, 28, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Deliverables */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '10px' }}>
                  <HiLightningBolt size={18} />
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Verified Deliverables
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentService.deliverables.map((deliv, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        color: '#f1f5f9',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                      }}
                    >
                      &bull; {deliv}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal Client Profile */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', marginBottom: '6px' }}>
                  <HiShieldCheck size={18} style={{ color: '#38bdf8' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Target Profile
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                  {currentService.idealFor}
                </p>
              </div>

              {/* Panipat HQ Governance Note */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(30, 58, 138, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    flexShrink: 0,
                  }}
                >
                  HQ
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Governed directly at our Panipat, Haryana corporate headquarters by licensed advisors.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
