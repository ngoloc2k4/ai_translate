/**
 * Structured Logging Utility
 *
 * Provides consistent, structured logging for security and debugging.
 * In production, only warnings and errors are logged (no sensitive data).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

const LOG_PREFIX = '[AI_TRANSLATE]'
const SENSITIVE_KEYS = ['apiKey', 'api_keys', 'token', 'secret']
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Remove sensitive data from context before logging.
 */
function sanitizeContext(context: LogContext): LogContext {
  const safeContext = { ...context }
  SENSITIVE_KEYS.forEach(key => {
    delete safeContext[key]
  })
  return safeContext
}

/**
 * Log a message with the specified level and context.
 */
function log(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString()
  const prefix = `${LOG_PREFIX} [${level.toUpperCase()}]`

  if (isDevelopment) {
    logDevelopment(level, prefix, message, context)
    return
  }

  if (level === 'warn' || level === 'error') {
    logProduction(level, prefix, message, context)
  }
}

/**
 * Log in development mode (all levels).
 */
function logDevelopment(level: LogLevel, prefix: string, message: string, context?: LogContext) {
  switch (level) {
    case 'debug':
      console.debug(prefix, message, context)
      break
    case 'info':
      console.info(prefix, message, context)
      break
    case 'warn':
      console.warn(prefix, message, context)
      break
    case 'error':
      console.error(prefix, message, context)
      break
  }
}

/**
 * Log in production mode (warn/error only, sanitized).
 */
function logProduction(level: LogLevel, prefix: string, message: string, context?: LogContext) {
  const safeContext = context ? sanitizeContext(context) : undefined

  if (level === 'error') {
    console.error(prefix, message, safeContext)
  } else {
    console.warn(prefix, message, safeContext)
  }
}

/**
 * Log debug messages (development only)
 */
export function logDebug(message: string, context?: LogContext) {
  log('debug', message, context)
}

/**
 * Log info messages
 */
export function logInfo(message: string, context?: LogContext) {
  log('info', message, context)
}

/**
 * Log warning messages
 */
export function logWarn(message: string, context?: LogContext) {
  log('warn', message, context)
}

/**
 * Log error messages
 */
export function logError(message: string, context?: LogContext) {
  log('error', message, context)
}

/**
 * Log security-related events
 */
export function logSecurity(event: string, context?: LogContext) {
  log('warn', `[SECURITY] ${event}`, {
    ...context,
    securityEvent: true,
  })
}

/**
 * Log API request details
 */
export function logRequest(context: {
  method: string
  path: string
  ip?: string
  provider?: string
  model?: string
  userAgent?: string
}) {
  logDebug('API Request', context)
}

/**
 * Log API response details
 */
export function logResponse(context: {
  method: string
  path: string
  status: number
  durationMs?: number
}) {
  logDebug('API Response', context)
}

/**
 * Log rate limit events
 */
export function logRateLimit(context: {
  ip: string
  limit: number
  remaining: number
  resetTime: number
}) {
  logInfo('Rate Limit', context)
}

/**
 * Log authentication events
 */
export function logAuth(event: 'success' | 'failure' | 'invalid_key', context: LogContext) {
  log(event === 'failure' || event === 'invalid_key' ? 'warn' : 'info', `[AUTH] ${event}`, context)
}
