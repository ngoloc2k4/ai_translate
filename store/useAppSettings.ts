import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApiKeys, ProviderType } from '@/types'
import { DEFAULT_SELECTED_MODELS } from '@/lib/constants/providers'

interface AppSettingsState {
  apiKeys: ApiKeys
  serverKeys: Record<string, boolean>
  fontSize: number
  mobileFontSize: number
  hasHydrated: boolean
  provider: ProviderType
  selectedModels: Record<string, string>
  
  setApiKeys: (keys: ApiKeys | ((prev: ApiKeys) => ApiKeys)) => void
  setServerKeys: (keys: Record<string, boolean>) => void
  setFontSize: (size: number) => void
  setMobileFontSize: (size: number) => void
  setHasHydrated: (state: boolean) => void
  setProvider: (provider: ProviderType) => void
  setSelectedModel: (provider: string, model: string) => void
}

export const useAppSettings = create<AppSettingsState>()(
  persist(
    (set) => ({
      apiKeys: {},
      serverKeys: {},
      fontSize: 14,
      mobileFontSize: 16,
      hasHydrated: false,
      provider: 'gemini',
      selectedModels: { ...DEFAULT_SELECTED_MODELS },
      
      setApiKeys: (keysOrUpdater) => set((state) => ({
        apiKeys: typeof keysOrUpdater === 'function' ? keysOrUpdater(state.apiKeys || {}) : (keysOrUpdater || {})
      })),
      setServerKeys: (serverKeys) => set({ serverKeys: serverKeys || {} }),
      setFontSize: (fontSize) => set({ fontSize }),
      setMobileFontSize: (mobileFontSize) => set({ mobileFontSize }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setProvider: (provider) => set({ provider }),
      setSelectedModel: (provider, model) => set((state) => ({
        selectedModels: {
          ...state.selectedModels,
          [provider]: model,
        }
      })),
    }),
    {
      name: 'ai_translate_settings',
      partialize: (state) => ({ 
        apiKeys: state.apiKeys || {}, 
        fontSize: state.fontSize || 14,
        mobileFontSize: state.mobileFontSize || 16,
        provider: state.provider || 'gemini',
        selectedModels: state.selectedModels || {},
      }),
      merge: (persistedState: unknown, currentState) => {
        const state = (persistedState as Partial<AppSettingsState> | null) || {}

        let legacyProvider: ProviderType | undefined
        let legacyModel: string | undefined
        if (typeof window !== "undefined") {
          try {
            const p = window.localStorage.getItem("ai_translate_provider")
            if (p) {
              const parsed = JSON.parse(p)
              if (["gemini", "groq", "nvidia", "openrouter", "custom"].includes(parsed)) {
                legacyProvider = parsed as ProviderType
              }
            }
            const m = window.localStorage.getItem("ai_translate_model")
            if (m) {
              legacyModel = JSON.parse(m)
            }
          } catch {}
        }

        const mergedProvider = state.provider || legacyProvider || currentState.provider || 'gemini'
        const mergedModels = {
          ...currentState.selectedModels,
          ...(legacyModel && legacyProvider ? { [legacyProvider]: legacyModel } : {}),
          ...(state.selectedModels || {}),
        }

        return {
          ...currentState,
          ...state,
          apiKeys: state.apiKeys || {},
          serverKeys: currentState.serverKeys || {},
          provider: mergedProvider,
          selectedModels: mergedModels,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    }
  )
)
