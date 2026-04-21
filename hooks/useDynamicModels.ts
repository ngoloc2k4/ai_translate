import { useState, useEffect } from "react"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useDynamicModels(provider: string, clientKey: string, hasServerKey: boolean = false) {
  const [models, setModels] = useState<SearchableSelectOption[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchModels() {
      if (!provider) return

      setError(null)

      // If no client key and no server key, skip fetching
      if (!clientKey && !hasServerKey) {
        return
      }

      setIsFetching(true)

      try {
        const url = clientKey
          ? `/api/models?provider=${provider}&key=${encodeURIComponent(clientKey)}`
          : `/api/models?provider=${provider}`

        const res = await fetch(url)
        const json = await res.json()

        if (res.ok && isMounted) {
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setModels(json.data)
          }
        } else if (res.status === 401 && isMounted) {
          setError(json.error || `Invalid ${provider.toUpperCase()} API Key`)
        }
      } catch (err) {
        console.error("Failed to fetch dynamic models", err)
      } finally {
        if (isMounted) setIsFetching(false)
      }
    }

    fetchModels()

    return () => {
      isMounted = false
    }
  }, [provider, clientKey, hasServerKey])

  return { models, isFetching, error }
}
