"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "@/lib/i18n/useTranslation"
import { FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_STEP } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = "keys" | "appearance" | "custom"

export default function SettingsModal({
  isOpen,
  onClose,
}: SettingsModalProps) {
  const { apiKeys, setApiKeys, fontSize, setFontSize, mobileFontSize, setMobileFontSize, hasHydrated } = useAppSettings()
  const { t, locale, setLocale } = useTranslation()
  const [activeTab, setActiveTab] = useState<SettingsTab>("keys")
  const [customModelInputs, setCustomModelInputs] = useState<Record<string, string>>({})
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const toggleShowKey = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const keyFields = [
    {
      id: "gemini",
      label: "Google Gemini API Key",
      placeholder: "AIzaSy...",
      hintUrl: "https://aistudio.google.com/app/apikey",
      hintText: "Get key from Google AI Studio",
    },
    {
      id: "groq",
      label: "Groq Cloud API Key",
      placeholder: "gsk_...",
      hintUrl: "https://console.groq.com/keys",
      hintText: "Get free high-speed key from Groq Console",
    },
    {
      id: "nvidia",
      label: "NVIDIA NIM API Key",
      placeholder: "nvapi-...",
      hintUrl: "https://build.nvidia.com",
      hintText: "Get key from NVIDIA NGC / NIM",
    },
    {
      id: "openrouter",
      label: "OpenRouter API Key",
      placeholder: "sk-or-...",
      hintUrl: "https://openrouter.ai/keys",
      hintText: "Get key from OpenRouter",
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--panel)] rounded-2xl p-5 sm:p-6 w-full max-w-lg border border-[var(--border-highlight)] shadow-2xl shadow-black/80 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 id="settings-modal-title" className="text-sm font-bold text-white uppercase tracking-wider">
              {t("settings") || "Settings"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border)] pt-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "keys"
                ? "border-blue-500 text-blue-400 font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t("apiKeyTitle") || "Khóa API"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "appearance"
                ? "border-blue-500 text-blue-400 font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t("language") || "Giao diện & Cỡ chữ"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "custom"
                ? "border-blue-500 text-blue-400 font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t("endpoint") || "Tùy chỉnh Endpoint"}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
          {activeTab === "keys" && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cấu hình API Key trực tiếp. Khóa được lưu trữ an toàn ngay trên trình duyệt của bạn.
              </p>
              {keyFields.map((field) => {
                const isVisible = !!showKey[field.id]
                return (
                  <div key={field.id} className="bg-zinc-900/50 p-3 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor={`key-${field.id}`} className="text-xs font-bold text-zinc-300">
                        {field.label}
                      </label>
                      <a
                        href={field.hintUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{field.hintText}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        id={`key-${field.id}`}
                        type={isVisible ? "text" : "password"}
                        value={(apiKeys as any)[field.id] || ""}
                        onChange={(e) =>
                          setApiKeys({ ...apiKeys, [field.id]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className="w-full pl-3 pr-10 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(field.id)}
                        aria-label={isVisible ? "Hide API key" : "Show API key"}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
                      >
                        {isVisible ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-5">
              {/* UI Language Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  {t("language")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: "vi", label: "Tiếng Việt", badge: "VI" },
                    { code: "en", label: "English", badge: "EN" },
                    { code: "ko", label: "한국어", badge: "KO" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLocale(l.code as any)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        locale === l.code
                          ? "bg-blue-600/20 text-blue-400 border-blue-500 shadow-sm"
                          : "bg-[var(--background)] text-zinc-400 border-[var(--border)] hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {l.badge}
                      </span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Scaling */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="font-size-slider" className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    {t("fontSize")}: {hasHydrated ? fontSize : 14}px
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">Default: 14px</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-zinc-500 font-mono">{FONT_SIZE_MIN}px</span>
                  <input
                    id="font-size-slider"
                    type="range"
                    min={FONT_SIZE_MIN}
                    max={FONT_SIZE_MAX}
                    step={FONT_SIZE_STEP}
                    value={hasHydrated ? fontSize : 14}
                    aria-label="Font size"
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setFontSize(val)
                      setMobileFontSize(val)
                    }}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs text-zinc-500 font-mono">{FONT_SIZE_MAX}px</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {[10, 12, 14, 16, 18, 20, 22, 24].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (hasHydrated) {
                          setFontSize(size)
                          setMobileFontSize(size)
                        }
                      }}
                      className={`h-9 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        hasHydrated && fontSize === size
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="space-y-4">
              <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-[var(--border)]">
                <label htmlFor="custom-endpoint" className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
                  {t("customEndpointUrl")}
                </label>
                <input
                  id="custom-endpoint"
                  type="url"
                  value={apiKeys.customEndpoint || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, customEndpoint: e.target.value })
                  }
                  placeholder="https://api.openai.com/v1/chat/completions"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                />
              </div>

              <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-[var(--border)]">
                <label htmlFor="custom-token" className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
                  {t("customApiKey")}
                </label>
                <input
                  id="custom-token"
                  type="password"
                  value={apiKeys.custom || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, custom: e.target.value })
                  }
                  placeholder="Bearer token or sk-..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                />
              </div>

              {/* Custom Models List */}
              <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-[var(--border)] space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{t("customModels")}</h3>
                {["groq", "nvidia", "openrouter", "custom"].map((prov) => (
                  <div key={prov}>
                    <label htmlFor={`models-${prov}`} className="block text-[11px] font-bold text-zinc-400 capitalize mb-1">
                      {prov} {t("model")}s
                    </label>
                    <input
                      id={`models-${prov}`}
                      type="text"
                      value={customModelInputs[prov] ?? ((apiKeys.customModels as any)?.[prov] || []).join(", ")}
                      onChange={(e) => {
                        const rawValue = e.target.value
                        setCustomModelInputs((prev) => ({ ...prev, [prov]: rawValue }))
                        const models = rawValue.split(",").map((m: string) => m.trim()).filter(Boolean)
                        setApiKeys({
                          ...apiKeys,
                          customModels: { ...apiKeys.customModels, [prov]: models.length > 0 ? models : undefined },
                        })
                      }}
                      placeholder={t("modelsPlaceholder") || "model-1, model-2"}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-white placeholder-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                    />
                  </div>
                ))}
                <p className="text-[10px] text-zinc-500">{t("commaSeparated")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[var(--border)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            {t("done") || "Done"}
          </button>
        </div>
      </div>
    </div>
  )
}
