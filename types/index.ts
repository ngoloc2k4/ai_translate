export interface TranslationOptions {
  tone?: string
  mode?: string
  temperature?: number
  creativity?: "low" | "default" | "high"
}

export interface TranslationRequest {
  text: string
  sourceLang?: string
  targetLang: string
  provider: "gemini" | "groq" | "nvidia" | "openrouter" | "custom"
  model: string
  apiKey: string
  options?: TranslationOptions
}

export interface TranslationResponse {
  result?: string
  error?: string
}

export interface HistoryItem {
  id: number
  time: string
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  provider: string
  model?: string
  mode?: string
  tone?: string
}

export interface TranslationHistory {
  items: HistoryItem[]
}

export interface ApiKeys {
  gemini?: string
  groq?: string
  nvidia?: string
  openrouter?: string
  custom?: string
  customEndpoint?: string
  customModels?: {
    groq?: string[]
    nvidia?: string[]
    openrouter?: string[]
    custom?: string[]
  }
}

export interface ProviderParams {
  provider: "gemini" | "groq" | "nvidia" | "openrouter" | "custom"
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
  temperature: number
  baseUrl?: string
}

