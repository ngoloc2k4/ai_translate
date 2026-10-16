import type { ApiKeys, TranslationHistory, HistoryItem } from "@/types"

const KEYS_STORAGE_KEY = "ai_translate_keys"
const HISTORY_STORAGE_KEY = "ai_translate_history"

export function getApiKeys(): ApiKeys {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEYS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error("Error reading API keys from localStorage:", err)
    return {}
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys))
  } catch (err) {
    console.error("Error saving API keys to localStorage:", err)
  }
}

export function clearApiKeys(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(KEYS_STORAGE_KEY)
  } catch (err) {
    console.error("Error clearing API keys from localStorage:", err)
  }
}

export function getHistory(): TranslationHistory | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return null
    
    const data = JSON.parse(raw)
    if (data && Array.isArray(data.items)) {
      return data
    }
    return { items: [] }
  } catch (err) {
    console.error("Error reading history from localStorage:", err)
    return { items: [] }
  }
}

export function saveHistory(item: Omit<HistoryItem, "id" | "time">): void {
  if (typeof window === "undefined") return
  try {
    const currentTime = new Date().toLocaleTimeString()
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    let data: TranslationHistory = { items: [] }
    
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.items)) {
          data = parsed
        }
      } catch (e) {
        data = { items: [] }
      }
    }

    if (!data.items) {
      data.items = []
    }

    const newItem: HistoryItem = {
      ...item,
      id: Date.now(),
      time: currentTime,
    }

    // Add to beginning
    data.items.unshift(newItem)

    // Prune items older than 7 days (7 * 24 * 60 * 60 * 1000 = 604800000)
    const SEVEN_DAYS_MS = 604800000
    const now = Date.now()
    data.items = data.items.filter(item => now - item.id <= SEVEN_DAYS_MS)

    // Also cap at max 200 items to prevent unbounded growth
    data.items = data.items.slice(0, 200)

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error("Error saving history to localStorage:", err)
  }
}

export function deleteHistoryItem(itemId: number): void {
  if (typeof window === "undefined") return
  try {
    const data = getHistory()
    if (!data || !data.items) return

    data.items = data.items.filter((item) => item.id !== itemId)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error("Error deleting history item from localStorage:", err)
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY)
  } catch (err) {
    console.error("Error clearing history from localStorage:", err)
  }
}
