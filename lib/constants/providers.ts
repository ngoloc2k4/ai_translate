export const PROVIDERS = [
  { id: "gemini", name: "Google Gemini" },
  { id: "groq", name: "Groq" },
  { id: "nvidia", name: "NVIDIA NIM" },
  { id: "openrouter", name: "OpenRouter" },
  { id: "custom", name: "Custom Provider" },
] as const

export const MODELS = {
  gemini: [
    { id: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview" },
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  ],
  groq: [
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  ],
  nvidia: [
    { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B" },
    { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
    { id: "meta/llama-3.2-90b-vision-instruct", name: "Llama 3.2 90B Vision" },
    { id: "nvidia/nemotron-4-340b-instruct", name: "Nemotron 4 340B" },
  ],
  openrouter: [
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "openai/gpt-4o", name: "GPT-4o" },
    { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
    { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
  ],
  custom: [
    { id: "custom-model", name: "Custom Model" },
  ],
}

export const TONES = [
  { id: "default", name: "Default" },
  { id: "academic", name: "Academic" },
  { id: "concise", name: "Concise" },
  { id: "emotional", name: "Emotional" },
  { id: "friendly", name: "Friendly" },
  { id: "formal", name: "Formal" },
  { id: "humorous", name: "Humorous" },
  { id: "inspirational", name: "Inspirational" },
  { id: "nostalgic", name: "Nostalgic" },
  { id: "ornate", name: "Ornate" },
  { id: "presentation", name: "Presentation" },
  { id: "professional", name: "Professional" },
  { id: "serious", name: "Serious" },
] as const

export const MODES = [
  { id: "default", name: "Default" },
  { id: "bilingual", name: "Bilingual" },
  { id: "bilingual-paragraph", name: "Bilingual (Paragraph)" },
  { id: "correcting", name: "Correcting" },
  { id: "mixing", name: "Mixing" },
  { id: "rewriting", name: "Rewriting" },
  { id: "strictness", name: "Strictness" },
  { id: "summarizing", name: "Summarizing" },
] as const

export const CREATIVITY_OPTIONS = [
  { id: "low", name: "Low", value: 0.3 },
  { id: "default", name: "Default", value: 0.5 },
  { id: "high", name: "High", value: 0.8 },
] as const

export const TEMPERATURE_PRESETS: Record<string, number> = {
  precise: 0.1,
  balanced: 0.5,
  creative: 0.9,
}

export const MAX_CHARACTERS = 5000

export const FONT_SIZE_MIN = 10
export const FONT_SIZE_MAX = 20
export const FONT_SIZE_STEP = 2
