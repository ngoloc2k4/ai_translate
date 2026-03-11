export interface ProviderParams {
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
  temperature: number
  baseUrl?: string
}

export async function translateCustom({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
  baseUrl,
}: ProviderParams): Promise<ReadableStream> {
  // Default to OpenAI-compatible API endpoint
  const endpoint = baseUrl || "https://api.openai.com/v1/chat/completions"

  const response = await fetch(endpoint, {
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
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Custom API error (${response.status}): ${error}`)
  }

  return response.body || new ReadableStream()
}
