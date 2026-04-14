import { logAuth } from "@/lib/utils/logger"
import type { ProviderParams } from "@/types"

const PROVIDER_TIMEOUT_MS = 30_000

export async function translateNvidia({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
}: ProviderParams): Promise<ReadableStream> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
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
      try {
        const json = JSON.parse(error)
        const msg = json.error?.message || "NVIDIA NIM API error"
        logAuth('failure', { provider: 'nvidia', reason: msg })
        throw new Error(msg)
      } catch {
        logAuth('failure', { provider: 'nvidia', reason: error })
        throw new Error(`NVIDIA NIM API error (${response.status}): ${error}`)
      }
    }

    logAuth('success', { provider: 'nvidia', source: 'api_call' })
    return response.body || new ReadableStream()
  } catch (error) {
    clearTimeout(timeoutId)
    const msg = error instanceof Error ? error.message : "Unknown error"
    logAuth('failure', { provider: 'nvidia', reason: msg })
    throw error
  }
}
