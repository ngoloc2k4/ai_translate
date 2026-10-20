import { useMemo } from "react"
import { PROVIDERS, DEFAULT_MODELS } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useProviderConfig(providerId: string, fetchedModels: SearchableSelectOption[] = []) {
  const { apiKeys, selectedModels } = useAppSettings()

  return useMemo(() => {
    const currentProvider = PROVIDERS.find((p) => p.id === providerId)
    const customModels = apiKeys?.customModels?.[providerId as keyof NonNullable<typeof apiKeys.customModels>] || []
    const safeCustomModels = Array.isArray(customModels) ? customModels : []

    // If fetchedModels is empty, use DEFAULT_MODELS for this provider
    const baseModels = fetchedModels && fetchedModels.length > 0 
      ? fetchedModels 
      : (DEFAULT_MODELS[providerId] || [])

    // Ensure the currently selected model is present in the list so it is never lost during rehydration or fetching
    const currentModelId = selectedModels?.[providerId]
    const extraModels: SearchableSelectOption[] = []
    if (currentModelId && !baseModels.some(m => m.id === currentModelId)) {
      extraModels.push({ id: currentModelId, name: currentModelId })
    }

    const rawModels = [
      ...baseModels,
      ...extraModels,
      ...safeCustomModels.map((m: string) => ({ id: m, name: m }))
    ]
    
    // Deduplicate models mapping by ID
    const allModels = Array.from(new Map(rawModels.map(m => [m.id, m])).values())

    return {
      currentProvider,
      allModels
    }
  }, [providerId, fetchedModels, apiKeys?.customModels, selectedModels])
}
