import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi'

interface PublicProjectDetail {
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

interface ProjectDetailProps {
  project: PublicProjectDetail
}

export default function ProjectDetailPage({ project }: ProjectDetailProps) {
  const isCompleted = project.status === 'COMPLETED'

  return (
    <>
      <Head>
        <title>{`${project.name} — Project Case Study | Success Tunnel`}</title>
        <meta
          name="description"
          content={project.description || `Case study on ${project.name} by Success Tunnel.`}
        />
        <link rel="canonical" href={`https://successtunnel.in/projects/${project.publicSlug}`} />
        <meta property="og:title" content={`${project.name} — Success Tunnel`} />
        <meta property="og:description" content={project.description || `Case study on ${project.name}.`} />
        <meta property="og:url" content={`https://successtunnel.in/projects/${project.publicSlug}`} />
        <meta property="og:type" content="article" />
      </Head>

      <div>
        <Nav />

        <main>
          {/* Back link */}
          <section style={{ paddingTop: '40px', paddingBottom: '20px' }}>
            <div className="container" style={{ maxWidth: '860px' }}>
              <Link
                href="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <HiOutlineArrowLeft /> Back to all projects
              </Link>
            </div>
          </section>

          {/* Project Header */}
          <section style={{ paddingBottom: '40px' }}>
            <div className="container" style={{ maxWidth: '860px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: isCompleted ? '#f0fdf4' : '#eff6ff',
                    color: isCompleted ? '#16a34a' : '#2563eb',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isCompleted ? <HiOutlineCheckCircle /> : <HiOutlineClock />}
                  {project.status.replace('_', ' ')}
                </span>

                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Completion Progress: {project.progress}%
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                  lineHeight: '1.15',
                  fontWeight: 800,
                  color: 'var(--primary, #0f172a)',
                  margin: '0 0 18px 0',
                }}
              >
                {project.name}
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--muted, #475569)', lineHeight: '1.7', margin: '0 0 24px 0' }}>
                {project.description}
              </p>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${project.progress}%`,
                    height: '100%',
                    background: isCompleted ? '#16a34a' : '#2563eb',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          </section>

          {/* Project Details Grid */}
          <section className="section-surface" style={{ background: '#f8fafc', padding: '50px 0' }}>
            <div className="container" style={{ maxWidth: '860px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {/* Strategic Objective */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                    Business Objective
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                    {project.businessObjective || 'Deliver compliant enterprise-grade technology and operational frameworks.'}
                  </p>
                </div>

                {/* Timeline */}
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HiOutlineCalendar /> Delivery Timeline
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                    {project.startDate ? `Started ${project.startDate.split('T')[0]}` : 'Initiative Active'}
                    {project.endDate ? ` • Target: ${project.endDate.split('T')[0]}` : ''}
                  </p>
                </div>
              </div>

              {/* Scope & Methodology */}
              <div style={{ background: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 14px 0' }}>
                  Execution Standards &amp; Governance
                </h2>
                <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '16px' }}>
                  This initiative followed Success Tunnel&apos;s verified development and delivery standards. Milestones are backed by verified tasks and reviewed by certified practice leads before release.
                </p>
                <ul style={{ paddingLeft: '1.2rem', color: '#475569', lineHeight: '1.8', fontSize: '0.95rem' }}>
                  <li>Rigorous data protection and confidentiality controls.</li>
                  <li>Mathematical progress verification directly derived from completed deliverables.</li>
                  <li>Complete transparency across governance, compliance, and regulatory adherence.</li>
                </ul>
              </div>

              {/* CTA Box */}
              <div style={{ background: '#eff6ff', padding: '32px', borderRadius: '12px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', margin: '0 0 8px 0' }}>
                  Planning a Similar Project?
                </h3>
                <p style={{ color: '#3b82f6', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '540px', margin: '0 auto 20px auto' }}>
                  Consult with our advisory and engineering teams to structure your deliverables, milestones, and governance.
                </p>
                <Link
                  href="/contact"
                  className="btn btn-primary"
                  style={{ borderRadius: '8px', padding: '10px 24px', textDecoration: 'none' }}
                >
                  Contact Advisory Team
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string

  if (!slug) {
    return { notFound: true }
  }

  const raw = await prisma.project.findFirst({
    where: {
      publicSlug: slug,
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
  })

  if (!raw || !raw.publicSlug) {
    return { notFound: true }
  }

  const project: PublicProjectDetail = {
    id: raw.id,
    name: raw.name,
    publicSlug: raw.publicSlug,
    description: raw.description,
    businessObjective: raw.businessObjective,
    status: raw.status,
    progress: raw.progress,
    startDate: raw.startDate ? raw.startDate.toISOString() : null,
    endDate: raw.endDate ? raw.endDate.toISOString() : null,
  }

  return {
    props: {
      project,
    },
  }
}
