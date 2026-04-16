import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApiKeys } from '@/types'

interface AppSettingsState {
  apiKeys: ApiKeys
  serverKeys: Record<string, boolean>
  fontSize: number
  mobileFontSize: number
  hasHydrated: boolean
  
  setApiKeys: (keys: ApiKeys | ((prev: ApiKeys) => ApiKeys)) => void
  setServerKeys: (keys: Record<string, boolean>) => void
  setFontSize: (size: number) => void
  setMobileFontSize: (size: number) => void
  setHasHydrated: (state: boolean) => void
}

export const useAppSettings = create<AppSettingsState>()(
  persist(
    (set) => ({
      apiKeys: {},
      serverKeys: {},
      fontSize: 14,
      mobileFontSize: 16,
      hasHydrated: false,
      
      setApiKeys: (keysOrUpdater) => set((state) => ({
        apiKeys: typeof keysOrUpdater === 'function' ? keysOrUpdater(state.apiKeys) : keysOrUpdater
      })),
      setServerKeys: (serverKeys) => set({ serverKeys }),
      setFontSize: (fontSize) => set({ fontSize }),
      setMobileFontSize: (mobileFontSize) => set({ mobileFontSize }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'ai_translate_settings',
      partialize: (state) => ({ 
        apiKeys: state.apiKeys, 
        fontSize: state.fontSize,
        mobileFontSize: state.mobileFontSize
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    }
  )
)
