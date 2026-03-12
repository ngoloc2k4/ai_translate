"use client"

import { useState, useEffect } from "react"
import { useTranslation as useI18n } from "@/lib/i18n/useTranslation"
import { useTranslation } from "@/hooks/useTranslation"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { LANGUAGES } from "@/lib/constants/languages"
import { PROVIDERS, MODELS, TONES, MODES, CREATIVITY_OPTIONS, MAX_CHARACTERS, FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_STEP } from "@/lib/constants/providers"
import { LANGUAGE_FLAGS, translations } from "@/lib/i18n/translations"
import type { ApiKeys } from "@/types"

interface TranslatorPanelProps {
  onStatsChange?: (stats: { in: number; out: number; total: number }) => void
}

export default function TranslatorPanel({ onStatsChange }: TranslatorPanelProps) {
  const { t, locale, setLocale } = useI18n()
  const { result, loading, error, translate, reset } = useTranslation()

  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>("ai_translate_keys", {})
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("ai_translate_font_size") : null
    return saved ? Number(saved) : 14
  })
  const [savedProvider, setSavedProvider] = useLocalStorage<"gemini" | "groq" | "nvidia" | "openrouter" | "custom">("ai_translate_provider", "gemini")
  const [savedModel, setSavedModel] = useLocalStorage<string>("ai_translate_model", "gemini-2.5-flash")
  const [mounted, setMounted] = useState(false)

  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("en")
  const [provider, setProvider] = useState<"gemini" | "groq" | "nvidia" | "openrouter" | "custom">(savedProvider)
  const [model, setModel] = useState(savedModel)
  const [tone, setTone] = useState("default")
  const [mode, setMode] = useState("default")
  const [creativity, setCreativity] = useState<"low" | "default" | "high">("default")
  const [showSettings, setShowSettings] = useState(false)

  // Load font size from localStorage after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply font size
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`)
    }
  }, [fontSize, mounted])

  // Listen for open-settings event from header button
  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true)
    window.addEventListener("open-settings", handleOpenSettings)
    return () => window.removeEventListener("open-settings", handleOpenSettings)
  }, [])

  // Update stats
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange({
        in: sourceText.length,
        out: result.length,
        total: sourceText.length + result.length,
      })
    }
  }, [sourceText, result, onStatsChange])

  // Persist provider/model changes
  useEffect(() => {
    if (mounted) {
      setSavedProvider(provider)
    }
  }, [provider, setSavedProvider, mounted])

  useEffect(() => {
    if (mounted) {
      setSavedModel(model)
    }
  }, [model, setSavedModel, mounted])

  const handleTranslate = () => {
    if (!sourceText.trim()) return

    if (sourceText.length > MAX_CHARACTERS) {
      alert(t("textTooLong"))
      return
    }

    const apiKey = getApiKey(provider)
    if (!apiKey) {
      alert(t("invalidApiKey"))
      setShowSettings(true)
      return
    }

    translate({
      text: sourceText,
      sourceLang,
      targetLang: LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang,
      provider,
      model,
      apiKey,
      baseUrl: provider === "custom" ? apiKeys.customEndpoint : undefined,
      options: { tone, mode, creativity },
    })
  }

  const getApiKey = (prov: string) => {
    switch (prov) {
      case "gemini":
        return apiKeys.gemini
      case "groq":
        return apiKeys.groq
      case "nvidia":
        return apiKeys.nvidia
      case "openrouter":
        return apiKeys.openrouter
      case "custom":
        return apiKeys.custom
      default:
        return null
    }
  }

  const handleProviderChange = (newProvider: "gemini" | "groq" | "nvidia" | "openrouter" | "custom") => {
    setProvider(newProvider)
    const defaultModels = MODELS[newProvider] || []
    const customModels = apiKeys.customModels?.[newProvider as keyof NonNullable<ApiKeys["customModels"]>] || []
    const availableModelIds = [...defaultModels.map((m) => m.id), ...customModels]
    
    // If current model is not available for new provider, use first available model
    if (!availableModelIds.includes(model)) {
      const defaultModel = defaultModels[0]?.id || customModels[0] || "custom-model"
      setModel(defaultModel)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
  }

  const clearSource = () => {
    setSourceText("")
    reset()
  }

  const swapLanguages = () => {
    if (sourceLang === "auto") return
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
  }

  const getFlag = (code: string) => LANGUAGE_FLAGS[code] || "🌐"

  const getToneLabel = (id: string) => {
    const key = `tone${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof translations.en
    return t(key) || id
  }

  const getModeLabel = (id: string) => {
    if (id === "bilingual-paragraph") return t("modeBilingualParagraph")
    const key = `mode${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof translations.en
    return t(key) || id
  }

  const getCreativityLabel = (id: string) => {
    const key = `creativity${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof translations.en
    return t(key) || id
  }

  const getProviderLabel = (id: string) => {
    const key = `provider${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof translations.en
    return t(key) || id
  }

  const getModelsForProvider = () => {
    const defaultModels = MODELS[provider] || []
    const customModels = apiKeys.customModels?.[provider as keyof NonNullable<ApiKeys["customModels"]>] || []
    
    // Combine default models with custom models
    const allModels = [
      ...defaultModels,
      ...customModels.map((id) => ({ id, name: id })),
    ]
    
    return allModels
  }

  const sourceLangName = LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang
  const targetLangName = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang

  // Generate font size options
  const fontSizeOptions = []
  for (let size = FONT_SIZE_MIN; size <= FONT_SIZE_MAX; size += FONT_SIZE_STEP) {
    fontSizeOptions.push(size)
  }

  return (
    <>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--panel)] rounded-[10px] p-6 w-full max-w-md border border-[var(--border)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t("apiKeyTitle")}</h2>
            
            {/* Locale Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                {t("language")}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocale("vi")}
                  className={`px-3 py-2 rounded-[10px] border text-xs font-semibold transition-all ${
                    locale === "vi"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-zinc-400 border-[var(--border)] hover:border-zinc-600"
                  }`}
                >
                  🇻🇳 VI
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`px-3 py-2 rounded-[10px] border text-xs font-semibold transition-all ${
                    locale === "en"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-zinc-400 border-[var(--border)] hover:border-zinc-600"
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLocale("ko")}
                  className={`px-3 py-2 rounded-[10px] border text-xs font-semibold transition-all ${
                    locale === "ko"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-zinc-400 border-[var(--border)] hover:border-zinc-600"
                  }`}
                >
                  🇰🇷 KO
                </button>
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                {t("fontSize")}: {mounted ? fontSize : 14}px
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">{FONT_SIZE_MIN}px</span>
                <input
                  type="range"
                  min={FONT_SIZE_MIN}
                  max={FONT_SIZE_MAX}
                  step={FONT_SIZE_STEP}
                  value={mounted ? fontSize : 14}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                />
                <span className="text-xs text-zinc-500">{FONT_SIZE_MAX}px</span>
              </div>
              <div className="flex justify-between mt-1">
                {fontSizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => mounted && setFontSize(size)}
                    className={`w-6 h-6 rounded-full text-[9px] font-medium transition-all ${
                      mounted && fontSize === size
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--background)] text-zinc-500 hover:bg-zinc-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  {t("geminiApiKey")}
                </label>
                <input
                  type="password"
                  value={apiKeys.gemini || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, gemini: e.target.value })
                  }
                  placeholder="AIza..."
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.groq || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, groq: e.target.value })
                  }
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  NVIDIA NIM API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.nvidia || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, nvidia: e.target.value })
                  }
                  placeholder="nvapi-..."
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKeys.openrouter || ""}
                  onChange={(e) =>
                    setApiKeys({ ...apiKeys, openrouter: e.target.value })
                  }
                  placeholder="sk-or-..."
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Custom Provider Name
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
                  Custom Endpoint URL
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
              <h3 className="text-xs font-bold text-zinc-400 uppercase mb-3">Custom Models</h3>
              
              {/* Groq Custom Models */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Groq Models
                </label>
                <input
                  type="text"
                  value={(apiKeys.customModels?.groq || []).join(", ")}
                  onChange={(e) => {
                    const models = e.target.value.split(",").map((m) => m.trim()).filter(Boolean)
                    setApiKeys({ 
                      ...apiKeys, 
                      customModels: { ...apiKeys.customModels, groq: models.length > 0 ? models : undefined }
                    })
                  }}
                  placeholder="llama-3.2-1b, llama-3.2-3b"
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated model IDs</p>
              </div>

              {/* NVIDIA Custom Models */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  NVIDIA NIM Models
                </label>
                <input
                  type="text"
                  value={(apiKeys.customModels?.nvidia || []).join(", ")}
                  onChange={(e) => {
                    const models = e.target.value.split(",").map((m) => m.trim()).filter(Boolean)
                    setApiKeys({ 
                      ...apiKeys, 
                      customModels: { ...apiKeys.customModels, nvidia: models.length > 0 ? models : undefined }
                    })
                  }}
                  placeholder="meta/llama-3.2-1b-instruct, meta/llama-3.2-11b-vision-instruct"
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated model IDs</p>
              </div>

              {/* OpenRouter Custom Models */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  OpenRouter Models
                </label>
                <input
                  type="text"
                  value={(apiKeys.customModels?.openrouter || []).join(", ")}
                  onChange={(e) => {
                    const models = e.target.value.split(",").map((m) => m.trim()).filter(Boolean)
                    setApiKeys({ 
                      ...apiKeys, 
                      customModels: { ...apiKeys.customModels, openrouter: models.length > 0 ? models : undefined }
                    })
                  }}
                  placeholder="anthropic/claude-3-haiku, openai/gpt-4-turbo"
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated model IDs</p>
              </div>

              {/* Custom Provider Models */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Custom Provider Models
                </label>
                <input
                  type="text"
                  value={(apiKeys.customModels?.custom || []).join(", ")}
                  onChange={(e) => {
                    const models = e.target.value.split(",").map((m) => m.trim()).filter(Boolean)
                    setApiKeys({ 
                      ...apiKeys, 
                      customModels: { ...apiKeys.customModels, custom: models.length > 0 ? models : undefined }
                    })
                  }}
                  placeholder="gpt-4, claude-3-opus"
                  className="w-full px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--background)] text-sm text-white focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">Comma-separated model IDs</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 rounded-[10px] bg-[var(--primary)] text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {t("done")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Selector Row (Top) */}
      <section className="flex items-center justify-center gap-4 py-2">
        <div className="flex items-center gap-2">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-4 py-2 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-sm font-semibold text-zinc-200 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {getFlag(l.code)} {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            disabled={sourceLang === "auto"}
            className="p-2 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-4 py-2 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-sm font-semibold text-zinc-200 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors"
          >
            {LANGUAGES.filter((l) => l.code !== "auto").map((l) => (
              <option key={l.code} value={l.code}>
                {getFlag(l.code)} {l.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Control Bar (Center) - Provider, Model, Tone, Mode, Creativity */}
      <section className="flex flex-wrap items-center justify-center gap-2 py-2">
        {/* Provider Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-600 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t("provider")}</span>
          <select
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value as "gemini" | "groq")}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{getProviderLabel(p.id)}</option>
            ))}
          </select>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-600 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t("model")}</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {getModelsForProvider().map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-[var(--border)] mx-1"></div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-600 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t("tone")}</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {TONES.map((t) => (
              <option key={t.id} value={t.id}>{getToneLabel(t.id)}</option>
            ))}
          </select>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-600 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t("mode")}</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>{getModeLabel(m.id)}</option>
            ))}
          </select>
        </div>

        {/* Creativity Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-600 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">{t("creativity")}</span>
          <select
            value={creativity}
            onChange={(e) => setCreativity(e.target.value as "low" | "default" | "high")}
            className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
          >
            {CREATIVITY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>{getCreativityLabel(c.id)}</option>
            ))}
          </select>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !sourceText.trim()}
          className="ml-2 flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[var(--primary)] text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("translate")}
        </button>
      </section>

      {/* Translation Panels */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
        {/* Source Input Panel */}
        <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[10px] relative overflow-hidden group">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--background)]/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t("sourceLanguage")}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={clearSource}
                className="p-1.5 rounded-[10px] hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                title={t("clear")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARACTERS))}
            placeholder={t("sourcePlaceholder")}
            maxLength={MAX_CHARACTERS}
            style={{ fontSize: mounted ? `${fontSize}px` : '14px' }}
            className="flex-1 w-full bg-transparent p-5 leading-relaxed text-zinc-200 focus:outline-none focus:ring-0 border-none resize-none placeholder:text-zinc-700 custom-scrollbar mono-font"
          />
          <div className="absolute bottom-3 right-3">
            <div className={`px-2 py-1 rounded-[10px] bg-[var(--background)] border border-[var(--border)] text-[10px] font-mono ${
              sourceText.length > MAX_CHARACTERS * 0.9 ? "text-red-500" : "text-zinc-500"
            }`}>
              {t("chars")}: {sourceText.length} / {MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Result Output Panel */}
        <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[10px] relative overflow-hidden group">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--background)]/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">{t("targetLanguage")}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={copyToClipboard}
                disabled={!result}
                className="p-1.5 rounded-[10px] hover:bg-zinc-800 text-zinc-500 hover:text-[var(--primary)] transition-colors disabled:opacity-50"
                title={t("copy")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-1.5 rounded-[10px] hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar text-content" style={{ fontSize: mounted ? `${fontSize}px` : '14px' }}>
            {loading && !result && (
              <div className="flex items-center gap-2 text-zinc-500" style={{ fontSize: 'inherit' }}>
                <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                <span>{t("translating")}</span>
              </div>
            )}
            {result && (
              <div className="leading-relaxed text-zinc-300 whitespace-pre-wrap" style={{ fontSize: 'inherit' }}>
                {result}
                {loading && (
                  <span className="inline-block w-1.5 h-4 bg-[var(--primary)]/40 animate-pulse ml-0.5 align-middle"></span>
                )}
              </div>
            )}
            {!result && !loading && (
              <p className="text-zinc-500" style={{ fontSize: 'inherit' }}>{t("outputPlaceholder")}</p>
            )}
            {error && (
              <p className="text-red-500" style={{ fontSize: 'inherit' }}>{t("translationError")}{error}</p>
            )}
          </div>
          {loading && result && (
            <div className="absolute bottom-3 left-3">
              <div className="px-2 py-0.5 rounded-[10px] bg-[var(--primary)]/10 text-[9px] font-mono text-[var(--primary)] border border-[var(--primary)]/20 uppercase">
                {t("streaming")}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex justify-around items-center px-6 py-3 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <button
          onClick={() => window.location.href = '/'}
          className="flex flex-col items-center gap-1 text-[var(--primary)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="text-[10px] font-bold">{t("navTranslate")}</span>
        </button>
        <button
          onClick={() => window.location.href = '/history'}
          className="flex flex-col items-center gap-1 text-zinc-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold">{t("navHistory")}</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="flex flex-col items-center gap-1 text-zinc-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] font-bold">{t("settings")}</span>
        </button>
      </nav>
    </>
  )
}
