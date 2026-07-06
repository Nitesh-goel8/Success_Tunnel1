import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getTokenFromReq, verifyToken } from '../../lib/auth'

export default function Admin() {
  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
            <span className="eyebrow">Admin dashboard</span>
            <h2>Manage content and enquiries.</h2>
            <p>Quick access to the main content tools used by the site.</p>
          </div>

          <div className="admin-grid">
            <Link href="/admin/services" className="admin-card">
              <div className="service-card-kicker">Content</div>
              <h3 style={{ marginTop: 12 }}>Manage Services</h3>
              <p style={{ marginTop: 10 }}>Create and update the service catalog.</p>
            </Link>
            <Link href="/admin/properties" className="admin-card">
              <div className="service-card-kicker">Listings</div>
              <h3 style={{ marginTop: 12 }}>Manage Properties</h3>
              <p style={{ marginTop: 10 }}>Add or remove property listings and details.</p>
            </Link>
            <Link href="/admin/blogs" className="admin-card">
              <div className="service-card-kicker">Publications</div>
              <h3 style={{ marginTop: 12 }}>Manage Blogs</h3>
              <p style={{ marginTop: 10 }}>Write, edit, and delete insights and articles.</p>
            </Link>
            <Link href="/admin/enquiries" className="admin-card">
              <div className="service-card-kicker">Leads</div>
              <h3 style={{ marginTop: 12 }}>View Enquiries</h3>
              <p style={{ marginTop: 10 }}>Review incoming leads and export them when needed.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = getTokenFromReq(req as any)
  const payload = verifyToken(token as string)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
