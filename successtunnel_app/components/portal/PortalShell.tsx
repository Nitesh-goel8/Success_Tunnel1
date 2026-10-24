import React, { useEffect, useState, useRef, useCallback } from 'react'
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
  HiOutlineChevronDown,
  HiOutlineExternalLink,
  HiOutlineSparkles,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineCode,
  HiOutlineUserGroup,
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

interface NotificationItem {
  id: number
  title: string
  message: string
  type: string
  link?: string | null
  isRead: boolean
  createdAt: string
}

interface SearchResults {
  navigation: Array<{ label: string; href: string; category: string }>
  projects: Array<{ id: number; code: string; title: string; status: string; progress: number; href: string }>
  tasks: Array<{ id: number; code: string; title: string; status: string; priority: string; href: string }>
  employees: Array<{ id: number; name: string; email: string; designation: string; department: string; employeeCode?: string; href: string }>
  leads?: Array<{ id: number; code: string; title: string; contactName: string; status: string; value: number; href: string }>
  customers?: Array<{ id: number; code: string; name: string; company: string; status: string; href: string }>
}

export default function PortalShell({ children, title, breadcrumbs = [] }: PortalShellProps) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [, setLoading] = useState(true)

  // Notifications State
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // Profile Menu State
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdowns on outside click
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load current user profile
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

  // Fetch full notifications on popover open
  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true)
    try {
      const res = await axios.get('/api/portal/notifications')
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unreadCount || 0)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoadingNotifications(false)
    }
  }, [])

  const toggleNotifications = () => {
    if (!showNotifications) {
      loadNotifications()
    }
    setShowNotifications(!showNotifications)
    setShowProfileMenu(false)
  }

  const handleMarkAllRead = async () => {
    try {
      await axios.patch('/api/portal/notifications', { markAllRead: true })
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  // Live Search handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null)
      setShowSearchDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await axios.get(`/api/portal/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchResults(res.data)
        setShowSearchDropdown(true)
      } catch (err) {
        console.error('Search query failed:', err)
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

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
        { label: 'Engineering Hub', href: '/portal/engineering', icon: HiOutlineCode },
      ],
    },
    {
      section: 'Sales & CRM',
      items: [
        { label: 'CRM & Pipeline', href: '/portal/crm', icon: HiOutlineUserGroup },
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
        ...(isSuperAdmin || isHrAdmin || isFinanceAdmin
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

        {/* User Card in Sidebar Bottom */}
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
            {/* Global Search */}
            <div className={styles.searchContainer} ref={searchRef}>
              <HiOutlineSearch className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Global search (Ctrl+K)..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults) setShowSearchDropdown(true)
                }}
              />
              <span className={styles.searchShortcut}>Ctrl+K</span>

              {/* Search Results Dropdown */}
              {showSearchDropdown && searchResults && (
                <div className={styles.searchDropdown}>
                  {isSearching && (
                    <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      Searching...
                    </div>
                  )}

                  {/* Navigation matches */}
                  {searchResults.navigation.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>Modules</div>
                      {searchResults.navigation.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className={styles.searchResultTitle}>{item.label}</span>
                          <span className={styles.searchResultMeta}>{item.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Project matches */}
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>Projects</div>
                      {searchResults.projects.map((p) => (
                        <Link
                          key={p.id}
                          href={p.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <div>
                            <div className={styles.searchResultTitle}>{p.title}</div>
                            <div className={styles.searchResultMeta}>{p.code} • {p.status}</div>
                          </div>
                          <span className={styles.searchResultMeta}>{p.progress}%</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Task matches */}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>Tasks</div>
                      {searchResults.tasks.map((t) => (
                        <Link
                          key={t.id}
                          href={t.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <div>
                            <div className={styles.searchResultTitle}>{t.title}</div>
                            <div className={styles.searchResultMeta}>{t.code} • {t.status}</div>
                          </div>
                          <span className={styles.searchResultMeta}>{t.priority}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Employee matches */}
                  {searchResults.employees.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>Employees</div>
                      {searchResults.employees.map((e) => (
                        <Link
                          key={e.id}
                          href={e.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <div>
                            <div className={styles.searchResultTitle}>{e.name}</div>
                            <div className={styles.searchResultMeta}>{e.designation} • {e.department}</div>
                          </div>
                          <span className={styles.searchResultMeta}>{e.employeeCode}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* CRM Lead matches */}
                  {searchResults.leads && searchResults.leads.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>CRM Leads</div>
                      {searchResults.leads.map((l) => (
                        <Link
                          key={l.id}
                          href={l.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <div>
                            <div className={styles.searchResultTitle}>{l.title}</div>
                            <div className={styles.searchResultMeta}>{l.code} • {l.contactName}</div>
                          </div>
                          <span className={styles.searchResultMeta}>{l.status}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Customer matches */}
                  {searchResults.customers && searchResults.customers.length > 0 && (
                    <div>
                      <div className={styles.searchGroupTitle}>Customers</div>
                      {searchResults.customers.map((c) => (
                        <Link
                          key={c.id}
                          href={c.href}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setShowSearchDropdown(false)
                            setSearchQuery('')
                          }}
                        >
                          <div>
                            <div className={styles.searchResultTitle}>{c.name}</div>
                            <div className={styles.searchResultMeta}>{c.code} {c.company ? `• ${c.company}` : ''}</div>
                          </div>
                          <span className={styles.searchResultMeta}>{c.status}</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.navigation.length === 0 &&
                    searchResults.projects.length === 0 &&
                    searchResults.tasks.length === 0 &&
                    searchResults.employees.length === 0 &&
                    (!searchResults.leads || searchResults.leads.length === 0) &&
                    (!searchResults.customers || searchResults.customers.length === 0) && (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.825rem' }}>
                        No records matching &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className={styles.popoverContainer} ref={notificationRef}>
              <button
                className={styles.iconBtn}
                title={`Notifications (${unreadCount} unread)`}
                onClick={toggleNotifications}
                aria-label="Open notifications center"
              >
                <HiOutlineBell />
                {unreadCount > 0 && <span className={styles.badgeDot} />}
              </button>

              {showNotifications && (
                <div className={styles.notificationPopover}>
                  <div className={styles.notificationHeader}>
                    <span>Notifications ({unreadCount} unread)</span>
                    {unreadCount > 0 && (
                      <button className={styles.markReadBtn} onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className={styles.notificationList}>
                    {loadingNotifications ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                        <HiOutlineCheck style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '0.25rem' }} />
                        <div>You are all caught up!</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>No new notifications</div>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`${styles.notificationItem} ${!n.isRead ? styles.notificationItemUnread : ''}`}
                          onClick={() => {
                            if (n.link) {
                              setShowNotifications(false)
                              router.push(n.link)
                            }
                          }}
                        >
                          <div className={styles.notificationTitle}>
                            <span>{n.title}</span>
                          </div>
                          <div className={styles.notificationMessage}>{n.message}</div>
                          <div className={styles.notificationTime}>
                            {new Date(n.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown Menu */}
            <div className={styles.popoverContainer} ref={profileRef}>
              <button
                className={styles.profileMenuTrigger}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu)
                  setShowNotifications(false)
                }}
                aria-label="User profile options"
              >
                <div className={styles.avatar} style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <HiOutlineChevronDown style={{ fontSize: '0.9rem', color: '#64748b' }} />
              </button>

              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileName}>{user?.name || 'Authorized User'}</div>
                    <div className={styles.profileEmail}>{user?.email}</div>
                    <span className={styles.profileRoleBadge}>{roleName}</span>
                  </div>

                  <Link
                    href="/portal/attendance"
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <HiOutlineClock style={{ fontSize: '1.1rem', color: '#64748b' }} />
                    <span>My Attendance & Time Clock</span>
                  </Link>

                  <Link
                    href="/portal/leaves"
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <HiOutlineCalendar style={{ fontSize: '1.1rem', color: '#64748b' }} />
                    <span>My Leave Requests</span>
                  </Link>

                  <Link
                    href="/portal/tasks"
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <HiOutlineClipboardList style={{ fontSize: '1.1rem', color: '#64748b' }} />
                    <span>My Assigned Tasks</span>
                  </Link>

                  {user?.employeeProfile?.employeeCode && (
                    <div style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9' }}>
                      Emp Code: <strong>{user.employeeProfile.employeeCode}</strong>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                    <button
                      className={styles.profileMenuItem}
                      style={{ color: '#dc2626' }}
                      onClick={handleLogout}
                    >
                      <HiOutlineLogout style={{ fontSize: '1.1rem' }} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  )
}
