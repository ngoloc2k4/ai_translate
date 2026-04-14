import { describe, it, expect, beforeEach } from 'bun:test'
import { checkRateLimit, resetRateLimitForIp } from '../lib/utils/rateLimit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset rate limits between tests to avoid interference
    resetRateLimitForIp('192.168.1.1')
    resetRateLimitForIp('192.168.1.2')
    resetRateLimitForIp('192.168.1.3')
    resetRateLimitForIp('192.168.1.4')
    resetRateLimitForIp('192.168.1.5')
  })

  it('should allow requests under the limit', () => {
    const result = checkRateLimit('192.168.1.1', '/api/translate')
    
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(19) // 20 - 1 = 19
  })

  it('should block requests over the limit', () => {
    const ip = '192.168.1.2'
    const path = '/api/validate-key' // Limit is 5
    
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip, path)
    }
    
    // 6th request should be blocked
    const result = checkRateLimit(ip, path)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track different IPs and paths separately', () => {
    const ip1 = '192.168.1.3'
    const ip2 = '192.168.1.4'
    const path1 = '/api/translate'
    const path2 = '/api/validate-key'
    
    const result1 = checkRateLimit(ip1, path1)
    const result2 = checkRateLimit(ip2, path1)
    const result3 = checkRateLimit(ip1, path2)
    
    expect(result1.allowed).toBe(true)
    expect(result2.allowed).toBe(true)
    expect(result3.allowed).toBe(true)
    
    expect(result1.remaining).toBe(19)
    expect(result2.remaining).toBe(19)
    expect(result3.remaining).toBe(4)
  })

  it('should include reset time and limit in response', () => {
    const result = checkRateLimit('192.168.1.5', '/api/other')
    
    expect(result.resetTime).toBeDefined()
    expect(result.limit).toBe(10) // Default limit
    expect(result.resetTime).toBeGreaterThan(Date.now())
  })
})

