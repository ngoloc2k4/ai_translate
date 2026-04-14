import { logAuth } from "@/lib/utils/logger"
import type { ProviderParams } from "@/types"

const PROVIDER_TIMEOUT_MS = 30_000

export async function translateOpenRouter({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
}: ProviderParams): Promise<ReadableStream> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/ngoloc2k4/ai_translate",
        "X-Title": "AI Translate Lab",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        stream: true,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      const msg = error.error?.message || "OpenRouter API error"
      logAuth('failure', { provider: 'openrouter', reason: msg })
      throw new Error(msg)
    }

    logAuth('success', { provider: 'openrouter', source: 'api_call' })
    return response.body || new ReadableStream()
  } catch (error) {
    clearTimeout(timeoutId)
    const msg = error instanceof Error ? error.message : "Unknown error"
    logAuth('failure', { provider: 'openrouter', reason: msg })
    throw error
  }
}
