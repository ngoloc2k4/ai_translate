import { NextRequest, NextResponse } from "next/server"
import { buildPrompt, getTemperature } from "@/lib/ai/prompt/buildPrompt"
import { callProvider } from "@/lib/ai/providers"
import { validateApiKeyAsync, getApiKeyToUse } from "@/lib/utils/validateKey"
import { sanitizeInput, sanitizeLanguageCode, sanitizeProvider, sanitizeModel, detectPromptInjection } from "@/lib/utils/sanitizeInput"
import { logRequest, logAuth, logSecurity } from "@/lib/utils/logger"
import { checkRateLimit } from "@/app/api/rate-limit"
import type { TranslationOutput } from "@/lib/ai/prompt/jsonOutputSchema"
import { checkRateLimit } from "@/app/api/rate-limit"

const TRANSLATE_RATE_LIMIT = 20 // requests per minute

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  
  // Check rate limit first
  const rateLimitResult = checkRateLimit(req, TRANSLATE_RATE_LIMIT)
  
  if (!rateLimitResult.isAllowed) {
    logSecurity('Rate limit exceeded', { 
      ip: req.headers.get("x-forwarded-for") || 'unknown',
      resetTime: rateLimitResult.resetTime,
    })
    
    return NextResponse.json(
      { 
        error: "Rate limit exceeded",
        message: `Too many requests. Please try again after ${new Date(rateLimitResult.resetTime).toLocaleTimeString()}`,
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': TRANSLATE_RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    )
  }
  
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

    // Detect potential prompt injection (log only, don't block)
    if (detectPromptInjection(text)) {
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
      logSecurity('Potential prompt injection detected', { ip, provider })
    }

    // Validate API key asynchronously with provider
    const isValidKey = await validateApiKeyAsync(provider, clientApiKey)
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Get the API key to use (server-side or client-provided)
    const apiKey = getApiKeyToUse(provider, clientApiKey)
    if (!apiKey) {
      logAuth('failure', { provider, reason: 'no_api_key_available' })
      return NextResponse.json({ error: "No API key configured" }, { status: 500 })
    }

    // Build prompt with JSON output instruction
    const prompt = buildPrompt({
      text,
      sourceLang,
      targetLang,
      tone: options?.tone,
      mode: options?.mode,
      creativity: options?.creativity,
    })

    // Get temperature based on creativity
    const temperature = options?.temperature ?? getTemperature(options?.creativity)

    // Call provider and get raw stream
    const rawStream = await callProvider({
      provider,
      model,
      apiKey,
      systemPrompt: prompt.system,
      userPrompt: prompt.user,
      temperature,
      baseUrl: provider === "custom" ? baseUrl : undefined,
    })

    console.log(`[${provider}] Stream received, processing...`)

    // Create transformed stream that parses SSE and extracts content
    const reader = rawStream.getReader()
    const encoder = new TextEncoder()
    let accumulatedText = ""
    let chunkCount = 0

    const transformedStream = new ReadableStream({
      async start(controller) {
        try {
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }

            // Decode and buffer the chunk
            const decoded = new TextDecoder().decode(value)
            chunkCount++

            buffer += decoded

            // Process complete lines
            const lines = buffer.split("\n")
            buffer = lines.pop() || "" // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmedLine = line.trim()

              // Skip empty lines
              if (!trimmedLine) continue

              // Handle SSE format: data: {...}
              if (trimmedLine.startsWith("data: ")) {
                const data = trimmedLine.slice(6)
                if (data === "[DONE]") {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)

                  // Groq/OpenAI format: choices[0].delta.content
                  const content = parsed.choices?.[0]?.delta?.content || ""
                  if (content) {
                    accumulatedText += content
                    controller.enqueue(encoder.encode(content))
                    continue
                  }

                  // Gemini format: candidates[0].content.parts[0].text
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ""
                  if (text) {
                    accumulatedText += text
                    controller.enqueue(encoder.encode(text))
                  }
                } catch (e) {
                  // Ignore parse errors for non-JSON data
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream processing error:", err)
          console.log(`[${provider}] Total chunks: ${chunkCount}, Accumulated text length: ${accumulatedText.length}`)
          if (!accumulatedText) {
            controller.error(err)
          } else {
            controller.close()
          }
        } finally {
          console.log(`[${provider}] Stream complete. Total text: ${accumulatedText.length} chars`)
        }
      },
      cancel() {
        reader.cancel()
      },
    })

    // Return transformed streaming response
    const response = new NextResponse(transformedStream)
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', TRANSLATE_RATE_LIMIT.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    
    // Log successful response
    logAuth('success', { provider, source: clientApiKey ? 'client' : 'server' })
    
    return response
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Translation failed"
    const duration = Date.now() - startTime
    
    // Log error with structured logging
    console.error("Translation error:", errorMessage)
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
