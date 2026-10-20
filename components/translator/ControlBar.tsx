"use client"

import { useEffect, useState } from "react"
import { PROVIDERS, TONES, MODES } from "@/lib/constants/providers"
import type { ApiKeys, ProviderType } from "@/types"
import SearchableSelect from "@/components/ui/SearchableSelect"
import { useDynamicModels } from "@/hooks/useDynamicModels"
import { useProviderConfig } from "@/hooks/useProviderConfig"
import { useToast } from "@/components/ui/Toast"
import { shouldShowToast } from "@/lib/utils/throttledToast"
import { useAppSettings } from "@/store/useAppSettings"

interface ControlBarProps {
  provider: ProviderType
  setProvider: (provider: ProviderType) => void
  model: string
  setModel: (model: string) => void
  tone: string
  setTone: (tone: string) => void
  mode: string
  setMode: (mode: string) => void
  temperature: number
  setTemperature: (temp: number) => void
  apiKeys: ApiKeys
  t: (key: string, fallback?: string) => string
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
  const [isExpanded, setIsExpanded] = useState(false)
  
  const clientKey = (apiKeys[provider as keyof ApiKeys] as string) || ""
  const hasServerKey = !!(serverKeys && serverKeys[provider])
  const hasClientKey = !!clientKey
  
  const keyToUse = hasClientKey ? clientKey : ""
  const { models: fetchedModels, isFetching: isFetchingModels, error, refetch } = useDynamicModels(provider, keyToUse, hasServerKey)

  const { allModels } = useProviderConfig(provider, fetchedModels)

  useEffect(() => {
    if (error && shouldShowToast('control_bar_error', 5000)) {
      showToast(error, "error")
    }
  }, [error, showToast])

  useEffect(() => {
    if (allModels.length > 0) {
      if (!model) {
        setModel(allModels[0].id)
      } else if (!isFetchingModels && !allModels.some(m => m.id === model)) {
        setModel(allModels[0].id)
      }
    }
  }, [allModels, model, setModel, isFetchingModels])

  const currentProviderObj = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0]
  const currentModelObj = allModels.find((m) => m.id === model) || { id: model, name: model || "Default Model" }
  const currentModeObj = MODES.find((m) => m.id === mode) || MODES[0]
  const currentToneObj = TONES.find((tn) => tn.id === tone) || TONES[0]

  return (
    <section 
      aria-label="Cấu hình AI và động cơ dịch" 
      className="w-full max-w-xl mx-auto px-1"
    >
      {/* Compact Engine Summary Pill (Collapsed View) */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0f172a] border border-slate-800/80 text-xs text-slate-300">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex items-center gap-2 text-left hover:text-white transition-colors cursor-pointer group min-h-[36px]"
        >
          <div className="w-5 h-5 rounded-md bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              {currentProviderObj.name.replace("Google ", "")}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px] truncate max-w-[120px] sm:max-w-[200px]">
              {currentModelObj.name}
            </span>
          </div>
          {isFetchingModels && (
            <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-[11px] font-medium cursor-pointer shrink-0"
        >
          <span>{isExpanded ? "Thu gọn" : t("quickSettings") || "Tùy chọn AI"}</span>
          <svg 
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded Configuration Drawer */}
      {isExpanded && (
        <div className="mt-2 p-3 sm:p-4 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Provider Selection */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {t("provider") || "Nhà cung cấp AI"}
            </label>
            <div className="flex p-1 rounded-xl bg-[#090d16] border border-slate-800 overflow-x-auto custom-scrollbar gap-1">
              {PROVIDERS.map((p) => {
                const isActive = provider === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {p.name.replace("Google ", "")}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("model") || "Mô hình ngôn ngữ"}
              </label>
              <div className="flex items-center gap-1.5">
                {isFetchingModels ? (
                  <span className="text-[10px] text-blue-400 font-medium animate-pulse flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang tải...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => refetch()}
                    title="Cập nhật danh sách mô hình từ nhà cung cấp"
                    className="text-[10px] text-zinc-500 hover:text-blue-400 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>({allModels.length} models)</span>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <SearchableSelect
              options={allModels}
              value={model}
              onChange={(val) => setModel(val)}
              placeholder={isFetchingModels ? "Đang tải mô hình..." : "Chọn mô hình..."}
              searchPlaceholder={`Tìm kiếm trong ${allModels.length} mô hình...`}
            />
          </div>

          {/* Mode & Tone Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Mode */}
            <div>
              <label htmlFor="mode-picker" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t("mode") || "Chế độ dịch"}
              </label>
              <div className="relative">
                <select
                  id="mode-picker"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full min-h-[40px] pl-3 pr-8 py-1.5 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {t(`mode${m.id.charAt(0).toUpperCase() + m.id.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`, m.name)}
                    </option>
                  ))}
                </select>
                <svg className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Tone */}
            <div>
              <label htmlFor="tone-picker" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t("tone") || "Giọng điệu văn phong"}
              </label>
              <div className="relative">
                <select
                  id="tone-picker"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full min-h-[40px] pl-3 pr-8 py-1.5 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  {TONES.map((tn) => (
                    <option key={tn.id} value={tn.id}>
                      {t(`tone${tn.id.charAt(0).toUpperCase() + tn.id.slice(1)}`, tn.name)}
                    </option>
                  ))}
                </select>
                <svg className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Temperature Slider with Humanized Description */}
          <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="temp-slider" className="text-xs font-bold text-slate-300">
                {t("temperature") || "Độ sáng tạo (Temperature)"}
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                {temperature.toFixed(1)}
              </span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              aria-label={`Nhiệt độ ${temperature}`}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
              <span>0.0 (Chính xác, sát nghĩa)</span>
              <span>0.7 (Tự nhiên)</span>
              <span>1.5+ (Linh hoạt, sáng tạo)</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
