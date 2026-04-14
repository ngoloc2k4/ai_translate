import { logAuth } from "@/lib/utils/logger"
import type { ProviderParams } from "@/types"

const PROVIDER_TIMEOUT_MS = 30_000

export async function translateCustom({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
  baseUrl,
}: ProviderParams): Promise<ReadableStream> {
  if (!baseUrl) {
    throw new Error("Custom provider requires a base URL")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  try {
    const response = await fetch(baseUrl, {
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
      const error = await response.text()
      logAuth('failure', { provider: 'custom', reason: error })
      throw new Error(`Custom API error (${response.status}): ${error}`)
    }

    logAuth('success', { provider: 'custom', source: 'api_call' })
    return response.body || new ReadableStream()
  } catch (error) {
    clearTimeout(timeoutId)
    const msg = error instanceof Error ? error.message : "Unknown error"
    logAuth('failure', { provider: 'custom', reason: msg })
    throw error
  }
}
