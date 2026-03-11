"use client"

import { useState, useCallback, useEffect } from "react"
import { getHistory, clearHistory, checkDailyReset, deleteHistoryItem } from "@/lib/storage/storage"
import type { HistoryItem } from "@/types"

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [date, setDate] = useState<string>("")

  // Check daily reset on mount
  useEffect(() => {
    checkDailyReset()
    loadHistory()
  }, [])

  const loadHistory = useCallback(() => {
    const data = getHistory()
    if (data) {
      setItems(data.items)
      setDate(data.date)
    }
  }, [])

  const clear = useCallback(() => {
    clearHistory()
    setItems([])
    setDate("")
  }, [])

  const deleteItem = useCallback((itemId: number) => {
    deleteHistoryItem(itemId)
    loadHistory()
  }, [loadHistory])

  return {
    items,
    date,
    loadHistory,
    clear,
    deleteItem,
  }
}
