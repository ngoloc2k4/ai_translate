import { createHmac, timingSafeEqual } from "crypto"

/**
 * Secret salt used for HMAC signing.
 * Falls back to a deterministic hash of APP_PASSWORD if not explicitly set.
 */
function getSigningSecret(): string {
  return process.env.SESSION_SECRET || process.env.APP_PASSWORD || "ai_translate_default_fallback_secret_32chars"
}

/**
 * Creates a cryptographically signed session token:
 * format: `${timestamp}.${signature}`
 */
export function createSessionToken(): string {
  const timestamp = Date.now().toString()
  const secret = getSigningSecret()
  const hmac = createHmac("sha256", secret)
  hmac.update(timestamp)
  const signature = hmac.digest("hex")
  return `${timestamp}.${signature}`
}

/**
 * Verifies if a session token is valid, correctly signed, and not expired (30 days).
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false

  const parts = token.split(".")
  if (parts.length !== 2) return false

  const [timestampStr, signature] = parts
  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return false

  // Check 30 days expiration
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
  if (Date.now() - timestamp > MAX_AGE_MS || timestamp > Date.now() + 60000) {
    return false
  }

  // Re-generate expected signature
  const secret = getSigningSecret()
  const hmac = createHmac("sha256", secret)
  hmac.update(timestampStr)
  const expectedSignature = hmac.digest("hex")

  try {
    const sigBuffer = Buffer.from(signature, "hex")
    const expectedBuffer = Buffer.from(expectedSignature, "hex")
    if (sigBuffer.length !== expectedBuffer.length) return false
    return timingSafeEqual(sigBuffer, expectedBuffer)
  } catch {
    return false
  }
}

/**
 * Constant-time comparison for password checking to prevent timing attacks.
 */
export function verifyPasswordConstantTime(providedPassword: string, correctPassword?: string): boolean {
  if (!correctPassword || !providedPassword) return false
  const providedBuffer = Buffer.from(providedPassword)
  const correctBuffer = Buffer.from(correctPassword)

  if (providedBuffer.length !== correctBuffer.length) {
    // Constant time dummy comparison
    timingSafeEqual(providedBuffer, providedBuffer)
    return false
  }

  return timingSafeEqual(providedBuffer, correctBuffer)
}
