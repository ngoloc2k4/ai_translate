"use client"

import { PROVIDERS, MODELS } from "@/lib/constants/providers"
import type { ApiKeys } from "@/types"

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
  const currentProvider = PROVIDERS.find((p) => p.id === provider)
  const availableModels = MODELS[provider as keyof typeof MODELS] || []
  const customModels = (apiKeys.customModels as any)?.[provider] || []
  
  const allModels = [
    ...availableModels.map(m => typeof m === 'string' ? { id: m, name: m } : m),
    ...customModels.map((m: string) => ({ id: m, name: m }))
  ]

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
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 ${
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

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t("model")}</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--border)] text-xs font-semibold text-zinc-200 outline-none cursor-pointer hover:border-zinc-600 transition-colors"
          >
            {allModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>


        {/* Temperature Slidert */}
        <div className="flex items-center gap-2 group relative">
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
