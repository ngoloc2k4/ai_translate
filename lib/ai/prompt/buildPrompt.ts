import { BASE_TRANSLATOR_PROMPT } from "./promptTemplates"
import { tonePrompts } from "./tonePrompts"
import { modePrompts } from "./modePrompts"
import { outputFormats } from "./outputFormat"
import { LANGUAGES } from "@/lib/constants/languages"

export interface BuildPromptOptions {
  text: string
  sourceLang?: string
  targetLang: string
  tone?: string
  mode?: string
  creativity?: "low" | "default" | "high"
}

export function buildPrompt({
  text,
  sourceLang,
  targetLang,
  tone = "default",
  mode = "default",
  creativity = "default",
}: BuildPromptOptions): { system: string; user: string } {
  const toneInstruction = tonePrompts[tone] || tonePrompts.default
  const modeInstruction = modePrompts[mode] || modePrompts.default
  const outputInstruction = outputFormats[mode] || outputFormats.default

  const sourceLangName = LANGUAGES.find((l) => l.code === sourceLang)?.name || (sourceLang === "auto" || !sourceLang ? "Auto detect" : sourceLang)
  const targetLangName = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang

  const userPrompt = `
Source Language: ${sourceLangName}
Target Language: ${targetLangName}

${modeInstruction}

${toneInstruction}

Creativity Level: ${creativity}

${outputInstruction}

Text:
"""
${text}
"""
`

  return {
    system: BASE_TRANSLATOR_PROMPT,
    user: userPrompt,
  }
}

export function getTemperature(creativity: "low" | "default" | "high" = "default"): number {
  switch (creativity) {
    case "low":
      return 0.3
    case "high":
      return 0.8
    case "default":
    default:
      return 0.5
  }
}
