import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from './Portal.module.css'
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineChartSquareBar,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineExternalLink,
  HiOutlineSparkles,
} from 'react-icons/hi'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PortalShellProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: BreadcrumbItem[]
}

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  department?: { name: string } | null
  employeeProfile?: {
    employeeCode: string
    designation: string
    isDemo: boolean
  } | null
}

export default function PortalShell({ children, title, breadcrumbs = [] }: PortalShellProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await axios.get('/api/portal/auth/me')
        setUser(res.data.user)
        setUnreadCount(res.data.unreadNotificationsCount || 0)
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push(`/portal/login?redirect=${encodeURIComponent(router.asPath)}`)
        }
      } finally {
        setLoading(false)
      }
    }
    loadCurrentUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await axios.post('/api/portal/auth/logout')
      router.push('/portal/login')
    } catch (err) {
      router.push('/portal/login')
    }
  }

  const roleName = user?.role ? user.role.replace('_', ' ') : 'Employee'
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin'
  const isHrAdmin = isSuperAdmin || user?.role === 'hr_admin'
  const isFinanceAdmin = isSuperAdmin || user?.role === 'finance_admin'

  const navigation = [
    {
      section: 'Main',
      items: [
        { label: 'Dashboard', href: '/portal/dashboard', icon: HiOutlineViewGrid },
      ],
    },
    {
      section: 'Organization & HR',
      items: [
        { label: 'Employee Directory', href: '/portal/employees', icon: HiOutlineUsers },
        { label: 'Departments & Org', href: '/portal/departments', icon: HiOutlineOfficeBuilding },
      ],
    },
    {
      section: 'Projects & Tasks',
      items: [
        { label: 'Projects', href: '/portal/projects', icon: HiOutlineClipboardList },
        { label: 'Task Kanban', href: '/portal/tasks', icon: HiOutlineClipboardList },
      ],
    },
    {
      section: 'Workforce',
      items: [
        { label: 'Attendance', href: '/portal/attendance', icon: HiOutlineClock },
        { label: 'Leaves & Holidays', href: '/portal/leaves', icon: HiOutlineCalendar },
        { label: 'HR Documents', href: '/portal/documents', icon: HiOutlineDocumentText },
      ],
    },
    {
      section: 'Finance & Insights',
      items: [
        { label: 'Expenses', href: '/portal/finance', icon: HiOutlineCash },
        { label: 'Reports & Analytics', href: '/portal/reports', icon: HiOutlineChartSquareBar },
        ...(isSuperAdmin || isHrAdmin
          ? [{ label: 'Audit Trail', href: '/portal/audit-logs', icon: HiOutlineShieldCheck }]
          : []),
      ],
    },
  ]

  return (
    <div className={styles.portalContainer}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${
          mobileOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.sidebarBrand}>
          <Link href="/portal/dashboard" className={styles.brandLogo}>
            <span className={styles.brandBadge}>ERP</span>
            {!collapsed && <span>Success Tunnel</span>}
          </Link>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navigation.map((group, gIdx) => (
            <div key={gIdx} className={styles.navSection}>
              {!collapsed && <div className={styles.sectionHeader}>{group.section}</div>}
              {group.items.map((item, idx) => {
                const Icon = item.icon
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    title={collapsed ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className={styles.navIcon} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}

          {/* Quick link to CMS */}
          {isSuperAdmin && (
            <div className={styles.navSection}>
              {!collapsed && <div className={styles.sectionHeader}>External Portals</div>}
              <Link href="/admin/dashboard" className={styles.navItem} target="_blank">
                <HiOutlineExternalLink className={styles.navIcon} />
                {!collapsed && <span>Website CMS</span>}
              </Link>
            </div>
          )}
        </nav>

        {/* User Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userName} title={user?.name || user?.email}>
                {user?.name || 'Authorized User'}
              </div>
              <div className={styles.userRole}>
                {user?.employeeProfile?.designation || roleName}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <div className={styles.mainWrapper}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.iconBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              <HiOutlineMenu />
            </button>

            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/portal/dashboard" style={{ color: '#64748b', textDecoration: 'none' }}>
                ERP Portal
              </Link>
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  {b.href ? (
                    <Link href={b.href} style={{ color: '#64748b', textDecoration: 'none' }}>
                      {b.label}
                    </Link>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{b.label}</span>
                  )}
                </React.Fragment>
              ))}
              {breadcrumbs.length === 0 && (
                <>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  <span className={styles.breadcrumbCurrent}>{title}</span>
                </>
              )}
            </nav>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.demoBanner}>
              <HiOutlineSparkles />
              <span>DEMO ENVIRONMENT</span>
            </div>

            <button
              className={styles.iconBtn}
              title={`Notifications (${unreadCount} unread)`}
              onClick={() => router.push('/portal/dashboard#notifications')}
            >
              <HiOutlineBell />
              {unreadCount > 0 && <span className={styles.badgeDot} />}
            </button>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <HiOutlineLogout />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  )
}
