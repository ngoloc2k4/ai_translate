"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTranslation as useI18n } from "@/lib/i18n/useTranslation"
import { useTranslation } from "@/hooks/useTranslation"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/components/ui/Toast"
import { LANGUAGES } from "@/lib/constants/languages"
import { MAX_CHARACTERS } from "@/lib/constants/providers"
import type { ApiKeys } from "@/types"

// Decomposed Components
import SettingsModal from "./translator/SettingsModal"
import LanguageSelector from "./translator/LanguageSelector"
import ControlBar from "./translator/ControlBar"
import SourcePanel from "./translator/SourcePanel"
import ResultPanel from "./translator/ResultPanel"
import MobileNav from "./translator/MobileNav"
import Footer from "./translator/Footer"

export default function TranslatorPanel() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { result, loading, error, translate, reset, stop } = useTranslation()

  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>("ai_translate_keys", {})
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("ai_translate_font_size") : null
    return saved ? Number(saved) : 14
  })
  
  const [savedProvider, setSavedProvider] = useLocalStorage<"gemini" | "groq" | "nvidia" | "openrouter" | "custom">("ai_translate_provider", "gemini")
  const [savedModel, setSavedModel] = useLocalStorage<string>("ai_translate_model", "gemini-2.5-flash")
  const [mounted, setMounted] = useState(false)

  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useLocalStorage<string>("ai_translate_source_lang", "auto")
  const [targetLang, setTargetLang] = useLocalStorage<string>("ai_translate_target_lang", "en")
  const [provider, setProvider] = useState<"gemini" | "groq" | "nvidia" | "openrouter" | "custom">(savedProvider)
  const [model, setModel] = useState(savedModel)
  const [tone, setTone] = useState("default")
  const [mode, setMode] = useState("default")
  const [creativity, setCreativity] = useState<"low" | "default" | "high">("default")
  const [temperature, setTemperature] = useLocalStorage<number>("ai_translate_temperature", 0.7)
  const [showSettings, setShowSettings] = useState(false)

  // Refs for keyboard shortcut handler to avoid frequent re-subscriptions
  const sourceTextRef = useRef(sourceText)
  const sourceLangRef = useRef(sourceLang)
  const targetLangRef = useRef(targetLang)
  const providerRef = useRef(provider)
  const modelRef = useRef(model)
  const toneRef = useRef(tone)
  const modeRef = useRef(mode)
  const creativityRef = useRef(creativity)
  const temperatureRef = useRef(temperature)
  const apiKeysRef = useRef(apiKeys)
  const loadingRef = useRef(loading)

  useEffect(() => {
    sourceTextRef.current = sourceText
    sourceLangRef.current = sourceLang
    targetLangRef.current = targetLang
    providerRef.current = provider
    modelRef.current = model
    toneRef.current = tone
    modeRef.current = mode
    creativityRef.current = creativity
    temperatureRef.current = temperature
    apiKeysRef.current = apiKeys
    loadingRef.current = loading
  }, [sourceText, sourceLang, targetLang, provider, model, tone, mode, creativity, temperature, apiKeys, loading])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync with local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ai_translate_font_size", fontSize.toString())
      setSavedProvider(provider)
      setSavedModel(model)
    }
  }, [fontSize, provider, model, mounted, setSavedProvider, setSavedModel])

  // Listen for global settings event
  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true)
    window.addEventListener("open-settings", handleOpenSettings)
    return () => window.removeEventListener("open-settings", handleOpenSettings)
  }, [])

  // Keyboard shortcuts - uses refs to avoid frequent re-subscriptions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        if (loadingRef.current) {
          stop()
        } else {
          // Build translate call using current ref values
          const text = sourceTextRef.current
          if (!text.trim()) return

          if (text.length > MAX_CHARACTERS) {
            showToast(t("textTooLong"), "error")
            return
          }

          const apiKey = apiKeysRef.current[providerRef.current as keyof ApiKeys] as string
          if (!apiKey) {
            showToast(t("invalidApiKey"), "error")
            setShowSettings(true)
            return
          }

          translate({
            text,
            sourceLang: sourceLangRef.current,
            targetLang: LANGUAGES.find((l) => l.code === targetLangRef.current)?.name || targetLangRef.current,
            provider: providerRef.current,
            model: modelRef.current,
            apiKey,
            baseUrl: providerRef.current === "custom" ? apiKeysRef.current.customEndpoint : undefined,
            options: {
              tone: toneRef.current,
              mode: modeRef.current,
              creativity: creativityRef.current,
              temperature: temperatureRef.current,
            },
          })
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [translate, t, showToast])

  const handleTranslate = useCallback(() => {
    if (!sourceText.trim()) return

    if (sourceText.length > MAX_CHARACTERS) {
      showToast(t("textTooLong"), "error")
      return
    }

    const apiKey = apiKeys[provider as keyof ApiKeys] as string
    if (!apiKey) {
      showToast(t("invalidApiKey"), "error")
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
      options: { tone, mode, creativity, temperature },
    })
  }, [sourceText, sourceLang, targetLang, provider, model, tone, mode, creativity, temperature, apiKeys, translate, t, showToast])

  const swapLanguages = () => {
    if (sourceLang === "auto") return
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
  }

  if (!mounted) return null

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-4">
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        fontSize={fontSize}
        setFontSize={setFontSize}
        mounted={mounted}
      />

      <div className="flex flex-col gap-2">
        <LanguageSelector
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLang={targetLang}
          setTargetLang={setTargetLang}
          onSwap={swapLanguages}
        />

        <ControlBar
          provider={provider}
          setProvider={setProvider}
          model={model}
          setModel={setModel}
          temperature={temperature}
          setTemperature={setTemperature}
          apiKeys={apiKeys}
          t={t}
        />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0 px-4 pb-4">
        <SourcePanel
          sourceText={sourceText}
          setSourceText={setSourceText}
          onTranslate={handleTranslate}
          isTranslating={loading}
          fontSize={fontSize}
          t={t}
        />

        <ResultPanel
          translatedText={result}
          isTranslating={loading}
          fontSize={fontSize}
          t={t}
        />
      </div>

      <MobileNav />
      <Footer 
        stats={{
          in: sourceText.length,
          out: result.length,
          total: sourceText.length + result.length
        }}
        isReady={!loading}
        t={t}
      />
    </div>
  )
}
