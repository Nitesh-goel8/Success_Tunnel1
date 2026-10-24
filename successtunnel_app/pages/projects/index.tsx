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
        <title>Projects &amp; Case Studies — Success Tunnel | Panipat</title>
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
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Deliverables &amp; Initiatives
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '16px auto 22px',
                }}
              >
                Verified Projects &amp; Solutions
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: '1.65' }}>
                A transparent view into corporate initiatives, statutory deliverables, and management platforms executed by the Success Tunnel advisory group.
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
                      borderRadius: '16px',
                      border: '1px solid var(--line, #e2e8f0)',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
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
                            background: project.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff',
                            color: project.status === 'COMPLETED' ? '#059669' : '#1d4ed8',
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

                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary, #0f172a)', margin: '0 0 10px 0' }}>
                        {project.name}
                      </h2>

                      <p style={{ fontSize: '0.9rem', color: 'var(--muted, #64748b)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        {project.description || 'Corporate advisory deliverable managed under Success Tunnel guidelines.'}
                      </p>

                      {project.businessObjective && (
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.825rem', color: '#334155', marginBottom: '18px', border: '1px solid var(--line)' }}>
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
                            background: project.status === 'COMPLETED' ? '#059669' : '#1d4ed8',
                            borderRadius: '3px',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                        <span>
                          {project.endDate ? `Target: ${new Date(project.endDate).toLocaleDateString()}` : 'Continuous Execution'}
                        </span>

                        <Link
                          href={`/projects/${project.publicSlug}`}
                          style={{
                            color: 'var(--accent, #1d4ed8)',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          View Details <HiOutlineArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Standards & Transparency Note */}
          <section className="section-surface" style={{ background: '#ffffff', textAlign: 'center', padding: '56px 0' }}>
            <div className="container" style={{ maxWidth: '780px' }}>
              <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                <span className="editorial-tag-dot" />
                Execution Transparency
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
                Milestone-Driven Delivery Model
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.68', margin: '0 auto 28px' }}>
                All deliverables in Success Tunnel are managed through strict task dependencies, transparent percentage calculations, and immutable audit logs. Clients receive verifiable milestone reports at every stage.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '12px 26px' }}>
                Initiate Project Mandate &rarr;
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
  try {
    const rawProjects = await prisma.project.findMany({
      where: {
        isPublic: true,
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const projects: PublicProject[] = rawProjects.map((p) => ({
      id: p.id,
      name: p.name,
      publicSlug: p.publicSlug || `project-${p.id}`,
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
  } catch (error) {
    console.error('Failed to fetch public projects:', error)
    return {
      props: {
        projects: [],
      },
    }
  }
}
