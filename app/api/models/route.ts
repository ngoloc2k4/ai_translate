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
    if (w === 'qwen') return 'Qwen';
    if (w === 'coder') return 'Coder';
    if (w === 'deepseek') return 'DeepSeek';
    if (w === 'riva') return 'Riva';
    if (w === 'translate') return 'Translate';
    
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
    const baseUrlParam = searchParams.get("baseUrl")
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
    const cacheKey = `${provider}:${clientKey ? 'custom' : 'default'}:${baseUrlParam || 'default'}`
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
        // NVIDIA NIM model catalog: fetched from official docs (https://docs.api.nvidia.com/nim/reference/llm-apis)
        // and merged with live endpoint (integrate.api.nvidia.com/v1/models or custom baseUrl)
        const headers: Record<string, string> = {
          Accept: "application/json",
        }
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`
        }

        // 1. Dynamic fetch from official NVIDIA NIM LLM APIs documentation
        const docModels: { id: string; name?: string }[] = []
        try {
          const docRes = await fetch("https://docs.api.nvidia.com/nim/reference/llm-apis", {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(6000),
          })
          if (docRes.ok) {
            const html = await docRes.text()
            const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((m) => {
              const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) =>
                c[1].replace(/<[^>]+>/g, "").trim()
              )
              return cells
            }).filter((r) => r.length >= 2)

            for (const r of rows) {
              const raw = r[0]
              const [vendor, ...rest] = raw.split("/").map((s) => s.trim())
              if (vendor && rest.length > 0) {
                const id = `${vendor}/${rest.join("/")}`
                docModels.push({ id, name: formatModelName(id) })
              }
            }
          }
        } catch (docErr) {
          logError("Failed to fetch NVIDIA docs models", { error: docErr })
        }

        // 2. Fetch live models from endpoint
        let nvidiaModelsUrl = "https://integrate.api.nvidia.com/v1/models"
        if (baseUrlParam) {
          let cleanBase = baseUrlParam.trim().replace(/\/+$/, "")
          if (cleanBase.endsWith("/chat/completions")) {
            cleanBase = cleanBase.slice(0, -"/chat/completions".length)
          }
          if (!cleanBase.endsWith("/v1")) {
            cleanBase = `${cleanBase}/v1`
          }
          nvidiaModelsUrl = `${cleanBase}/models`
        }

        const endpointModels: { id: string; name?: string }[] = []
        try {
          const res = await fetch(nvidiaModelsUrl, { headers, signal: AbortSignal.timeout(6000) })
          if (res.ok) {
            const json = (await res.json()) as OpenAiModelsResponse
            endpointModels.push(...(json.data || []))
          } else if (baseUrlParam) {
            // Fall back to default nvidia models url if custom endpoint fails
            const fallbackRes = await fetch("https://integrate.api.nvidia.com/v1/models", { headers, signal: AbortSignal.timeout(6000) })
            if (fallbackRes.ok) {
              const json = (await fallbackRes.json()) as OpenAiModelsResponse
              endpointModels.push(...(json.data || []))
            }
          }
        } catch (fetchErr) {
          logError("NVIDIA models fetch failed", { error: fetchErr })
        }

        // 3. Static full catalog from official docs (https://docs.api.nvidia.com/nim/reference/llm-apis)
        const staticDocCatalog: { id: string; name?: string }[] = [
          // Flagship Translation & Chat Models
          { id: "nvidia/riva-translate-4b-instruct-v2", name: "Riva Translate 4B v2 (Chuyên Dịch Thuật)" },
          { id: "nvidia/nemotron-3.5-lightning-30b-a3b", name: "Nemotron 3.5 Lightning 30B" },
          { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Llama 3.1 Nemotron 70B Instruct" },
          { id: "nvidia/llama-3.1-nemotron-ultra-253b-v1", name: "Llama 3.1 Nemotron Ultra 253B" },
          { id: "nvidia/llama-3.3-nemotron-super-49b-v1.5", name: "Llama 3.3 Nemotron Super 49B v1.5" },
          { id: "nvidia/llama-3.3-nemotron-super-49b-v1", name: "Llama 3.3 Nemotron Super 49B v1" },
          { id: "nvidia/nemotron-3-super-120b-a12b", name: "Nemotron 3 Super 120B" },
          { id: "nvidia/nemotron-3-ultra-550b-a55b", name: "Nemotron 3 Ultra 550B" },
          { id: "nvidia/nemotron-3-nano-30b-a3b", name: "Nemotron 3 Nano 30B" },
          { id: "nvidia/nvidia-nemotron-nano-9b-v2", name: "Nemotron Nano 9B v2" },
          // Meta Llama Series
          { id: "meta/llama-3.3-70b-instruct", name: "Meta Llama 3.3 70B Instruct" },
          { id: "meta/llama-3.1-70b-instruct", name: "Meta Llama 3.1 70B Instruct" },
          { id: "meta/llama-3.1-8b-instruct", name: "Meta Llama 3.1 8B Instruct" },
          { id: "meta/llama-3.2-3b-instruct", name: "Meta Llama 3.2 3B Instruct" },
          { id: "meta/llama-3.2-1b-instruct", name: "Meta Llama 3.2 1B Instruct" },
          { id: "meta/llama2-70b", name: "Meta Llama 2 70B" },
          // DeepSeek Series
          { id: "deepseek-ai/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash" },
          { id: "deepseek-ai/deepseek-v4-flash", name: "DeepSeek V4 Flash" },
          { id: "deepseek-ai/deepseek-v4-flash-0731", name: "DeepSeek V4 Flash 0731" },
          { id: "deepseek-ai/deepseek-v4-pro", name: "DeepSeek V4 Pro" },
          // Mistral Series
          { id: "mistralai/mistral-large-2-instruct", name: "Mistral Large 2 Instruct" },
          { id: "mistralai/mixtral-8x22b-instruct", name: "Mixtral 8x22B Instruct" },
          { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B Instruct" },
          { id: "mistralai/mistral-nemotron", name: "Mistral Nemotron" },
          // Qwen Series
          { id: "qwen/qwen2.5-coder-32b-instruct", name: "Qwen 2.5 Coder 32B Instruct" },
          { id: "qwen/qwen3-next-80b-a3b-instruct", name: "Qwen 3 Next 80B Instruct" },
          { id: "qwen/qwen3-next-80b-a3b-thinking", name: "Qwen 3 Next 80B Thinking" },
          { id: "qwen/qwq-32b", name: "Qwen QwQ 32B" },
          // Google Series
          { id: "google/gemma-3-12b-it", name: "Google Gemma 3 12B IT" },
          { id: "google/gemma-3-4b-it", name: "Google Gemma 3 4B IT" },
          { id: "google/gemma-4-31b-it", name: "Google Gemma 4 31B IT" },
          { id: "google/gemma-7b", name: "Google Gemma 7B" },
          { id: "google/codegemma-7b", name: "Google CodeGemma 7B" },
          // Microsoft Series
          { id: "microsoft/phi-4-mini-instruct", name: "Microsoft Phi 4 Mini Instruct" },
          { id: "microsoft/phi-4-mini-flash-reasoning", name: "Microsoft Phi 4 Mini Flash Reasoning" },
          // OpenAI Series
          { id: "openai/gpt-oss-120b", name: "OpenAI GPT OSS 120B" },
          { id: "openai/gpt-oss-20b", name: "OpenAI GPT OSS 20B" },
          // Partner LLMs
          { id: "01-ai/yi-large", name: "01.AI Yi Large" },
          { id: "z-ai/glm-5.3", name: "Z-AI GLM 5.3" },
          { id: "z-ai/glm-5.3-flash", name: "Z-AI GLM 5.3 Flash" },
          { id: "z-ai/glm-5.2", name: "Z-AI GLM 5.2" },
          { id: "z-ai/glm5.1", name: "Z-AI GLM 5.1" },
          { id: "z-ai/glm4.7", name: "Z-AI GLM 4.7" },
          { id: "moonshotai/kimi-k3", name: "Moonshot Kimi K3" },
          { id: "moonshotai/kimi-k2-instruct", name: "Moonshot Kimi K2 Instruct" },
          { id: "moonshotai/kimi-k2-thinking", name: "Moonshot Kimi K2 Thinking" },
          { id: "stepfun-ai/step-3.5-flash", name: "StepFun Step 3.5 Flash" },
          { id: "upstage/solar-10.7b-instruct", name: "Upstage Solar 10.7B Instruct" },
          { id: "minimaxai/minimax-m2.7", name: "MiniMax M2.7" },
          { id: "minimaxai/minimax-m2.5", name: "MiniMax M2.5" },
          { id: "sarvamai/sarvam-m", name: "Sarvam AI Sarvam M" },
          { id: "stockmark/stockmark-2-100b-instruct", name: "Stockmark 2 100B Instruct" },
          { id: "poolside/laguna-xs-2-1", name: "Poolside Laguna XS 2.1" },
          { id: "thinking machines/inkling", name: "Thinking Machines Inkling" },
        ]

        // 4. Merge all sources by ID
        const mergedMap = new Map<string, { id: string; name?: string }>()
        for (const m of staticDocCatalog) {
          mergedMap.set(m.id, m)
        }
        for (const m of docModels) {
          mergedMap.set(m.id, m)
        }
        for (const m of endpointModels) {
          if (!mergedMap.has(m.id)) {
            mergedMap.set(m.id, m)
          }
        }

        const rawModels = Array.from(mergedMap.values())

        // Priority models placed at the top of the dropdown
        const priorityNvidia = [
          "nvidia/riva-translate-4b-instruct-v2",
          "nvidia/nemotron-3.5-lightning-30b-a3b",
          "meta/llama-3.3-70b-instruct",
          "deepseek-ai/deepseek-v4.1-flash",
          "deepseek-ai/deepseek-v4-flash",
          "mistralai/mistral-large-2-instruct",
          "qwen/qwen2.5-coder-32b-instruct",
          "google/gemma-3-12b-it",
          "meta/llama-3.1-70b-instruct",
          "meta/llama-3.1-8b-instruct",
          "01-ai/yi-large",
          "openai/gpt-oss-20b",
          "z-ai/glm-5.3",
          "nvidia/llama-3.1-nemotron-70b-instruct",
        ]

        const filtered = rawModels.filter((m) => {
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

        models = filtered.map((m) => {
          let name = m.name || formatModelName(m.id)
          if (m.id === "nvidia/riva-translate-4b-instruct-v2") {
            name = "Riva Translate 4B v2 (Chuyên Dịch Thuật)"
          }
          return {
            id: m.id,
            name,
          }
        })
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
