import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('st_auth')?.value
  const { pathname } = request.nextUrl

  // Portal routes protection
  if (pathname.startsWith('/portal')) {
    if (pathname === '/portal' || pathname === '/portal/') {
      return NextResponse.redirect(new URL('/portal/dashboard', request.url))
    }

    if (pathname === '/portal/login') {
      if (token) {
        return NextResponse.redirect(new URL('/portal/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // All other /portal/* routes require token
    if (!token) {
      const loginUrl = new URL('/portal/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes protection (Legacy CMS)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
}
