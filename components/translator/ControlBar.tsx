"use client"

import { useEffect, useState } from "react"
import { PROVIDERS, MODELS } from "@/lib/constants/providers"
import type { ApiKeys } from "@/types"
import SearchableSelect, { SearchableSelectOption } from "@/components/ui/SearchableSelect"
import { useDynamicModels } from "@/hooks/useDynamicModels"
import { useProviderConfig } from "@/hooks/useProviderConfig"
import { useToast } from "@/components/ui/Toast"
import { shouldShowToast } from "@/lib/utils/throttledToast"

interface ControlBarProps {
  provider: string
  setProvider: (provider: any) => void
  model: string
  setModel: (model: string) => void
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
  temperature,
  setTemperature,
  apiKeys,
  t
}: ControlBarProps) {
  const { showToast } = useToast()
  
  const key = (apiKeys as any)[provider] || ""
  const { models: fetchedModels, isFetching: isFetchingModels, error } = useDynamicModels(provider, key)

  const { allModels } = useProviderConfig(provider, fetchedModels)

  useEffect(() => {
    if (error && shouldShowToast('control_bar_error')) {
      showToast(error, "error")
    }
  }, [error, showToast])

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t("provider")}</label>
          <div className="flex p-1 rounded-lg bg-[var(--panel)] border border-[var(--border)]">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                title={p.name}
                className={`min-h-[44px] md:min-h-[32px] px-3 py-2 md:py-1.5 rounded-md transition-all flex items-center justify-center gap-2 ${
                  provider === p.id
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="text-[11px] font-bold whitespace-nowrap">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {t("model")} {isFetchingModels && "..."}
          </label>
          <SearchableSelect
            options={allModels}
            value={model}
            onChange={(val) => setModel(val)}
            placeholder={isFetchingModels ? "Loading..." : "Select model"}
            searchPlaceholder="Search models..."
          />
        </div>


        {/* Temperature Slidert */}
        <div className="flex items-center gap-2 group relative min-h-[44px] md:min-h-0">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">TEMP: {temperature}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-[var(--panel)] border border-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
        </div>
      </div>
    </section>
  )
}
