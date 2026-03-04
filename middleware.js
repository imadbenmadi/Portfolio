import { NextResponse } from 'next/server'

const COOKIE_NAME = 'portfolio_admin_token'

/**
 * Protect all /dashboard/admin/* routes at the edge.
 * Full JWT verification happens inside each page's getServerSideProps.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only protect /dashboard/admin paths
  if (pathname.startsWith('/dashboard/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      const loginUrl = new URL('/dashboard', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/admin/:path*']
}
