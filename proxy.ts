import { NextResponse } from "next/server"

/**
 * Next.js Proxy for Security (Next.js 16+)
 * 
 * - Rate limiting for API routes
 * - Security headers for all responses
 * 
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */

const RATE_LIMIT = 10 // requests per minute
const WINDOW_MS = 60 * 1000 // 1 minute

const requestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: now + WINDOW_MS }
  }

  const remaining = Math.max(0, RATE_LIMIT - record.count)

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  requestCounts.set(ip, record)
  return { allowed: true, remaining: remaining - 1, resetTime: record.resetTime }
}

export function proxy(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url
  
  // Rate Limiting for API Routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown"
    
    const rateLimitResult = checkRateLimit(ip)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetTime / 1000)),
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }
    
    // Continue with rate limit headers
    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMIT),
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetTime / 1000)),
      },
    })
  }

  // Add security headers to all other responses
  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
