import {
  validateGeminiApiKey,
  validateGroqApiKey,
  validateNvidiaApiKey,
  validateOpenRouterApiKey,
  validateCustomApiKey,
} from './validateApiKeyServer'
import { getServerSideApiKey, getServerSideCustomEndpoint } from './serverSideKeys'
import { logAuth, logSecurity } from './logger'

/**
 * Enhanced API Key Validation
 *
 * 1. First checks if server-side key is configured (env var)
 * 2. If server-side key exists, validates it with the provider
 * 3. If no server-side key, validates client-provided key format
 *
 * @param provider - The AI provider name
 * @param clientKey - API key from client (optional if server-side configured)
 * @returns Promise<boolean> - Whether the key is valid
 */
export async function validateApiKeyAsync(
  provider: string,
  clientKey?: string
): Promise<boolean> {
  const serverKey = getServerSideApiKey(provider)

  if (serverKey) {
    logAuth('success', { provider, source: 'server-side' })
    return validateWithProvider(provider, serverKey)
  }

  if (!clientKey) {
    logAuth('failure', { provider, reason: 'no_key_provided' })
    return false
  }

  if (!validateKeyFormat(provider, clientKey)) {
    logAuth('invalid_key', { provider, reason: 'invalid_format' })
    return false
  }

  // In development, accept valid format keys
  if (process.env.NODE_ENV === 'development') {
    logAuth('success', { provider, source: 'client', env: 'development' })
    return true
  }

  // In production, validate with provider
  logSecurity('Client API key used in production', { provider })
  return validateWithProvider(provider, clientKey)
}

/**
 * Validate key with the actual provider API.
 */
async function validateWithProvider(provider: string, key: string): Promise<boolean> {
  try {
    switch (provider) {
      case 'gemini':
        return validateGeminiApiKey(key)
      case 'groq':
        return validateGroqApiKey(key)
      case 'nvidia':
        return validateNvidiaApiKey(key)
      case 'openrouter':
        return validateOpenRouterApiKey(key)
      case 'custom':
        return validateCustomApiKey(key, getServerSideCustomEndpoint())
      default:
        return false
    }
  } catch (error) {
    console.error(`[API Key Validation] Error validating ${provider}:`, error)
    return false
  }
}

/**
 * Synchronous validation (legacy - format check only).
 * Use validateApiKeyAsync for full validation.
 */
export function validateApiKey(provider: string, key: string): boolean {
  return validateKeyFormat(provider, key)
}

/**
 * Validate API key format (synchronous, no API calls).
 */
function validateKeyFormat(provider: string, key: string): boolean {
  if (!key) {
    return false
  }

  switch (provider) {
    case 'gemini':
      return key.startsWith('AIza')
    case 'groq':
      return key.startsWith('gsk_') || key.startsWith('sk-or-')
    case 'nvidia':
      return key.startsWith('nvapi-') || key.length > 0
    case 'openrouter':
      return key.startsWith('sk-or-') || key.length > 0
    case 'custom':
      return key.length > 0
    default:
      return false
  }
}

/**
 * Get the API key to use (server-side or client-provided).
 */
export function getApiKeyToUse(provider: string, clientKey?: string): string | undefined {
  const serverKey = getServerSideApiKey(provider)

  if (serverKey) {
    return serverKey
  }

  return clientKey
}

/**
 * Check if server-side configuration is available for a provider.
 */
export function isServerSideConfigured(provider: string): boolean {
  return !!getServerSideApiKey(provider)
}
