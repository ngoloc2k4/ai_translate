import { NextRequest, NextResponse } from "next/server"
import {
  createSessionToken,
  verifyCredentials,
  getSessionDetails,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/utils/authSession"
import { checkRateLimit } from "@/lib/utils/rateLimit"
import { logSecurity } from "@/lib/utils/logger"

/**
 * GET /api/auth
 * Check active session status and token expiration
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const details = await getSessionDetails(token)

    return NextResponse.json({
      success: true,
      authenticated: details.valid,
      expiresAt: details.expiresAt,
      issuedAt: details.issuedAt,
      configured: !!process.env.APP_PASSWORD,
      hasUsernameConfigured: !!process.env.APP_USERNAME,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to verify session" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth
 * Authenticate with username and password, create session cookie
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limit to prevent brute-force attacks (5 attempts / minute)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1"
    
    const rateLimit = checkRateLimit(ip, "/api/auth")
    if (!rateLimit.allowed) {
      logSecurity("auth_rate_limit_exceeded", { ip })
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please wait 1 minute before trying again.",
        },
        {
          status: 429,
          headers: { "Retry-After": retryAfterSeconds.toString() },
        }
      )
    }

    // 2. Parse body
    const body = await request.json().catch(() => ({}))
    const { username, password } = body

    // 3. Verify credentials in constant time
    const verification = verifyCredentials(password, username)
    if (!verification.success) {
      logSecurity("auth_failure", { ip, reason: verification.error })
      return NextResponse.json(
        { success: false, error: verification.error || "Invalid username or password" },
        { status: 401 }
      )
    }

    // 4. Generate signed session token
    const token = await createSessionToken()
    const sessionDetails = await getSessionDetails(token)

    logSecurity("auth_success", { ip })

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully",
      expiresAt: sessionDetails.expiresAt,
    })

    // 5. Set hardened HTTP-only session cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth
 * Logout endpoint - clear session cookie immediately
 */
export async function DELETE(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"

  logSecurity("auth_logout", { ip })

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  // Invalidate cookie immediately
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    expires: new Date(0),
  })

  return response
}
