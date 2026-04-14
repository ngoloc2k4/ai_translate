/**
 * Rate Limiting Utility
 * 
 * Centralized rate limiting logic to be used by middleware (proxy.ts)
 * and monitoring API routes.
 */

import { NextRequest } from "next/server"

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

const LIMITS: Record<string, number> = {
  '/api/translate': 20,
  '/api/validate-key': 5,
}
const DEFAULT_LIMIT = 10
const WINDOW_MS = 60 * 1000 // 1 minute

// Store for rate limit tracking
// In production, this should be moved to Redis or a similar persistent store
const requestCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Check if a request should be allowed based on rate limits.
 * 
 * @param ip Client IP address
 * @param path Request pathname
 */
export function checkRateLimit(ip: string, path: string): RateLimitResult {
  const now = Date.now()
  const limit = LIMITS[path] || DEFAULT_LIMIT
  const key = `${ip}:${path}`
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: limit - 1, resetTime: now + WINDOW_MS, limit }
  }

  const remaining = Math.max(0, limit - record.count)

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime, limit }
  }

  record.count++
  requestCounts.set(key, record)
  return { allowed: true, remaining: remaining - 1, resetTime: record.resetTime, limit }
}

/**
 * Reset rate limit for a specific IP address (for all paths).
 * Primarily used for development/testing.
 * 
 * @param ip Client IP address
 */
export function resetRateLimitForIp(ip: string) {
  for (const key of requestCounts.keys()) {
    if (key.startsWith(`${ip}:`)) {
      requestCounts.delete(key)
    }
  }
}

/**
 * Helper to extract IP and Path from NextRequest and check rate limit.
 */
export function checkRateLimitFromRequest(req: NextRequest): RateLimitResult {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
             req.headers.get("x-real-ip") || 
             "unknown"
  const pathname = new URL(req.url).pathname
  
  return checkRateLimit(ip, pathname)
}
