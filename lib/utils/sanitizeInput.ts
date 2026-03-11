/**
 * Input Sanitization Utilities
 *
 * Prevents prompt injection, XSS, and other injection attacks
 */

export const MAX_CHARACTERS = 5000

// Regex patterns for input sanitization
const TRIPLE_DOUBLE_QUOTES = /"""/g
const TRIPLE_BACKTICKS = /```/g
const SCRIPT_TAGS = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
const JAVASCRIPT_PROTOCOL = /javascript:/gi
const DATA_URI_HTML = /data:text\/html/gi
const LANGUAGE_CODE_PATTERN = /[^a-zA-Z0-9_-]/g
const MODEL_NAME_PATTERN = /[^a-zA-Z0-9_./-]/g

// Prompt injection detection patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore (previous|all) (instructions|rules)/i,
  /forget (all|previous) (instructions|rules)/i,
  /system:|system prompt:/i,
  /you are now|act as|pretend to be/i,
  /bypass|override|skip/i,
  /output your (instructions|system prompt|rules)/i,
  /translate this instead:|new instruction:/i,
  /###|```|\$\{\}/i,
] as const

const VALID_PROVIDERS = ['gemini', 'groq', 'nvidia', 'openrouter', 'custom'] as const
export type Provider = typeof VALID_PROVIDERS[number]

/**
 * Sanitize user input before including in prompts.
 *
 * Removes dangerous characters, enforces limits, and prevents injection attacks.
 *
 * @param text - Raw user input text
 * @returns Sanitized text safe for prompt inclusion
 */
export function sanitizeInput(text: string): string {
  if (!text) {
    return ''
  }

  return text
    .trim()
    .slice(0, MAX_CHARACTERS)
    .replace(TRIPLE_DOUBLE_QUOTES, "'\"'")
    .replace(TRIPLE_BACKTICKS, '` `')
    .replace(SCRIPT_TAGS, '')
    .replace(JAVASCRIPT_PROTOCOL, '')
    .replace(DATA_URI_HTML, '')
}

/**
 * Validate and sanitize language codes.
 *
 * Only allows alphanumeric characters, hyphens, and underscores.
 *
 * @param code - Raw language code
 * @returns Sanitized language code (defaults to 'auto' if empty)
 */
export function sanitizeLanguageCode(code: string): string {
  if (!code) {
    return 'auto'
  }

  return code
    .replace(LANGUAGE_CODE_PATTERN, '')
    .slice(0, 10)
}

/**
 * Validate provider name against allowlist.
 *
 * @param provider - Raw provider name
 * @returns Validated provider name (defaults to 'gemini' if invalid)
 */
export function sanitizeProvider(provider: string): Provider {
  if (VALID_PROVIDERS.includes(provider as Provider)) {
    return provider as Provider
  }

  return 'gemini'
}

/**
 * Validate and sanitize model name.
 *
 * Only allows alphanumeric characters, hyphens, underscores, dots, and slashes.
 *
 * @param model - Raw model name
 * @returns Sanitized model name
 */
export function sanitizeModel(model: string): string {
  if (!model) {
    return ''
  }

  return model
    .replace(MODEL_NAME_PATTERN, '')
    .slice(0, 100)
}

/**
 * Check for potential prompt injection patterns.
 *
 * @param text - Text to analyze
 * @returns True if suspicious patterns detected
 */
export function detectPromptInjection(text: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

/**
 * Escape special characters for safe inclusion in prompts.
 *
 * @param text - Text to escape
 * @returns Escaped text safe for prompt inclusion
 */
export function escapeForPrompt(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}
