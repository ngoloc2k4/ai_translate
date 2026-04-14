import { logAuth } from "@/lib/utils/logger"
import type { ProviderParams } from "@/types"

const PROVIDER_TIMEOUT_MS = 30_000

export async function translateGroq({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
}: ProviderParams): Promise<ReadableStream> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
      const errorMessage = error.error?.message || "Groq API error"
      logAuth('failure', { provider: 'groq', reason: errorMessage })
      throw new Error(errorMessage)
    }

    logAuth('success', { provider: 'groq', source: 'api_call' })
    return response.body || new ReadableStream()
  } catch (error) {
    clearTimeout(timeoutId)
    const msg = error instanceof Error ? error.message : "Unknown error"
    logAuth('failure', { provider: 'groq', reason: msg })
    throw error
  }
}
