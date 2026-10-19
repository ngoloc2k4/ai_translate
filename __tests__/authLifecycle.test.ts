import { describe, it, expect, beforeEach, afterAll } from "bun:test"
import {
  verifyCredentials,
  createSessionToken,
  verifySessionToken,
  getSessionDetails,
  timingSafeEqualWeb,
  SESSION_MAX_AGE_SECONDS,
} from "../lib/utils/authSession"
import { checkRateLimit } from "../lib/utils/rateLimit"

describe("Authentication & Session Lifecycle", () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset env
    for (const key in process.env) {
      delete process.env[key]
    }
    Object.assign(process.env, originalEnv)
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it("should fail credentials check when APP_PASSWORD is not set", () => {
    delete process.env.APP_PASSWORD
    const result = verifyCredentials("secret")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Server authentication is not configured")
  })

  it("should verify correct password in constant time", () => {
    process.env.APP_PASSWORD = "my-secure-password"
    delete process.env.APP_USERNAME

    const valid = verifyCredentials("my-secure-password")
    expect(valid.success).toBe(true)

    const invalid = verifyCredentials("wrong-password")
    expect(invalid.success).toBe(false)
  })

  it("should verify username when APP_USERNAME is configured", () => {
    process.env.APP_PASSWORD = "my-secure-password"
    process.env.APP_USERNAME = "my-admin"

    const valid = verifyCredentials("my-secure-password", "my-admin")
    expect(valid.success).toBe(true)

    const wrongUser = verifyCredentials("my-secure-password", "hacker")
    expect(wrongUser.success).toBe(false)

    const wrongPass = verifyCredentials("wrong-password", "my-admin")
    expect(wrongPass.success).toBe(false)
  })

  it("should create valid signed session tokens and verify them", async () => {
    process.env.APP_PASSWORD = "session-test-password"
    process.env.SESSION_SECRET = "custom-test-secret-32-chars-long"

    const token = await createSessionToken()
    expect(token).toBeString()
    expect(token.includes(".")).toBe(true)

    const isValid = await verifySessionToken(token)
    expect(isValid).toBe(true)

    // Tampered token should fail
    const tampered = token + "xyz"
    const isTamperedValid = await verifySessionToken(tampered)
    expect(isTamperedValid).toBe(false)
  })

  it("should compute session details and expiration (~30 days)", async () => {
    process.env.APP_PASSWORD = "session-details-pass"

    const token = await createSessionToken()
    const details = await getSessionDetails(token)

    expect(details.valid).toBe(true)
    expect(details.issuedAt).toBeNumber()
    expect(details.expiresAt).toBeNumber()
    
    // Check expiration duration is approximately 30 days
    const expectedExpiry = (details.issuedAt || 0) + SESSION_MAX_AGE_SECONDS * 1000
    expect(details.expiresAt).toBe(expectedExpiry)
  })

  it("should enforce rate limits on /api/auth (5 requests / min)", () => {
    const testIp = `test-ip-${Date.now()}`
    
    // First 5 requests must pass
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp, "/api/auth")
      expect(res.allowed).toBe(true)
    }

    // 6th request must be blocked
    const blocked = checkRateLimit(testIp, "/api/auth")
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it("should compare strings safely in constant time", () => {
    expect(timingSafeEqualWeb("password123", "password123")).toBe(true)
    expect(timingSafeEqualWeb("password123", "password124")).toBe(false)
    expect(timingSafeEqualWeb("short", "longerstring")).toBe(false)
  })
})
