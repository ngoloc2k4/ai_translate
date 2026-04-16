/**
 * Throttles toast notifications to once per specified interval.
 * Uses localStorage to persist state across sessions/refreshes.
 */
export const shouldShowToast = (key: string, intervalMs: number = 15 * 60 * 1000): boolean => {
  if (typeof window === 'undefined') return false
  
  const storageKey = `last_toast_${key}`
  const lastShown = localStorage.getItem(storageKey)
  const now = Date.now()
  
  if (!lastShown || now - parseInt(lastShown) > intervalMs) {
    localStorage.setItem(storageKey, now.toString())
    return true
  }
  
  return false
}
