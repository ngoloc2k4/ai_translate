import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { logError, logInfo, logSecurity } from "@/lib/utils/logger"

// Schema validation for API keys
const ApiKeysSchema = z.object({
  gemini: z.string().optional(),
  groq: z.string().optional(),
  nvidia: z.string().optional(),
  openrouter: z.string().optional(),
  custom: z.string().optional(),
  customEndpoint: z.string().url().optional().or(z.literal('')),
})

type ApiKeysInput = z.infer<typeof ApiKeysSchema>

/**
 * Server-Side API Keys Management
 * 
 * This endpoint allows administrators to set API keys that will be stored
 * in environment variables or a secure server-side storage (not in localStorage).
 * 
 * IMPORTANT: In production, these should be set via environment variables (.env.local)
 * This endpoint is primarily for development/testing purposes.
 */

export async function GET(req: NextRequest) {
  try {
    // Only return which providers have server-side keys configured (not the actual keys)
    const configuredProviders = {
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      nvidia: !!process.env.NVIDIA_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      custom: !!process.env.CUSTOM_API_KEY,
      customEndpoint: !!process.env.CUSTOM_API_ENDPOINT,
    }

    return NextResponse.json({
      success: true,
      data: configuredProviders,
    })
  } catch (error) {
    logError("Error fetching key status:", { error })
    return NextResponse.json(
      { error: "Failed to fetch key configuration" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const result = ApiKeysSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const keys = result.data

    // SECURITY WARNING: In production, keys should ONLY be set via environment variables
    // This endpoint logs the attempt but doesn't actually store keys dynamically
    if (process.env.NODE_ENV === 'production') {
      logSecurity("Attempted to set API keys via API in production", { reason: "use_env_vars" })
      return NextResponse.json(
        { 
          error: "Cannot set API keys via API in production",
          message: "Please set API keys in your .env.local file or environment variables"
        },
        { status: 403 }
      )
    }

    // In development, we can provide guidance but still don't store dynamically
    // Keys should be set in .env.local file
    logInfo("API Keys update requested", { providers: Object.keys(keys).filter(k => keys[k as keyof typeof keys]) })

    return NextResponse.json({
      success: true,
      message: "In development mode. Please set keys in .env.local file",
      data: {
        gemini: keys.gemini ? "configured" : "not_configured",
        groq: keys.groq ? "configured" : "not_configured",
        nvidia: keys.nvidia ? "configured" : "not_configured",
        openrouter: keys.openrouter ? "configured" : "not_configured",
        custom: keys.custom ? "configured" : "not_configured",
      },
    })
  } catch (error) {
    logError("Error updating API keys:", { error })
    return NextResponse.json(
      { error: "Failed to update API keys" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: "Cannot clear API keys via API in production" },
        { status: 403 }
      )
    }

    logInfo("API Keys clear requested", { env: "development" })

    return NextResponse.json({
      success: true,
      message: "In development mode. Please remove keys from .env.local file",
    })
  } catch (error) {
    logError("Error clearing API keys:", { error })
    return NextResponse.json(
      { error: "Failed to clear API keys" },
      { status: 500 }
    )
  }
}
