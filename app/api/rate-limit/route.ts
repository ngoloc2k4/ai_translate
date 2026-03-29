import { NextRequest, NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limiting store (for demo purposes)
// TODO: Replace with Redis for production
const rateLimitStore = new Map<string, RateLimitEntry>()

const DEFAULT_LIMIT = 10 // requests per minute
const WINDOW_MS = 60 * 1000 // 1 minute window

/**
 * Rate Limiting Middleware
 * 
 * Implements sliding window rate limiting per IP address.
 * 
 * @param req - Next.js request object
 * @param limit - Maximum requests allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns Object with isAllowed status and remaining requests
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = WINDOW_MS
): { isAllowed: boolean; remaining: number; resetTime: number } {
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("x-real-ip") || 
             "unknown"
  
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  
  // If no entry or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    })
    
    return {
      isAllowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    }
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      isAllowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }
  
  // Increment counter
  entry.count++
  rateLimitStore.set(ip, entry)
  
  return {
    isAllowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

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
  
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("x-real-ip") || 
             "unknown"
  
  rateLimitStore.delete(ip)
  
  return NextResponse.json({
    success: true,
    message: "Rate limit reset successfully",
  })
}
