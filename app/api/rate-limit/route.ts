import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, resetRateLimitForIp } from "../rate-limit"

/**
 * Rate Limiting API Route Handler
 * 
 * Can be called from client-side to check rate limit status
 */
export async function GET(req: NextRequest) {
  const result = checkRateLimit(req)
  
  return NextResponse.json({
    success: true,
    data: {
      isAllowed: result.isAllowed,
      remaining: result.remaining,
      resetTime: new Date(result.resetTime).toISOString(),
    },
  })
}

/**
 * Reset rate limit for testing purposes (development only)
 */
export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: "Cannot reset rate limits in production" },
      { status: 403 }
    )
  }
  
  resetRateLimitForIp(req)
  
  return NextResponse.json({
    success: true,
    message: "Rate limit reset successfully",
  })
}
