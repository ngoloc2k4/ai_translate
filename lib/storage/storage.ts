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
  return raw ? JSON.parse(raw) : null
}

export function saveHistory(item: Omit<HistoryItem, "id" | "time">): void {
  const today = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString()

  const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
  let data: TranslationHistory | null = raw ? JSON.parse(raw) : null

  // Reset if different day
  if (!data || data.date !== today) {
    data = {
      date: today,
      items: [],
    }
  }

  const newItem: HistoryItem = {
    ...item,
    id: Date.now(),
    time: currentTime,
  }

  // Add to beginning, keep max 50 items
  data.items.unshift(newItem)
  data.items = data.items.slice(0, 50)

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
}

export function deleteHistoryItem(itemId: number): void {
  const data = getHistory()
  if (!data) return

  data.items = data.items.filter((item) => item.id !== itemId)
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY)
}

export function checkDailyReset(): boolean {
  const data = getHistory()
  const today = new Date().toISOString().split("T")[0]

  if (data && data.date !== today) {
    clearHistory()
    return true
  }
  return false
}
