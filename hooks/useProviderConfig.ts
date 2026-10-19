import { useMemo } from "react"
import { PROVIDERS, DEFAULT_MODELS } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useProviderConfig(providerId: string, fetchedModels: SearchableSelectOption[] = []) {
  const { apiKeys } = useAppSettings()

  return useMemo(() => {
    const currentProvider = PROVIDERS.find((p) => p.id === providerId)
    const customModels = apiKeys?.customModels?.[providerId as keyof NonNullable<typeof apiKeys.customModels>] || []
    const safeCustomModels = Array.isArray(customModels) ? customModels : []

    // If fetchedModels is empty, use DEFAULT_MODELS for this provider
    const baseModels = fetchedModels && fetchedModels.length > 0 
      ? fetchedModels 
      : (DEFAULT_MODELS[providerId] || [])

    const rawModels = [
      ...baseModels,
      ...safeCustomModels.map((m: string) => ({ id: m, name: m }))
    ]
    
    // Deduplicate models mapping by ID
    const allModels = Array.from(new Map(rawModels.map(m => [m.id, m])).values())

    return {
      currentProvider,
      allModels
    }
  }, [providerId, fetchedModels, apiKeys?.customModels])
}
