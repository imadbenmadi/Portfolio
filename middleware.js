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
    // Skip auth in local dev when DEV_SKIP_AUTH=true
    if (process.env.DEV_SKIP_AUTH === 'true') {
      return NextResponse.next()
    }

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
