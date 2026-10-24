import React from 'react'
import { HiOutlineSearch, HiOutlineDocumentText, HiOutlineChatAlt2, HiOutlineSparkles } from 'react-icons/hi'

const workflowStages = [
  {
    step: '01',
    icon: <HiOutlineSearch size={24} />,
    title: 'Discovery & Practice Scoping',
    subtitle: 'Initial Engagement',
    description:
      'We assess your statutory requirements, current business structure, and growth objectives to define the exact advisory scope and deliverables.',
  },
  {
    step: '02',
    icon: <HiOutlineDocumentText size={24} />,
    title: 'Audit & Records Review',
    subtitle: 'Data Assessment',
    description:
      'Our senior practitioners at Panipat HQ conduct a structured review of existing filings, financial accounts, or commercial real estate specifications.',
  },
  {
    step: '03',
    icon: <HiOutlineChatAlt2 size={24} />,
    title: 'Tailored Strategy Architecture',
    subtitle: 'Solution Blueprint',
    description:
      'We construct a comprehensive execution roadmap with fixed statutory deadlines, bank CMA models, or lease terms—eliminating administrative ambiguity.',
  },
  {
    step: '04',
    icon: <HiOutlineSparkles size={24} />,
    title: 'Execution & Ongoing Governance',
    subtitle: 'Continuous Review',
    description:
      'Our team executes filings, secures debt syndication, or completes lease transitions, backed by transparent milestone tracking and regular reviews.',
  },
]

export default function ProcessTimeline() {
  return (
    <section className="process-timeline-section" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
          <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
            STRUCTURED METHODOLOGY
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
            A Systematic Path from Brief to Results
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
            Every engagement follows a verified four-phase advisory process designed to eliminate regulatory friction, ensure compliance, and deliver measurable business outcomes.
          </p>
        </div>

        {/* 4-Step Connected Grid with Unified Palette */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            position: 'relative',
          }}
        >
          {workflowStages.map((stage, idx) => (
            <div
              key={stage.step}
              style={{
                background: 'linear-gradient(180deg, rgba(13, 21, 39, 0.7) 0%, rgba(9, 14, 26, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Step Number & Icon Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '18px',
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
                    {stage.icon}
                  </div>

                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      fontFamily: "'Sora', sans-serif",
                      color: 'rgba(255, 255, 255, 0.15)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stage.step}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#38bdf8',
                    marginBottom: '6px',
                  }}
                >
                  {stage.subtitle}
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    marginBottom: '10px',
                    fontFamily: "'Sora', sans-serif",
                    lineHeight: '1.3',
                  }}
                >
                  {stage.title}
                </h3>

                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.88rem',
                    lineHeight: '1.65',
                    margin: 0,
                  }}
                >
                  {stage.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} />
                <span>Phase {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
