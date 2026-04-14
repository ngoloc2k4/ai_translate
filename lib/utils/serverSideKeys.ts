/**
 * Server-Side API Keys from Environment Variables
 * 
 * Get server-side API key for a provider.
 * Reads directly from process.env to allow dynamic updates during testing.
 */
export function getServerSideApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'gemini':
      return process.env.GEMINI_API_KEY || undefined
    case 'groq':
      return process.env.GROQ_API_KEY || undefined
    case 'nvidia':
      return process.env.NVIDIA_API_KEY || undefined
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY || undefined
    case 'custom':
      return process.env.CUSTOM_API_KEY || undefined
    default:
      return undefined
  }
}

/**
 * Check if server-side API key is configured for a provider
 */
export function hasServerSideKey(provider: string): boolean {
  return !!getServerSideApiKey(provider)
}

/**
 * Get server-side custom endpoint
 */
export function getServerSideCustomEndpoint(): string | undefined {
  return process.env.CUSTOM_API_ENDPOINT || undefined
}
