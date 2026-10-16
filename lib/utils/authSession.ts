/**
 * Session Token & Password Verification
 * 
 * Implemented using Web Crypto API (`crypto.subtle`) for 100% universal compatibility:
 * - Runs smoothly in Edge Runtime (Vercel Edge Middleware)
 * - Runs smoothly in Node.js Runtime (Serverless Functions)
 * - Runs in Browsers
 */

function getSigningSecret(): string {
  return process.env.SESSION_SECRET || process.env.APP_PASSWORD || "ai_translate_default_fallback_secret_32chars"
}

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Compute HMAC-SHA256 signature using Web Crypto API
 */
async function computeHmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, stringToUint8Array(data))
  return bufferToHex(signature)
}

/**
 * Constant-time comparison using Uint8Array to prevent timing attacks.
 */
export function timingSafeEqualWeb(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

/**
 * Creates a cryptographically signed session token:
 * format: `${timestamp}.${signature}`
 */
export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString()
  const secret = getSigningSecret()
  const signature = await computeHmacSha256(timestamp, secret)
  return `${timestamp}.${signature}`
}

/**
 * Verifies if a session token is valid, correctly signed, and not expired (30 days).
 */
export async function verifySessionToken(token?: string | null): Promise<boolean> {
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
  const expectedSignature = await computeHmacSha256(timestampStr, secret)

  return timingSafeEqualWeb(signature, expectedSignature)
}

/**
 * Constant-time comparison for password checking.
 */
export function verifyPasswordConstantTime(providedPassword: string, correctPassword?: string): boolean {
  if (!correctPassword || !providedPassword) return false
  return timingSafeEqualWeb(providedPassword, correctPassword)
}
