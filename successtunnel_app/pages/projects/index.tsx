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
        <title>Projects & Case Studies — Success Tunnel</title>
        <meta
          name="description"
          content="Explore verified projects, technology deliverables, and strategic initiatives delivered by Success Tunnel across corporate compliance, financial technology, and management platforms."
        />
        <link rel="canonical" href="https://successtunnel.in/projects" />
        <meta property="og:title" content="Projects & Case Studies — Success Tunnel" />
        <meta
          property="og:description"
          content="Explore verified projects, technology deliverables, and strategic initiatives delivered by Success Tunnel."
        />
        <meta property="og:url" content="https://successtunnel.in/projects" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />

        <main>
          {/* Hero Section */}
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px', textAlign: 'center' }}>
            <div className="container" style={{ maxWidth: '840px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '20px' }}>
                DELIVERABLES &amp; INITIATIVES
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '18px auto 22px',
                }}
              >
                Verified Projects &amp; Solutions
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: '1.65' }}>
                A transparent view into corporate initiatives, engineering deliverables, and compliance platforms executed by the Success Tunnel team.
              </p>
            </div>
          </section>

          {/* Projects Listing */}
          <section className="section-surface" style={{ background: '#f8fafc', padding: '60px 0' }}>
            <div className="container" style={{ maxWidth: '1080px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid var(--line, #e2e8f0)',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: project.status === 'COMPLETED' ? '#f0fdf4' : '#eff6ff',
                            color: project.status === 'COMPLETED' ? '#16a34a' : '#2563eb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {project.status === 'COMPLETED' ? <HiOutlineCheckCircle /> : <HiOutlineClock />}
                          {project.status.replace('_', ' ')}
                        </span>

                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                          {project.progress}% Complete
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary, #0f172a)', margin: '0 0 10px 0' }}>
                        {project.name}
                      </h2>

                      <p style={{ fontSize: '0.9rem', color: 'var(--muted, #64748b)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        {project.description || 'Public engineering deliverable managed under Success Tunnel guidelines.'}
                      </p>

                      {project.businessObjective && (
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.825rem', color: '#334155', marginBottom: '18px' }}>
                          <strong>Objective:</strong> {project.businessObjective}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '18px' }}>
                        <div
                          style={{
                            width: `${project.progress}%`,
                            height: '100%',
                            background: project.status === 'COMPLETED' ? '#16a34a' : '#2563eb',
                            borderRadius: '3px',
                          }}
                        />
                      </div>

                      <Link
                        href={`/projects/${project.publicSlug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                        }}
                      >
                        View Public Case Study <HiOutlineArrowRight />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="section-surface" style={{ padding: '60px 0' }}>
            <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                Need Guidance on an Enterprise Initiative?
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Our team provides advisory and delivery support across compliance, finance, and engineering management.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ borderRadius: '10px', padding: '12px 28px' }}>
                Schedule a Consultation
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Query strictly approved public projects and non-sensitive fields
  const rawProjects = await prisma.project.findMany({
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
    orderBy: { updatedAt: 'desc' },
  })

  const projects = rawProjects.map((p) => ({
    id: p.id,
    name: p.name,
    publicSlug: p.publicSlug || '',
    description: p.description,
    businessObjective: p.businessObjective,
    status: p.status,
    progress: p.progress,
    startDate: p.startDate ? p.startDate.toISOString() : null,
    endDate: p.endDate ? p.endDate.toISOString() : null,
  }))

  return {
    props: {
      projects,
    },
  }
}
