import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit } from '../app/api/rate-limit'

// Mock NextRequest
function createMockRequest(ip: string = '127.0.0.1') {
  return {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return ip
        if (name === 'x-real-ip') return ip
        return null
      }
    }
  } as any
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store between tests
    // Note: In a real scenario, we'd need to export the store for testing
  })

  it('should allow requests under the limit', () => {
    const req = createMockRequest('192.168.1.1')
    const result = checkRateLimit(req, 5, 60000)
    
    expect(result.isAllowed).toBe(true)
    expect(result.remaining).toBe(4) // 5 - 1 = 4
  })

  it('should block requests over the limit', () => {
    const req = createMockRequest('192.168.1.2')
    
    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      checkRateLimit(req, 5, 60000)
    }
    
    // 6th request should be blocked
    const result = checkRateLimit(req, 5, 60000)
    expect(result.isAllowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track different IPs separately', () => {
    const req1 = createMockRequest('192.168.1.3')
    const req2 = createMockRequest('192.168.1.4')
    
    const result1 = checkRateLimit(req1, 5, 60000)
    const result2 = checkRateLimit(req2, 5, 60000)
    
    expect(result1.isAllowed).toBe(true)
    expect(result2.isAllowed).toBe(true)
    expect(result1.remaining).toBe(4)
    expect(result2.remaining).toBe(4)
  })

  it('should include reset time in response', () => {
    const req = createMockRequest('192.168.1.5')
    const result = checkRateLimit(req, 5, 60000)
    
    expect(result.resetTime).toBeDefined()
    expect(result.resetTime).toBeGreaterThan(Date.now())
    expect(result.resetTime).toBeLessThanOrEqual(Date.now() + 60000)
  })
})
