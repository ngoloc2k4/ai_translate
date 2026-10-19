import { describe, it, expect, beforeEach, afterAll, mock } from "bun:test"
import { validateApiKey, getApiKeyToUse } from "../lib/utils/validateKey"

describe('API Keys Security', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset process.env for each test
    for (const key in process.env) {
      delete process.env[key]
    }
    Object.assign(process.env, originalEnv)
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should validate API key format before sending to server', () => {
    // Gemini
    expect(validateApiKey('gemini', 'AIza_test')).toBe(true)
    expect(validateApiKey('gemini', 'wrong_format')).toBe(false)

    // Groq
    expect(validateApiKey('groq', 'gsk_test')).toBe(true)
    expect(validateApiKey('groq', 'wrong_format')).toBe(false)
  })

  it('should prioritize client-side keys when provided', () => {
    process.env.GEMINI_API_KEY = 'test-server-key'

    const apiKey = getApiKeyToUse('gemini', 'client-key')
    expect(apiKey).toBe('client-key') // Client key takes precedence
  })

  it('should use server-side keys when client key is missing', () => {
    process.env.GEMINI_API_KEY = 'test-server-key'

    const apiKey = getApiKeyToUse('gemini')
    expect(apiKey).toBe('test-server-key') // Falls back to server key
  })
})
