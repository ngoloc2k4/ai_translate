"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/i18n/useTranslation"
import type { ApiKeys } from "@/types"
import { FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_STEP } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({
  isOpen,
  onClose,
}: SettingsModalProps) {
  const { apiKeys, setApiKeys, fontSize, setFontSize, mobileFontSize, setMobileFontSize, hasHydrated } = useAppSettings()
  const { t, locale, setLocale } = useTranslation()
  const [customModelInputs, setCustomModelInputs] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const fontSizeOptions = []
  for (let size = FONT_SIZE_MIN; size <= FONT_SIZE_MAX; size += FONT_SIZE_STEP) {
    fontSizeOptions.push(size)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--panel)] rounded-[10px] p-6 w-full max-w-md border border-[var(--border)] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t("apiKeyTitle")}</h2>
        
        {/* Locale Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
            {t("language")}
          </label>
          <div className="flex gap-2">
            {["vi", "en", "ko"].map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l as any)}
                className={`px-3 py-2 rounded-[10px] border text-xs font-semibold transition-all ${
                  locale === l
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--background)] text-zinc-400 border-[var(--border)] hover:border-zinc-600"
                }`}
              >
                {l === "vi" ? "🇻🇳 VI" : l === "en" ? "🇬🇧 EN" : "🇰🇷 KO"}
              </button>
            ))}
          </div>
        </div>

        {/* Font Sizes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Desktop Font Size */}
          <div className="bg-[var(--background)] p-3 rounded-[10px] border border-[var(--border)]">
            <label className="block text-[0.625rem] font-bold text-zinc-500 uppercase mb-2">
              {t("fontSizeDesktop")}: {hasHydrated ? fontSize : 14}px
            </label>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[9px] text-zinc-500">{FONT_SIZE_MIN}px</span>
              <input
                type="range"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                step={FONT_SIZE_STEP}
                value={hasHydrated ? fontSize : 14}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 h-1.5 bg-[var(--panel)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
              <span className="text-[9px] text-zinc-500">{FONT_SIZE_MAX}px</span>
            </div>
            <div className="flex justify-between">
              {[12, 14, 16, 18, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => hasHydrated && setFontSize(size)}
                  className={`w-5 h-5 rounded-full text-[8px] font-medium transition-all ${
                    hasHydrated && fontSize === size
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--panel)] text-zinc-500 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Font Size */}
          <div className="bg-[var(--background)] p-3 rounded-[10px] border border-[var(--border)]">
            <label className="block text-[0.625rem] font-bold text-zinc-500 uppercase mb-2">
              {t("fontSizeMobile")}: {hasHydrated ? mobileFontSize : 16}px
            </label>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[9px] text-zinc-500">{FONT_SIZE_MIN}px</span>
              <input
                type="range"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                step={FONT_SIZE_STEP}
                value={hasHydrated ? mobileFontSize : 16}
                onChange={(e) => setMobileFontSize(Number(e.target.value))}
                className="flex-1 h-1.5 bg-[var(--panel)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
              <span className="text-[9px] text-zinc-500">{FONT_SIZE_MAX}px</span>
            </div>
            <div className="flex justify-between">
              {[12, 14, 16, 18, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => hasHydrated && setMobileFontSize(size)}
                  className={`w-5 h-5 rounded-full text-[8px] font-medium transition-all ${
                    hasHydrated && mobileFontSize === size
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--panel)] text-zinc-500 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { id: "gemini", label: t("geminiApiKey"), placeholder: "AIza..." },
            { id: "groq", label: t("groqApiKey"), placeholder: "gsk_..." },
            { id: "nvidia", label: "NVIDIA NIM API Key", placeholder: "nvapi-..." },
            { id: "openrouter", label: "OpenRouter API Key", placeholder: "sk-or-..." },
          ].map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                {field.label}
              </label>
              <input
                type="password"
                value={(apiKeys as any)[field.id] || ""}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, [field.id]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
          ))}
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
              {t("customProviderName")}
            </label>
            <input
              type="text"
              value={apiKeys.custom || ""}
              onChange={(e) =>
                setApiKeys({ ...apiKeys, custom: e.target.value })
              }
              placeholder="My Provider"
              className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
              {t("customEndpointUrl")}
            </label>
            <input
              type="url"
              value={apiKeys.customEndpoint || ""}
              onChange={(e) =>
                setApiKeys({ ...apiKeys, customEndpoint: e.target.value })
              }
              placeholder="https://api.example.com/v1/chat/completions"
              className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Custom Models Section */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase mb-3">{t("customModels")}</h3>
          {["groq", "nvidia", "openrouter", "custom"].map((provider) => (
            <div key={provider} className="mb-3">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                {provider.charAt(0).toUpperCase() + provider.slice(1)} {t("model")}s
              </label>
              <input
                type="text"
                value={customModelInputs[provider] ?? ((apiKeys.customModels as any)?.[provider] || []).join(", ")}
                onChange={(e) => {
                  const rawValue = e.target.value
                  setCustomModelInputs(prev => ({ ...prev, [provider]: rawValue }))
                  const models = rawValue.split(",").map((m: string) => m.trim()).filter(Boolean)
                  setApiKeys({ 
                    ...apiKeys, 
                    customModels: { ...apiKeys.customModels, [provider]: models.length > 0 ? models : undefined }
                  })
                }}
                placeholder={t("modelsPlaceholder")}
                className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
          ))}
          <p className="text-[0.625rem] text-zinc-500 mt-1">{t("commaSeparated")}</p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-[10px] bg-[var(--primary)] text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {t("done")}
          </button>
        </div>
      </div>
    </div>
  )
}
