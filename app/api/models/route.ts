import { NextRequest, NextResponse } from "next/server"
import { getApiKeyToUse } from "@/lib/utils/validateKey"
import { logError } from "@/lib/utils/logger"

/**
 * Check if user is authenticated via session cookie
 */
function isAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("ai_translate_session")?.value
  const correctPassword = process.env.APP_PASSWORD
  
  // If no password is set on server, no authentication needed
  if (!correctPassword) return true
  
  // Check if session cookie matches the password
  return sessionCookie === correctPassword
}

/**
 * Common schema for standard OpenAI-compatible `/models` response
 */
interface OpenAiModelsResponse {
  data: {
    id: string
    created?: number
    object?: string
    owned_by?: string
    name?: string
  }[]
}

/**
 * Schema for Gemini `/models` response
 */
interface GeminiModelsResponse {
  models: {
    name: string
    version: string
    displayName: string
    description: string
    inputTokenLimit: number
    outputTokenLimit: number
    supportedGenerationMethods: string[]
  }[]
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const provider = searchParams.get("provider")
    const clientKey = searchParams.get("key") || undefined

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 })
    }

    if (provider === "custom") {
      return NextResponse.json({ data: [] })
    }

    // Check if client provided their own API key
    const hasClientKey = !!clientKey && clientKey.trim().length > 0
    
    // If no client key, check if user is authenticated to use server-side keys
    if (!hasClientKey) {
      const isAuthed = isAuthenticated(req)
      if (!isAuthed) {
        // User is not authenticated and didn't provide their own key
        // Return empty data - frontend will fallback to static lists
        return NextResponse.json({ data: [], requiresAuth: true })
      }
    }

    const apiKey = getApiKeyToUse(provider, clientKey)
    if (!apiKey) {
      // If no valid API key (neither server nor client), we can't fetch models. 
      // It's ok, the frontend will fallback to static lists.
      return NextResponse.json({ data: [] })
    }

    let models: { id: string, name: string }[] = []

    switch (provider) {
      case "gemini": {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          return NextResponse.json({ error: "Invalid Gemini API Key" }, { status: 401 })
        }
        if (!res.ok) throw new Error(`Gemini API returned ${res.status}`)
        const json = (await res.json()) as GeminiModelsResponse
        models = json.models
          .filter(m => m.supportedGenerationMethods.includes("generateContent"))
          .map(m => {
            const id = m.name.replace("models/", "")
            return {
               id,
               name: m.displayName || id
            }
          })
        break
      }
      case "groq": {
        const res = await fetch(`https://api.groq.com/openai/v1/models`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        })
        if (res.status === 401 || res.status === 403) {
          return NextResponse.json({ error: "Invalid Groq API Key" }, { status: 401 })
        }
        if (!res.ok) throw new Error(`Groq API returned ${res.status}`)
        const json = (await res.json()) as OpenAiModelsResponse
        models = json.data.map(m => ({ id: m.id, name: m.id }))
        break
      }
      case "nvidia": {
        const res = await fetch(`https://integrate.api.nvidia.com/v1/models`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        })
        if (res.status === 401 || res.status === 403) {
          return NextResponse.json({ error: "Invalid NVIDIA API Key" }, { status: 401 })
        }
        if (!res.ok) throw new Error(`NVIDIA API returned ${res.status}`)
        const json = (await res.json()) as OpenAiModelsResponse
        models = json.data.map(m => ({ id: m.id, name: m.id }))
        break
      }
      case "openrouter": {
        const res = await fetch(`https://openrouter.ai/api/v1/models`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        })
        if (res.status === 401 || res.status === 403) {
          return NextResponse.json({ error: "Invalid OpenRouter API Key" }, { status: 401 })
        }
        if (!res.ok) throw new Error(`OpenRouter API returned ${res.status}`)
        const json = (await res.json()) as OpenAiModelsResponse
        models = json.data.map(m => ({ id: m.id, name: m.name || m.id }))
        break
      }
    }

    return NextResponse.json({ data: models })

  } catch (error) {
    logError("Error fetching provider models", { error })
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    )
  }
}
