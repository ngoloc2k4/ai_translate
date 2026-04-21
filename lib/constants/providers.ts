export const PROVIDERS = [
  { id: "gemini", name: "Google Gemini" },
  { id: "groq", name: "Groq" },
  { id: "nvidia", name: "NVIDIA NIM" },
  { id: "openrouter", name: "OpenRouter" },
  { id: "custom", name: "Custom Provider" },
] as const


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
export const FONT_SIZE_MAX = 24
export const FONT_SIZE_STEP = 2
