"use client"

import { useState, useCallback, useEffect } from "react"
import { getHistory, clearHistory, deleteHistoryItem } from "@/lib/storage/storage"
import type { HistoryItem } from "@/types"

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = useCallback(() => {
    const data = getHistory()
    if (data && data.items) {
      setItems(data.items)
    }
  }, [])

  const clear = useCallback(() => {
    clearHistory()
    setItems([])
  }, [])

  const deleteItem = useCallback((itemId: number) => {
    deleteHistoryItem(itemId)
    loadHistory()
  }, [loadHistory])

  return {
    items,
    loadHistory,
    clear,
    deleteItem,
  }
}
