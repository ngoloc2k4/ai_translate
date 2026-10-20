export const PROVIDERS = [
  { id: "gemini", name: "Google Gemini" },
  { id: "groq", name: "Groq" },
  { id: "nvidia", name: "NVIDIA NIM" },
  { id: "openrouter", name: "OpenRouter" },
  { id: "custom", name: "Custom Provider" },
] as const

export const DEFAULT_MODELS: Record<string, { id: string; name: string }[]> = {
  gemini: [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  ],
  nvidia: [
    { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "Nemotron 70B" },
    { id: "mistralai/mistral-large-2-instruct", name: "Mistral Large 2" },
    { id: "deepseek-ai/deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash" },
    { id: "google/gemma-3-12b-it", name: "Gemma 3 12B" },
    { id: "nvidia/riva-translate-4b-instruct-v2", name: "Riva Translate 4B" },
  ],
  openrouter: [
    { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash" },
    { id: "minimax/minimax-m3.1-flash:free", name: "MiniMax M3.1 Flash (Free)" },
    { id: "deepseek/deepseek-chat", name: "DeepSeek V3" },
    { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "openai/gpt-4o", name: "GPT-4o" },
  ],
  custom: [
    { id: "custom-model", name: "Custom Model" },
  ],
}

export const DEFAULT_SELECTED_MODELS: Record<string, string> = {
  gemini: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
  nvidia: "nvidia/llama-3.1-nemotron-70b-instruct",
  openrouter: "google/gemini-2.0-flash-001",
  custom: "custom-model",
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

export const MAX_CHARACTERS = 5000

export const FONT_SIZE_MIN = 10
export const FONT_SIZE_MAX = 24
export const FONT_SIZE_STEP = 2
