import { NextRequest, NextResponse } from "next/server"
import { createParser } from "eventsource-parser"
import { buildPrompt, getTemperature } from "@/lib/ai/prompt/buildPrompt"
import { callProvider } from "@/lib/ai/providers"
import { validateApiKeyAsync, getApiKeyToUse } from "@/lib/utils/validateKey"
import { sanitizeInput, sanitizeLanguageCode, sanitizeProvider, sanitizeModel, detectPromptInjection } from "@/lib/utils/sanitizeInput"
import { logRequest, logAuth, logSecurity, logError } from "@/lib/utils/logger"

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

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await req.json()

    let {
      text,
      sourceLang,
      targetLang,
      provider,
      model,
      apiKey: clientApiKey,
      options,
      baseUrl,
    } = body

    // Log request
    logRequest({
      method: 'POST',
      path: '/api/translate',
      ip: req.headers.get("x-forwarded-for") || 'unknown',
      provider,
      model,
      userAgent: req.headers.get("user-agent") || undefined,
    })

    // Validate input
    if (!text || !targetLang) {
      logAuth('failure', { provider, reason: 'missing_input' })
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    // Sanitize all inputs
    text = sanitizeInput(text)
    sourceLang = sanitizeLanguageCode(sourceLang)
    targetLang = sanitizeLanguageCode(targetLang)
    provider = sanitizeProvider(provider)
    model = sanitizeModel(model)

    // Detect potential prompt injection
    if (detectPromptInjection(text)) {
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
      logSecurity('Potential prompt injection detected', { ip, provider })
    }

    // Check if client provided their own API key
    const hasClientKey = !!clientApiKey && clientApiKey.trim().length > 0
    
    // If no client key, check if user is authenticated to use server-side keys
    if (!hasClientKey) {
      const isAuthed = isAuthenticated(req)
      if (!isAuthed) {
        logAuth('failure', { provider, reason: 'no_auth_for_server_key' })
        return NextResponse.json({ 
          error: "Authentication required to use server-side API keys. Please login or provide your own API key in Settings." 
        }, { status: 401 })
      }
    }

    // Validate API key
    const isValidKey = await validateApiKeyAsync(provider, clientApiKey)
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Get the API key to use
    const apiKey = getApiKeyToUse(provider, clientApiKey)
    if (!apiKey) {
      logAuth('failure', { provider, reason: 'no_api_key_available' })
      return NextResponse.json({ error: "No API key configured" }, { status: 500 })
    }

    // Build prompt
    const prompt = buildPrompt({
      text,
      sourceLang,
      targetLang,
      tone: options?.tone,
      mode: options?.mode,
      creativity: options?.creativity,
    })

    const temperature = options?.temperature ?? getTemperature(options?.creativity)

    // Call provider
    const rawStream = await callProvider({
      provider,
      model,
      apiKey,
      systemPrompt: prompt.system,
      userPrompt: prompt.user,
      temperature,
      baseUrl: provider === "custom" ? baseUrl : undefined,
    })

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let accumulatedText = ""

    const transformedStream = new ReadableStream({
      async start(controller) {
        const streamParser = createParser({
          onEvent: (event) => {
            const data = event.data
            if (data === "[DONE]") {
              controller.close()
              return
            }

            try {
              const parsed = JSON.parse(data)
              let content = ""

              // Groq/OpenAI/NVIDIA format
              if (parsed.choices?.[0]?.delta?.content) {
                content = parsed.choices[0].delta.content
              } 
              // Gemini format (if channeled through SSE proxy or similar)
              else if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
                content = parsed.candidates[0].content.parts[0].text
              }

              if (content) {
                accumulatedText += content
                controller.enqueue(encoder.encode(content))
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        })

        try {
          const reader = rawStream.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }
            streamParser.feed(decoder.decode(value, { stream: true }))
          }
        } catch (err) {
          controller.error(err)
        }
      }
    })

    logAuth('success', { provider, source: clientApiKey ? 'client' : 'server' })
    return new NextResponse(transformedStream)

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Translation failed"
    logError("Translation API endpoint error", { error: errorMessage })
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
