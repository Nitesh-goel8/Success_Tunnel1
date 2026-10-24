import React from 'react'
import { HiOutlineSearch, HiOutlineDocumentText, HiOutlineChatAlt2, HiOutlineSparkles } from 'react-icons/hi'

const workflowStages = [
  {
    step: '01',
    icon: <HiOutlineSearch size={28} />,
    title: 'Discovery & Practice Scoping',
    subtitle: 'Initial Engagement',
    description:
      'Explore our multidisciplinary practices. Select the relevant advisory domain or submit an enquiry outlining your objectives, timeline, and current operational constraints.',
    color: '#38bdf8',
  },
  {
    step: '02',
    icon: <HiOutlineDocumentText size={28} />,
    title: 'Audit & Requirements Review',
    subtitle: 'Data Assessment',
    description:
      'Our senior practitioners at Panipat HQ conduct a structured review of existing documentation—financial records, compliance history, or commercial real estate specifications.',
    color: '#60a5fa',
  },
  {
    step: '03',
    icon: <HiOutlineChatAlt2 size={28} />,
    title: 'Tailored Strategy & Architecture',
    subtitle: 'Solution Blueprint',
    description:
      'We deliver a comprehensive roadmap specifying statutory filings, capital structure, syllabus modules, or property lease terms with fixed milestones and verified deliverables.',
    color: '#a855f7',
  },
  {
    step: '04',
    icon: <HiOutlineSparkles size={28} />,
    title: 'Coordinated Execution & Review',
    subtitle: 'Continuous Governance',
    description:
      'Our team executes filings, completes lender syndication, conducts training, or closes property transactions, backed by ongoing milestone reviews and compliance tracking.',
    color: '#10b981',
  },
]

export default function ProcessTimeline() {
  return (
    <section className="process-timeline-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px' }}>
          <span className="eyebrow" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.08)' }}>
            STRUCTURED METHODOLOGY
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
            A Systematic Path from Brief to Results
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7', margin: 0 }}>
            Every engagement follows a verified four-phase advisory process designed to eliminate ambiguity, ensure legal compliance, and deliver measurable outcomes.
          </p>
        </div>

        {/* 4-Step Connected Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {workflowStages.map((stage, idx) => (
            <div
              key={stage.step}
              className="process-stage-card"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 13, 22, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '32px 28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Step Number & Icon Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${stage.color}22, rgba(15, 23, 42, 0.6))`,
                    border: `1px solid ${stage.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stage.color,
                  }}
                >
                  {stage.icon}
                </div>

                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    fontFamily: "'Sora', sans-serif",
                    color: 'rgba(255, 255, 255, 0.12)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {stage.step}
                </div>
              </div>

              {/* Subtitle Eyebrow */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: stage.color,
                  marginBottom: '8px',
                }}
              >
                {stage.subtitle}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginBottom: '14px',
                  fontFamily: "'Sora', sans-serif",
                  lineHeight: '1.3',
                }}
              >
                {stage.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.92rem',
                  lineHeight: '1.65',
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                {stage.description}
              </p>

              {/* Bottom Subtle Indicator */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.82rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage.color }} />
                <span>Phase {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
