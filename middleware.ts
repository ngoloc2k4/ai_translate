import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { checkRateLimit } from "@/lib/utils/rateLimit"
import { verifySessionToken } from "@/lib/utils/authSession"

const hasUpstashConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
const ratelimit = hasUpstashConfig
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
    })
  : null

/**
 * Next.js Middleware for Security, Authentication Gate & Rate Limiting
 */
export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const { pathname } = url

  const response = pathname.startsWith("/api/")
    ? await handleApiRoute(request, pathname)
    : NextResponse.next()

  // Standard Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

async function handleApiRoute(request: NextRequest, pathname: string) {
  const correctPassword = process.env.APP_PASSWORD
  const hasServerPassword = !!correctPassword

  // Skip auth checks for /api/auth endpoint itself
  if (pathname === "/api/auth") {
    return NextResponse.next()
  }

  // Check routes that require authentication when using server-side keys
  if (hasServerPassword) {
    if (
      pathname.startsWith("/api/translate") ||
      pathname.startsWith("/api/models") ||
      pathname.startsWith("/api/keys")
    ) {
      const sessionCookie = request.cookies.get("ai_translate_session")?.value
      const clientProvidedKey = request.nextUrl.searchParams.get("key") || undefined

      // If client provided their own key, no server auth needed
      const hasClientKey = !!clientProvidedKey && clientProvidedKey.trim().length > 0

      // If no client key AND session token is invalid, reject request
      if (!hasClientKey && !verifySessionToken(sessionCookie)) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: "Authentication required. Please login with password or provide your own API key in Settings.",
            requiresAuth: true,
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      }
    }
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"

  // Upstash Distributed Rate Limiting (if configured)
  if (pathname.startsWith("/api/translate") && ratelimit) {
    try {
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
    } catch (err) {
      console.error("[Middleware] Upstash Rate Limiter Error:", err)
    }
  }

  // Fallback / in-memory rate limiting check
  const { allowed, remaining, resetTime, limit } = checkRateLimit(ip, pathname)

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
          "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
        },
      }
    )
  }

  const response = NextResponse.next()

  response.headers.set("X-RateLimit-Limit", String(limit))
  response.headers.set("X-RateLimit-Remaining", String(remaining))
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetTime / 1000)))

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
