import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
const ratelimit = hasUpstashConfig ? new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
}) : null;


/**
 * Next.js Middleware for Security and Rate Limiting (Next.js 16+)
 */

import { checkRateLimit } from "@/lib/utils/rateLimit"


export async function proxy(request: NextRequest) {
  const url = new URL(request.url)
  const { pathname } = url

  const response = pathname.startsWith('/api/')
    ? await handleApiRoute(request, pathname)
    : NextResponse.next()

  // Add broad security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

async function handleApiRoute(request: NextRequest, pathname: string) {
  // 1. Session Authentication Check
  const correctUsername = process.env.APP_USERNAME
  const correctPassword = process.env.APP_PASSWORD

  // Skip auth checks for /api/auth and generic /api/ test routes if any
  if (pathname !== "/api/auth" && correctUsername && correctPassword) {
    if (pathname.startsWith('/api/translate') || pathname.startsWith('/api/models') || pathname.startsWith('/api/keys')) {
      const sessionCookie = request.cookies.get("ai_translate_session")?.value

      if (sessionCookie !== correctPassword) {
        return new NextResponse(
          JSON.stringify({ success: false, error: "You don't have API, please fill it in settings." }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"

  if (pathname.startsWith("/api/translate")) {
    try {
      if (!ratelimit) {
        console.warn("[Proxy.ts] Missing UPSTASH_REDIS_REST_URL. Upstash Rate Limiter disabled.")
      } else {
        const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`)
        if (!success) {
          return new NextResponse("Rate limited. Too many requests.", {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          })
        }
      }
    } catch (err) {
      console.error("Upstash Rate Limiter Error:", err)
    }
  }

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

