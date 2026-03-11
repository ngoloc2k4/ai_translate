/**
 * Server-Side API Key Validation
 * 
 * Validates API keys with actual provider APIs to prevent fake key usage
 * Implements caching to reduce API calls and improve performance
 */

const keyValidationCache = new Map<string, { valid: boolean; timestamp: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Validate Gemini API key by making a test call to the API
 */
export async function validateGeminiApiKey(key: string): Promise<boolean> {
  if (!key || !key.startsWith('AIza')) {
    return false
  }

  // Check cache first
  const cached = keyValidationCache.get(`gemini:${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.valid
  }

  try {
    // Make a lightweight API call to validate the key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${key}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const isValid = response.ok || response.status === 404 // 404 means key is valid but model might not exist
    keyValidationCache.set(`gemini:${key}`, { valid: isValid, timestamp: Date.now() })
    return isValid
  } catch (error) {
    console.error('[Gemini] Key validation error:', error)
    return false
  }
}

/**
 * Validate Groq API key by making a test call to the API
 */
export async function validateGroqApiKey(key: string): Promise<boolean> {
  if (!key || (!key.startsWith('gsk_') && !key.startsWith('sk-or-'))) {
    return false
  }

  // Check cache first
  const cached = keyValidationCache.get(`groq:${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.valid
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    })

    const isValid = response.ok
    keyValidationCache.set(`groq:${key}`, { valid: isValid, timestamp: Date.now() })
    return isValid
  } catch (error) {
    console.error('[Groq] Key validation error:', error)
    return false
  }
}

/**
 * Validate NVIDIA NIM API key by making a test call to the API
 */
export async function validateNvidiaApiKey(key: string): Promise<boolean> {
  if (!key || !key.startsWith('nvapi-')) {
    return false
  }

  // Check cache first
  const cached = keyValidationCache.get(`nvidia:${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.valid
  }

  try {
    const response = await fetch('https://api.nvcf.nvidia.com/v2/nvcf/functions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // 200 = valid, 401/403 = invalid
    const isValid = response.ok
    keyValidationCache.set(`nvidia:${key}`, { valid: isValid, timestamp: Date.now() })
    return isValid
  } catch (error) {
    console.error('[NVIDIA] Key validation error:', error)
    return false
  }
}

/**
 * Validate OpenRouter API key by making a test call to the API
 */
export async function validateOpenRouterApiKey(key: string): Promise<boolean> {
  if (!key || !key.startsWith('sk-or-')) {
    return false
  }

  // Check cache first
  const cached = keyValidationCache.get(`openrouter:${key}`)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.valid
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/your-org/ai-translate', // Required by OpenRouter
      },
    })

    const isValid = response.ok
    keyValidationCache.set(`openrouter:${key}`, { valid: isValid, timestamp: Date.now() })
    return isValid
  } catch (error) {
    console.error('[OpenRouter] Key validation error:', error)
    return false
  }
}

/**
 * Validate custom provider API key (basic format check only)
 * For custom providers, we can't validate without knowing the endpoint
 */
export async function validateCustomApiKey(key: string, endpoint?: string): Promise<boolean> {
  if (!key || key.length < 10) {
    return false
  }

  // If endpoint provided, try a simple OPTIONS request
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      })
      
      // If we get any response (even 400/405), the key format is likely valid
      return response.status !== 401 && response.status !== 403
    } catch (error) {
      console.error('[Custom] Key validation error:', error)
      return false
    }
  }

  // No endpoint - just check format
  return key.length > 0
}

/**
 * Clear validation cache for a specific key
 */
export function clearKeyCache(provider: string, key: string): void {
  keyValidationCache.delete(`${provider}:${key}`)
}

/**
 * Clear all validation cache
 */
export function clearAllKeyCache(): void {
  keyValidationCache.clear()
}
