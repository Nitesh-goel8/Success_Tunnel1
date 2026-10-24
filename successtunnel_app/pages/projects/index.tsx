import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi'

interface PublicProject {
  id: number
  name: string
  publicSlug: string
  description: string | null
  businessObjective: string | null
  status: string
  progress: number
  startDate: string | null
  endDate: string | null
}

interface ProjectsProps {
  projects: PublicProject[]
}

export default function PublicProjectsPage({ projects }: ProjectsProps) {
  return (
    <>
      <Head>
        <title>Projects &amp; Case Studies — Success Tunnel | Panipat HQ</title>
        <meta
          name="description"
          content="Explore verified projects, technology deliverables, and strategic initiatives delivered by Success Tunnel across corporate compliance, financial technology, and management platforms."
        />
        <link rel="canonical" href="https://successtunnel.in/projects" />
        <meta property="og:title" content="Projects &amp; Case Studies — Success Tunnel" />
        <meta
          property="og:description"
          content="Explore verified projects, technology deliverables, and strategic initiatives delivered by Success Tunnel."
        />
        <meta property="og:url" content="https://successtunnel.in/projects" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="cinematic-theme-root">
        <Nav />

        <main>
          {/* Hero Section */}
          <section
            style={{
              paddingTop: 'clamp(50px, 8vw, 90px)',
              paddingBottom: 'clamp(40px, 6vw, 60px)',
              textAlign: 'center',
            }}
          >
            <div className="container" style={{ maxWidth: '840px' }}>
              <span
                className="eyebrow"
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                PUBLIC DELIVERABLES &bull; VERIFIED METRICS
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 auto 24px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Verified Projects &amp; Case Studies.
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.75', margin: '0 auto' }}>
                A transparent view into strategic initiatives, compliance implementations, and enterprise solutions governed by the Success Tunnel advisory practice.
              </p>
            </div>
          </section>

          {/* Projects Listing */}
          <section style={{ padding: '60px 0 96px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '28px',
                }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 13, 22, 0.95) 100%)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '32px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div>
                      {/* Status & Progress Bar */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background:
                              project.status === 'COMPLETED'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : 'rgba(56, 189, 248, 0.15)',
                            color: project.status === 'COMPLETED' ? '#10b981' : '#38bdf8',
                            border: `1px solid ${project.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {project.status === 'COMPLETED' ? <HiOutlineCheckCircle /> : <HiOutlineClock />}
                          {project.status.replace('_', ' ')}
                        </span>

                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                          {project.progress}% Complete
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: '#f8fafc',
                          margin: '0 0 12px 0',
                          fontFamily: "'Sora', sans-serif",
                          lineHeight: '1.3',
                        }}
                      >
                        {project.name}
                      </h2>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: '#94a3b8',
                          lineHeight: '1.65',
                          margin: '0 0 16px 0',
                        }}
                      >
                        {project.description || 'Public engineering deliverable managed under Success Tunnel guidelines.'}
                      </p>

                      {/* Business Objective */}
                      {project.businessObjective && (
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            fontSize: '0.84rem',
                            color: '#cbd5e1',
                            marginBottom: '20px',
                            lineHeight: '1.5',
                          }}
                        >
                          <strong style={{ color: '#38bdf8', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                            Objective
                          </strong>
                          {project.businessObjective}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & CTA */}
                    <div>
                      <div
                        style={{
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          marginBottom: '20px',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${project.progress}%`,
                            background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>

                      <Link
                        href={`/projects/${project.publicSlug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#38bdf8',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <span>View Verified Details</span>
                        <HiOutlineArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const publicProjects = await prisma.project.findMany({
      where: {
        isPublic: true,
        publicSlug: { not: null },
      },
      select: {
        id: true,
        name: true,
        publicSlug: true,
        description: true,
        businessObjective: true,
        status: true,
        progress: true,
        startDate: true,
        endDate: true,
      },
      orderBy: { id: 'asc' },
    })

    return {
      props: {
        projects: JSON.parse(JSON.stringify(publicProjects)),
      },
    }
  } catch (error) {
    return {
      props: {
        projects: [],
      },
    }
  }
}
