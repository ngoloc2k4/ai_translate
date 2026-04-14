import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js Middleware for Security and Rate Limiting (Next.js 16+)
 */

import { checkRateLimit } from "@/lib/utils/rateLimit"


export function proxy(request: NextRequest) {
  const url = new URL(request.url)
  const { pathname } = url
  
  const response = pathname.startsWith('/api/') 
    ? handleApiRoute(request, pathname)
    : NextResponse.next()

  // Add broad security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

function handleApiRoute(request: NextRequest, pathname: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown"
  
  const { allowed, remaining, resetTime, limit } = checkRateLimit(ip, pathname)
  
  if (!allowed) {
    return NextResponse.json(
      { 
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
        },
      }
    )
  }
  
  const response = NextResponse.next()
  
  // Set rate limit headers
  response.headers.set('X-RateLimit-Limit', String(limit))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)))
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

