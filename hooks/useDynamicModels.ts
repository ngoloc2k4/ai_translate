import { useState, useEffect } from "react"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useDynamicModels(provider: string, clientKey: string) {
  const [models, setModels] = useState<SearchableSelectOption[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const cacheKey = `ai_models_cache_${provider}`

    async function fetchModels() {
      if (!provider) return

      // Attempt to load from cache
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setModels(parsed)
            return // Skip network request if cache is valid
          }
        }
      } catch (err) {
        // Ignore cache parse errors
      }

      setIsFetching(true)
      setError(null)

      try {
        const res = await fetch(`/api/models?provider=${provider}&key=${encodeURIComponent(clientKey)}`)
        const json = await res.json()
        
        if (res.ok && isMounted) {
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setModels(json.data)
            sessionStorage.setItem(cacheKey, JSON.stringify(json.data))
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
  }, [provider, clientKey])

  return { models, isFetching, error }
}
