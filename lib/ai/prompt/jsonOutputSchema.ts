/**
 * JSON Output Schema for Translation API
 * 
 * All AI responses must follow this JSON structure for consistent frontend rendering
 */

export interface TranslationOutput {
  /** Main translated/processed text */
  result: string
  
  /** For bilingual modes: array of sentence/paragraph pairs */
  bilingual?: BilingualPair[]
  
  /** For summarizing mode */
  summary?: string
  
  /** For correcting mode: list of corrections made */
  corrections?: Correction[]
  
  /** For explaining mode */
  explanation?: string
  
  /** Original input text (echoed back for reference) */
  original: string
  
  /** Target language */
  targetLanguage: string
  
  /** Source language (detected or specified) */
  sourceLanguage: string
  
  /** Processing mode used */
  mode: string
  
  /** Tone applied */
  tone: string
  
  /** Confidence score 0-1 (if available) */
  confidence?: number
  
  /** Any warnings or notes */
  warnings?: string[]
}

export interface BilingualPair {
  /** Original sentence/paragraph */
  original: string
  
  /** Translated sentence/paragraph */
  translation: string
  
  /** For sentence-level: sentence number */
  index?: number
}

export interface Correction {
  /** Original text */
  original: string
  
  /** Corrected text */
  corrected: string
  
  /** Type of correction: grammar, spelling, punctuation, style */
  type: string
  
  /** Explanation of the correction */
  reason?: string
}

/**
 * System prompt template for JSON output
 */
export const JSON_OUTPUT_INSTRUCTION = `
IMPORTANT: You MUST output your response as a valid JSON object following this exact structure:

{
  "result": "your main translated/processed text here",
  "original": "the original input text",
  "sourceLanguage": "detected or specified source language",
  "targetLanguage": "target language",
  "mode": "mode used",
  "tone": "tone applied",
  "confidence": 0.95
}

For BILINGUAL mode, include a "bilingual" array:
{
  "result": "full bilingual text",
  "bilingual": [
    {"original": "sentence 1", "translation": "translated sentence 1", "index": 1},
    {"original": "sentence 2", "translation": "translated sentence 2", "index": 2}
  ]
}

For BILINGUAL PARAGRAPH mode:
{
  "result": "full bilingual text",
  "bilingual": [
    {"original": "full paragraph", "translation": "full translated paragraph"}
  ]
}

For CORRECTING mode, include a "corrections" array:
{
  "result": "corrected text",
  "corrections": [
    {"original": "error", "corrected": "fix", "type": "grammar", "reason": "explanation"}
  ]
}

For SUMMARIZING mode, include a "summary":
{
  "result": "summary text",
  "summary": "brief summary"
}

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown, no code blocks, no explanations
2. Escape quotes and special characters properly
3. Ensure the JSON is parseable
4. The "result" field should contain the main output for display
5. Additional fields provide structured data for frontend rendering
`
