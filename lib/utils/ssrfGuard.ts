/**
 * URL and Host Security Validation
 * 
 * Prevents Server-Side Request Forgery (SSRF) by validating external endpoints.
 * Blocks private IP ranges, loopback addresses, metadata services, and non-HTTP(S) protocols.
 */

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  '169.254.169.254', // AWS/GCP/Azure link-local metadata service
]

/**
 * Checks if an IP or host belongs to a private / reserved IP range.
 */
function isPrivateIp(hostname: string): boolean {
  // IPv4 regex check
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4Match) {
    const octets = ipv4Match.slice(1, 5).map(Number)
    const [o1, o2] = octets

    // 127.0.0.0/8 (Loopback)
    if (o1 === 127) return true
    // 10.0.0.0/8 (Private)
    if (o1 === 10) return true
    // 172.16.0.0/12 (Private: 172.16 - 172.31)
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true
    // 192.168.0.0/16 (Private)
    if (o1 === 192 && o2 === 168) return true
    // 169.254.0.0/16 (Link-local / cloud metadata)
    if (o1 === 169 && o2 === 254) return true
    // 0.0.0.0/8
    if (o1 === 0) return true
  }

  // IPv6 checks (loopback, unique local, link-local)
  if (hostname === '::1' || hostname.startsWith('fe80:') || hostname.startsWith('fc00:') || hostname.startsWith('fd00:')) {
    return true
  }

  return false
}

/**
 * Validates that an external URL is safe for server-side requests (No SSRF).
 */
export function isSafeExternalUrl(urlStr: string): { safe: boolean; error?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { safe: false, error: 'URL is required' }
  }

  let parsed: URL
  try {
    parsed = new URL(urlStr)
  } catch {
    return { safe: false, error: 'Malformed URL format' }
  }

  // Enforce protocol
  const isDev = process.env.NODE_ENV === 'development'
  const allowedProtocols = isDev ? ['http:', 'https:'] : ['https:']

  if (!allowedProtocols.includes(parsed.protocol)) {
    return { safe: false, error: `Protocol ${parsed.protocol} is not allowed. Use HTTPS.` }
  }

  const hostname = parsed.hostname.toLowerCase()

  // In production, block localhost and private IPs
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { safe: false, error: 'Access to loopback or metadata service is forbidden.' }
  }

  if (isPrivateIp(hostname)) {
    return { safe: false, error: 'Access to private internal network addresses is forbidden.' }
  }

  return { safe: true }
}
