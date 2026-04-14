import { translateGemini } from "./gemini"
import { translateGroq } from "./groq"
import { translateNvidia } from "./nvidia"
import { translateOpenRouter } from "./openrouter"
import { translateCustom } from "./custom"
import type { ProviderParams } from "@/types"

export async function callProvider(params: ProviderParams): Promise<ReadableStream> {
  switch (params.provider) {
    case "gemini":
      return translateGemini(params)
    case "groq":
      return translateGroq(params)
    case "nvidia":
      return translateNvidia(params)
    case "openrouter":
      return translateOpenRouter(params)
    case "custom":
      return translateCustom(params)
    default:
      throw new Error(`Unsupported provider: ${params.provider}`)
  }
}
