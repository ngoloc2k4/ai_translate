import { logAuth } from "@/lib/utils/logger"
import type { ProviderParams } from "@/types"

const PROVIDER_TIMEOUT_MS = 30_000

export async function translateNvidia({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
  baseUrl,
}: ProviderParams): Promise<ReadableStream> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

  const endpoint = baseUrl
    ? `${baseUrl.replace(/\/+$/, '')}/chat/completions`
    : "https://integrate.api.nvidia.com/v1/chat/completions"

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: 4096,
        stream: true,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.text()
      let msg = ""
      try {
        const json = JSON.parse(error)
        msg = json.detail ||
              json.error?.message ||
              json.message ||
              (json.title ? `${json.title}: ${json.detail || json.status || ''}`.trim() : "")
      } catch {
        // Not JSON
      }
      if (!msg) {
        msg = `NVIDIA NIM API error (${response.status}): ${error.slice(0, 300)}`
      }

      // Clarify account entitlement error
      if (msg.includes("Not found for account") || (msg.includes("Function") && msg.includes("not found"))) {
        msg += " — Lỗi tài khoản NVIDIA: Key của bạn chưa được cấp quyền 'Public API Endpoints' trên build.nvidia.com. Hãy thử đổi model khác (như Mistral Large 2, Gemma 3) hoặc tạo key mới trực tiếp trên trang model tại https://build.nvidia.com."
      }

      logAuth('failure', { provider: 'nvidia', reason: msg })
      throw new Error(msg)
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
