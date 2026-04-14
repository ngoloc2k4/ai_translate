import { NextRequest, NextResponse } from "next/server"
import { validateApiKeyAsync } from "@/lib/utils/validateKey"
import { logAuth, logError } from "@/lib/utils/logger"

// The proxy (middleware) handles rate limiting now
// We can still keep a local limit for this specific sensitive route if desired
const RATE_LIMIT_FOR_VALIDATION = 5 // stricter limit for validation attempts

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, provider } = body

    // Validate input
    if (!key || !provider) {
      return NextResponse.json(
        { error: "Missing required fields: key, provider" },
        { status: 400 }
      )
    }

    // Call actual validation logic that talks to providers
    const isValid = await validateApiKeyAsync(provider, key)

    if (!isValid) {
      logAuth('failure', { provider, reason: 'invalid_key' })
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    logAuth('success', { provider, source: 'validation_check' })
    
    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        provider,
      },
    })
  } catch (error) {
    logError("Validation route error:", { error })
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 }
    )
  }
}

