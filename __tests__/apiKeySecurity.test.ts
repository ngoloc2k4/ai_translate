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

  it('should use server-side keys when available', () => {
    process.env.GEMINI_API_KEY = 'test-key'

    const apiKey = getApiKeyToUse('gemini', 'client-key')
    expect(apiKey).toBe('test-key') // Should use server key
  })

  it('should fallback to client key when server key is missing', () => {
    delete process.env.GEMINI_API_KEY

    const apiKey = getApiKeyToUse('gemini', 'client-key')
    expect(apiKey).toBe('client-key') // Should fallback to client key
  })
})
