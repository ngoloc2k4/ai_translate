import { useState, useEffect, useCallback } from "react"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useDynamicModels(provider: string, clientKey: string, hasServerKey: boolean = false) {
  const [models, setModels] = useState<SearchableSelectOption[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchModels = useCallback(async (bypassCache: boolean = false) => {
    if (!provider || provider === "custom") {
      setModels([])
      return
    }

    setError(null)
    setIsFetching(true)

    try {
      const url = `/api/models?provider=${encodeURIComponent(provider)}${bypassCache ? "&refresh=true" : ""}`
      const headers: Record<string, string> = {}
      if (clientKey) {
        headers["x-api-key"] = clientKey
      }

      const res = await fetch(url, { headers })
      const json = await res.json()

      if (res.ok) {
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setModels(json.data)
        }
      } else if (res.status === 401) {
        setError(json.error || `Invalid ${provider.toUpperCase()} API Key`)
      }
    } catch (err) {
      console.error("Failed to fetch dynamic models", err)
    } finally {
      setIsFetching(false)
    }
  }, [provider, clientKey])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  return { 
    models, 
    isFetching, 
    error,
    refetch: () => fetchModels(true)
  }
}
