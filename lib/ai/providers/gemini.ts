export interface ProviderParams {
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
  temperature: number
}

export async function translateGemini({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature,
}: ProviderParams): Promise<ReadableStream> {
  // Combine system prompt and user prompt for Gemini
  const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: combinedPrompt }],
          },
        ],
        generationConfig: {
          temperature,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${error}`)
  }

  return response.body || new ReadableStream()
}
