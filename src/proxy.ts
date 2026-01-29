// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const theme = "th_3"

  if (
    pathname === "/default" ||
    pathname === "/theme_1" ||
    pathname === "/th_2" ||
    pathname === "/th_3"
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pathname === "/about") {
    return NextResponse.rewrite(new URL(`/${theme}/about`, request.url))
  }

  if (pathname === "/contact") {
    return NextResponse.rewrite(new URL(`/${theme}/contact`, request.url))
  }

  if (pathname === "/terms") {
    return NextResponse.rewrite(new URL(`/${theme}/terms`, request.url))
  }
  if (pathname === "/privacy") {
    return NextResponse.rewrite(new URL(`/${theme}/privacy`, request.url))
  }
  if (pathname === "/shop") {
    return NextResponse.rewrite(new URL(`/${theme}/shop`, request.url))
  }

  if (pathname === "/checkout") {
    return NextResponse.rewrite(new URL(`/${theme}/checkout`, request.url))
  }

  if (pathname.startsWith("/product/")) {
    return NextResponse.rewrite(new URL(`/${theme}${pathname}`, request.url))
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL(`/${theme}`, request.url))
  }

  // If the condition is not met, let the request proceed to the default '/' page
  return NextResponse.next()
}

// Configure the matcher to run the middleware on the root path
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
