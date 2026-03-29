import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "../rate-limit"

const RATE_LIMIT = 10 // requests per minute

export async function POST(req: NextRequest) {
  // Check rate limit first
  const rateLimitResult = checkRateLimit(req, RATE_LIMIT)
  
  if (!rateLimitResult.isAllowed) {
    return NextResponse.json(
      { 
        error: "Rate limit exceeded",
        message: `Too many requests. Please try again after ${new Date(rateLimitResult.resetTime).toLocaleTimeString()}`,
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    )
  }

  try {
    const body = await req.json()
    const { text, provider } = body

    // Validate input
    if (!text || !provider) {
      return NextResponse.json(
        { error: "Missing required fields: text, provider" },
        { status: 400 }
      )
    }

    // Simulate validation (in real scenario, this would validate against the provider)
    const isValid = true // Replace with actual validation logic

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        provider,
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
      },
    })
  } catch (error) {
    console.error("Validation error:", error)
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 }
    )
  }
}
