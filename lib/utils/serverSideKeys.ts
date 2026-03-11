/**
 * Server-Side API Keys from Environment Variables
 * 
 * Store provider API keys in environment variables for server-side usage
 * Add these to your .env.local file (DO NOT COMMIT):
 * 
 * GEMINI_API_KEY=AIza...
 * GROQ_API_KEY=gsk_...
 * NVIDIA_API_KEY=nvapi-...
 * OPENROUTER_API_KEY=sk-or-...
 * CUSTOM_API_KEY=your-key
 * CUSTOM_API_ENDPOINT=https://api.example.com/v1/chat/completions
 */

export const serverSideApiKeys = {
  gemini: process.env.GEMINI_API_KEY || '',
  groq: process.env.GROQ_API_KEY || '',
  nvidia: process.env.NVIDIA_API_KEY || '',
  openrouter: process.env.OPENROUTER_API_KEY || '',
  custom: process.env.CUSTOM_API_KEY || '',
  customEndpoint: process.env.CUSTOM_API_ENDPOINT || '',
} as const

/**
 * Check if server-side API key is configured for a provider
 */
export function hasServerSideKey(provider: string): boolean {
  switch (provider) {
    case 'gemini':
      return serverSideApiKeys.gemini.length > 0
    case 'groq':
      return serverSideApiKeys.groq.length > 0
    case 'nvidia':
      return serverSideApiKeys.nvidia.length > 0
    case 'openrouter':
      return serverSideApiKeys.openrouter.length > 0
    case 'custom':
      return serverSideApiKeys.custom.length > 0
    default:
      return false
  }
}

/**
 * Get server-side API key for a provider
 * Returns undefined if not configured
 */
export function getServerSideApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'gemini':
      return serverSideApiKeys.gemini || undefined
    case 'groq':
      return serverSideApiKeys.groq || undefined
    case 'nvidia':
      return serverSideApiKeys.nvidia || undefined
    case 'openrouter':
      return serverSideApiKeys.openrouter || undefined
    case 'custom':
      return serverSideApiKeys.custom || undefined
    default:
      return undefined
  }
}

/**
 * Get server-side custom endpoint
 */
export function getServerSideCustomEndpoint(): string | undefined {
  return serverSideApiKeys.customEndpoint || undefined
}
