import { useMemo } from "react"
import { PROVIDERS } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"
import { SearchableSelectOption } from "@/components/ui/SearchableSelect"

export function useProviderConfig(providerId: string, fetchedModels: SearchableSelectOption[] = []) {
  const { apiKeys } = useAppSettings()

  return useMemo(() => {
    const currentProvider = PROVIDERS.find((p) => p.id === providerId)
    const customModels = (apiKeys.customModels as any)?.[providerId] || []

    const rawModels = [
      ...fetchedModels,
      ...customModels.map((m: string) => ({ id: m, name: m }))
    ]
    
    // Deduplicate models mapping by ID
    const allModels = Array.from(new Map(rawModels.map(m => [m.id, m])).values())

    return {
      currentProvider,
      allModels
    }
  }, [providerId, fetchedModels, apiKeys.customModels])
}
