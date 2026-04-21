import type { ApiKeys, TranslationHistory, HistoryItem } from "@/types"

const KEYS_STORAGE_KEY = "ai_translate_keys"
const HISTORY_STORAGE_KEY = "ai_translate_history"

export function getApiKeys(): ApiKeys {
  if (typeof window === "undefined") return {}
  const raw = localStorage.getItem(KEYS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function saveApiKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys))
}

export function clearApiKeys(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEYS_STORAGE_KEY)
}

export function getHistory(): TranslationHistory | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
  if (!raw) return null
  
  const data = JSON.parse(raw)
  // Handle migration from old { date, items } format implicitly since items is all we need
  return data
}

export function saveHistory(item: Omit<HistoryItem, "id" | "time">): void {
  const currentTime = new Date().toLocaleTimeString()

  const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
  let data: TranslationHistory = raw ? JSON.parse(raw) : { items: [] }

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
}

export function deleteHistoryItem(itemId: number): void {
  const data = getHistory()
  if (!data || !data.items) return

  data.items = data.items.filter((item) => item.id !== itemId)
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY)
}
