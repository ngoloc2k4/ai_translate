"use client"

import { useEffect } from "react"
import { PROVIDERS, TONES, MODES } from "@/lib/constants/providers"
import type { ApiKeys } from "@/types"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { useDynamicModels } from "@/hooks/useDynamicModels"
import { useProviderConfig } from "@/hooks/useProviderConfig"
import { useToast } from "@/components/ui/Toast"
import { shouldShowToast } from "@/lib/utils/throttledToast"
import { useAppSettings } from "@/store/useAppSettings"

interface ControlBarProps {
  provider: string
  setProvider: (provider: any) => void
  model: string
  setModel: (model: string) => void
  tone: string
  setTone: (tone: string) => void
  mode: string
  setMode: (mode: string) => void
  temperature: number
  setTemperature: (temp: number) => void
  apiKeys: ApiKeys
  t: (key: any) => string
}

export default function ControlBar({
  provider,
  setProvider,
  model,
  setModel,
  tone,
  setTone,
  mode,
  setMode,
  temperature,
  setTemperature,
  apiKeys,
  t
}: ControlBarProps) {
  const { showToast } = useToast()
  const { serverKeys } = useAppSettings()
  
  const clientKey = (apiKeys as any)?.[provider] || ""
  const hasServerKey = !!(serverKeys && serverKeys[provider])
  const hasClientKey = !!clientKey
  
  const keyToUse = hasClientKey ? clientKey : ""
  const { models: fetchedModels, isFetching: isFetchingModels, error } = useDynamicModels(provider, keyToUse, hasServerKey)

  const { allModels } = useProviderConfig(provider, fetchedModels)

  useEffect(() => {
    if (error && shouldShowToast('control_bar_error', 5000)) {
      showToast(error, "error")
    }
  }, [error, showToast])

  useEffect(() => {
    if (allModels.length > 0 && (!model || !allModels.some(m => m.id === model))) {
      setModel(allModels[0].id)
    }
  }, [allModels, model, setModel])

  return (
    <section 
      aria-label="Translation controls" 
      className="px-4 py-2 bg-[var(--background)] border-b border-[var(--border)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Providers & Models */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Provider Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
              {t("provider")}
            </span>
            <div 
              role="tablist" 
              aria-label="AI Providers" 
              className="flex p-1 rounded-xl bg-[var(--panel)] border border-[var(--border)] overflow-x-auto custom-scrollbar max-w-full gap-1 shadow-sm"
            >
              {PROVIDERS.map((p) => {
                const isActive = provider === p.id
                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setProvider(p.id)}
                    title={p.name}
                    className={`min-h-[40px] md:min-h-[32px] px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                  >
                    <span>{p.name.replace("Google ", "")}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">
              {t("model")}
            </span>
            <div className="relative">
              <SearchableSelect
                options={allModels}
                value={model}
                onChange={(val) => setModel(val)}
                placeholder={isFetchingModels ? "Fetching models..." : "Select model"}
                searchPlaceholder="Search models..."
              />
              {isFetchingModels && (
                <div 
                  aria-label="Loading models"
                  className="absolute right-9 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin pointer-events-none" 
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Mode, Tone & Temperature */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="mode-select" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {t("mode") || "Mode"}
            </label>
            <div className="relative">
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="min-h-[40px] md:min-h-[34px] pl-3 pr-8 py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-xs font-medium text-zinc-200 hover:border-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors cursor-pointer appearance-none shadow-sm"
              >
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {t(`mode${m.id.charAt(0).toUpperCase() + m.id.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`) || m.name}
                  </option>
                ))}
              </select>
              <svg 
                className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="tone-select" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {t("tone") || "Tone"}
            </label>
            <div className="relative">
              <select
                id="tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="min-h-[40px] md:min-h-[34px] pl-3 pr-8 py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-xs font-medium text-zinc-200 hover:border-zinc-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors cursor-pointer appearance-none shadow-sm"
              >
                {TONES.map((tn) => (
                  <option key={tn.id} value={tn.id}>
                    {t(`tone${tn.id.charAt(0).toUpperCase() + tn.id.slice(1)}`) || tn.name}
                  </option>
                ))}
              </select>
              <svg 
                className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--panel)] border border-[var(--border)] min-h-[40px] md:min-h-[34px] shadow-sm">
            <label htmlFor="temperature-slider" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Temp
            </label>
            <input
              id="temperature-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              aria-label={`Temperature ${temperature}`}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-blue-400 border border-zinc-700/60 min-w-[28px] text-center">
              {temperature.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
