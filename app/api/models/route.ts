import { NextRequest, NextResponse } from "next/server"
import { getApiKeyToUse } from "@/lib/utils/validateKey"
import { logError } from "@/lib/utils/logger"
import { verifySessionToken } from "@/lib/utils/authSession"

/**
 * Check if user is authenticated via session cookie
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get("ai_translate_session")?.value
  const correctPassword = process.env.APP_PASSWORD
  
  // If no password is set on server, no authentication needed
  if (!correctPassword) return true
  
  // Check if session token is valid and signed
  return await verifySessionToken(sessionCookie)
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

/**
 * Format a model ID into a readable name
 * e.g., "llama-3.1-8b-instant" -> "Llama 3.1 8B Instant"
 */
function formatModelName(id: string): string {
  const parts = id.split('/');
  let name = parts[parts.length - 1];
  const isFree = name.endsWith(':free');
  if (isFree) {
    name = name.replace(/:free$/, '');
  }

  const formatted = name.split(/[-_]/).map(word => {
    const w = word.toLowerCase();
    if (w === 'llama') return 'Llama';
    if (w === 'gpt') return 'GPT';
    if (w === 'mixtral') return 'Mixtral';
    if (w === 'mistral') return 'Mistral';
    if (w === 'nemotron') return 'Nemotron';
    if (w === 'instruct') return 'Instruct';
    if (w === 'versatile') return 'Versatile';
    if (w === 'instant') return 'Instant';
    if (w === 'vision') return 'Vision';
    if (w === 'preview') return 'Preview';
    if (w === 'pro') return 'Pro';
    if (w === 'flash') return 'Flash';
    
    // e.g. 8b, 70b, 405b
    if (/^\d+(\.\d+)?b$/.test(w)) return w.toUpperCase();
    
    // e.g. 8x7b
    if (/^\d+x\d+b$/.test(w)) return w.replace('x', 'x').replace('b', 'B');

    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  return isFree ? `${formatted} (Free)` : formatted;
}

// In-memory cache for dynamic provider models to keep UI ultra-fast and prevent rate-limiting
interface CachedModels {
  timestamp: number
  models: { id: string; name: string }[]
}

const modelsCache = new Map<string, CachedModels>()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const provider = searchParams.get("provider")
    const refresh = searchParams.get("refresh") === "true"
    const clientKey =
      req.headers.get("x-api-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      searchParams.get("key") ||
      undefined

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 })
    }

    if (provider === "custom") {
      return NextResponse.json({ data: [] })
    }

    // Return cached models if available and not requesting explicit refresh
    const cacheKey = `${provider}:${clientKey ? 'custom' : 'default'}`
    const cached = modelsCache.get(cacheKey)
    if (!refresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ data: cached.models, cached: true })
    }

    const apiKey = getApiKeyToUse(provider, clientKey)

    let models: { id: string; name: string }[] = []

    switch (provider) {
      case "openrouter": {
        // OpenRouter models endpoint is completely public and lists all available models
        const headers: Record<string, string> = {
          "HTTP-Referer": "https://ai-translate-lab.vercel.app",
          "X-Title": "AI Translate Lab",
        }
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`
        }

        const res = await fetch("https://openrouter.ai/api/v1/models", { headers })
        if (!res.ok) {
          throw new Error(`OpenRouter models API returned ${res.status}`)
        }

        const json = (await res.json()) as OpenAiModelsResponse
        const rawModels = json.data || []

        // Popular models to highlight right after free models
        const popularOpenRouter = [
          "google/gemini-2.0-flash-001",
          "deepseek/deepseek-chat",
          "meta-llama/llama-3.3-70b-instruct",
          "anthropic/claude-3.5-sonnet",
          "openai/gpt-4o",
          "qwen/qwen-2.5-72b-instruct",
          "mistralai/mistral-large-2411",
        ]

        // Sort: Free models (:free) first, then popular, then alphabetical
        const sorted = rawModels.slice().sort((a, b) => {
          const aFree = a.id.endsWith(":free")
          const bFree = b.id.endsWith(":free")

          // Prioritize free models
          if (aFree && !bFree) return -1
          if (!aFree && bFree) return 1

          // Within free models, prioritize minimax/minimax-m3.1-flash:free
          if (aFree && bFree) {
            if (a.id.includes("minimax-m3.1-flash")) return -1
            if (b.id.includes("minimax-m3.1-flash")) return 1
            return a.id.localeCompare(b.id)
          }

          // Then popular non-free models
          const aPop = popularOpenRouter.indexOf(a.id)
          const bPop = popularOpenRouter.indexOf(b.id)
          if (aPop !== -1 && bPop === -1) return -1
          if (aPop === -1 && bPop !== -1) return 1
          if (aPop !== -1 && bPop !== -1) return aPop - bPop

          // Then alphabetical
          return a.id.localeCompare(b.id)
        })

        models = sorted.map((m) => ({
          id: m.id,
          name: m.name || formatModelName(m.id),
        }))
        break
      }

      case "nvidia": {
        // NVIDIA NIM model catalog is completely public on integrate.api.nvidia.com
        const headers: Record<string, string> = {
          Accept: "application/json",
        }
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`
        }

        const res = await fetch("https://integrate.api.nvidia.com/v1/models", { headers })
        if (!res.ok) {
          throw new Error(`NVIDIA models API returned ${res.status}`)
        }

        const json = (await res.json()) as OpenAiModelsResponse
        const rawModels = json.data || []

        // Known EOL or deprecated models on integrate.api.nvidia.com
        const eolModels = [
          "meta/llama-3.1-70b-instruct",
          "meta/llama-3.1-8b-instruct",
          "meta/llama-3.3-70b-instruct",
          "deepseek-ai/deepseek-r1",
        ]

        // Flagship active chat models to place at the top
        const priorityNvidia = [
          "nvidia/llama-3.1-nemotron-70b-instruct",
          "mistralai/mistral-large-2-instruct",
          "deepseek-ai/deepseek-v4.1-flash",
          "google/gemma-3-12b-it",
          "nvidia/riva-translate-4b-instruct-v2",
          "mistralai/mixtral-8x22b-v0.1",
          "01-ai/yi-large",
        ]

        const filtered = rawModels.filter((m) => {
          if (eolModels.includes(m.id)) return false
          const id = m.id.toLowerCase()
          return (
            !id.includes("embed") &&
            !id.includes("rerank") &&
            !id.includes("clip") &&
            !id.includes("bge-") &&
            !id.includes("audio") &&
            !id.includes("reward") &&
            !id.includes("parse") &&
            !id.includes("video") &&
            !id.includes("guard") &&
            !id.includes("synthetic") &&
            !id.includes("deplot") &&
            !id.includes("kosmos")
          )
        })

        // Sort priority models first, then alphabetical
        filtered.sort((a, b) => {
          const aIndex = priorityNvidia.indexOf(a.id)
          const bIndex = priorityNvidia.indexOf(b.id)
          if (aIndex !== -1 && bIndex === -1) return -1
          if (aIndex === -1 && bIndex !== -1) return 1
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
          return a.id.localeCompare(b.id)
        })

        models = filtered.map((m) => ({
          id: m.id,
          name: formatModelName(m.id),
        }))
        break
      }

      case "groq": {
        if (apiKey) {
          const res = await fetch("https://api.groq.com/openai/v1/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          })
          if (res.ok) {
            const json = (await res.json()) as OpenAiModelsResponse
            models = (json.data || [])
              .filter(
                (m) =>
                  !m.id.includes("whisper") &&
                  !m.id.includes("guard") &&
                  !["mixtral-8x7b-32768", "llama2-70b-4096", "gemma-7b-it"].includes(m.id)
              )
              .map((m) => ({ id: m.id, name: formatModelName(m.id) }))
          }
        }

        // If no key or fetch failed, provide active Groq model lineup
        if (models.length === 0) {
          models = [
            { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
            { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
            { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
            { id: "gemma2-9b-it", name: "Gemma 2 9B" },
            { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B" },
            { id: "qwen-qwq-32b", name: "Qwen QwQ 32B" },
          ]
        }
        break
      }

      case "gemini": {
        if (apiKey) {
          const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
            headers: { "x-goog-api-key": apiKey },
          })
          if (res.ok) {
            const json = (await res.json()) as GeminiModelsResponse
            models = (json.models || [])
              .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
              .map((m) => {
                const id = m.name.replace("models/", "")
                return {
                  id,
                  name: m.displayName || id,
                }
              })
          }
        }

        // If no key or fetch failed, provide active Gemini model lineup
        if (models.length === 0) {
          models = [
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
            { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
            { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
            { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
            { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
          ]
        }
        break
      }
    }

    // Save to server-side cache if non-empty
    if (models.length > 0) {
      modelsCache.set(cacheKey, { timestamp: Date.now(), models })
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
