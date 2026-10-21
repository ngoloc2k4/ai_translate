"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTranslation as useI18n } from "@/lib/i18n/useTranslation"
import { useTranslation } from "@/hooks/useTranslation"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/components/ui/Toast"
import { LANGUAGES } from "@/lib/constants/languages"
import { MAX_CHARACTERS, DEFAULT_SELECTED_MODELS } from "@/lib/constants/providers"
import { useAppSettings } from "@/store/useAppSettings"
import type { ApiKeys } from "@/types"
import { shouldShowToast } from "@/lib/utils/throttledToast"

// Decomposed Components
import SettingsModal from "./translator/SettingsModal"
import LanguageSelector from "./translator/LanguageSelector"
import ControlBar from "./translator/ControlBar"
import SourcePanel from "./translator/SourcePanel"
import ResultPanel from "./translator/ResultPanel"
import Footer from "./translator/Footer"

export default function TranslatorPanel() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { result, loading, error, latency, setError, translate, reset, stop } = useTranslation()

  const { 
    fontSize, 
    setFontSize, 
    mobileFontSize, 
    setMobileFontSize, 
    apiKeys, 
    setApiKeys, 
    serverKeys, 
    hasHydrated,
    provider,
    setProvider,
    selectedModels,
    setSelectedModel,
  } = useAppSettings()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useLocalStorage<string>("ai_translate_source_lang", "auto")
  const [targetLang, setTargetLang] = useLocalStorage<string>("ai_translate_target_lang", "en")

  const model = (selectedModels && selectedModels[provider]) || DEFAULT_SELECTED_MODELS[provider] || ""
  const handleSetModel = useCallback((newModel: string) => {
    setSelectedModel(provider, newModel)
  }, [provider, setSelectedModel])

  const [tone, setTone] = useState("default")
  const [mode, setMode] = useState("default")
  const [creativity, setCreativity] = useState<"low" | "default" | "high">("default")
  const [temperature, setTemperature] = useLocalStorage<number>("ai_translate_temperature", 0.7)
  const [showSettings, setShowSettings] = useState(false)

  // Refs for keyboard shortcut & auto-translate handlers
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
  const serverKeysRef = useRef(serverKeys)
  const loadingRef = useRef(loading)
  const lastTranslatedTextRef = useRef("")

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
    serverKeysRef.current = serverKeys
    loadingRef.current = loading
  }, [sourceText, sourceLang, targetLang, provider, model, tone, mode, creativity, temperature, apiKeys, serverKeys, loading])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Responsive font size detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  // System-wide font scaling
  useEffect(() => {
    if (mounted) {
      const size = isMobile ? mobileFontSize : fontSize
      document.documentElement.style.setProperty('--font-size-base', `${size}px`)
    }
  }, [fontSize, mobileFontSize, isMobile, mounted])

  // Listen for global settings event
  useEffect(() => {
    const handleOpenSettings = () => setShowSettings(true)
    window.addEventListener("open-settings", handleOpenSettings)
    return () => window.removeEventListener("open-settings", handleOpenSettings)
  }, [])

  const handleTranslate = useCallback(() => {
    const currentText = sourceTextRef.current
    if (!currentText.trim()) return

    if (currentText.length > MAX_CHARACTERS) {
      if (shouldShowToast('text_too_long')) {
        showToast(t("textTooLong"), "error")
      }
      return
    }

    const curProvider = providerRef.current
    const apiKey = (apiKeysRef.current[curProvider as keyof ApiKeys] as string) || ""
    const hasServerKey = !!(serverKeysRef.current && serverKeysRef.current[curProvider])
    if (!apiKey && !hasServerKey) {
      setError(t("invalidApiKey"))
      setShowSettings(true)
      return
    }

    lastTranslatedTextRef.current = currentText.trim()

    translate({
      text: currentText,
      sourceLang: sourceLangRef.current,
      targetLang: targetLangRef.current,
      provider: curProvider,
      model: modelRef.current,
      apiKey,
      baseUrl: curProvider === "custom" 
        ? apiKeysRef.current.customEndpoint 
        : (curProvider === "nvidia" ? apiKeysRef.current.nvidiaEndpoint : undefined),
      options: {
        tone: toneRef.current,
        mode: modeRef.current,
        creativity: creativityRef.current,
        temperature: temperatureRef.current,
      },
    })
  }, [translate, t, showToast, setError])

  // Keyboard shortcuts - uses refs to avoid frequent re-subscriptions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        if (loadingRef.current) {
          stop()
        } else {
          handleTranslate()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleTranslate, stop])

  const swapLanguages = () => {
    if (sourceLang === "auto") return
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    // If text exists, trigger translation in swapped direction
    if (sourceText.trim()) {
      lastTranslatedTextRef.current = ""
    }
  }

  if (!mounted) return null

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 overflow-hidden gap-2.5 sm:gap-3 w-full max-w-full pb-[env(safe-area-inset-bottom)]"
    >
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <div className="flex flex-col gap-1.5 shrink-0 w-full max-w-xl mx-auto px-1">
        <LanguageSelector
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLang={targetLang}
          setTargetLang={setTargetLang}
          onSwap={swapLanguages}
        />

        <ControlBar
          provider={provider}
          setProvider={(newProvider) => {
            if (newProvider !== provider) {
              setProvider(newProvider)
            }
          }}
          model={model}
          setModel={handleSetModel}
          tone={tone}
          setTone={setTone}
          mode={mode}
          setMode={setMode}
          temperature={temperature}
          setTemperature={setTemperature}
          apiKeys={apiKeys}
          t={t}
        />
      </div>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-2.5 sm:gap-4 overflow-y-auto lg:overflow-hidden min-h-0 px-1 sm:px-4 pb-2 sm:pb-3 custom-scrollbar w-full max-w-full">
        <SourcePanel
          sourceText={sourceText}
          setSourceText={setSourceText}
          onTranslate={handleTranslate}
          onStop={stop}
          isTranslating={loading}
          sourceLang={sourceLang}
          t={t}
        />

        <ResultPanel
          translatedText={result}
          isTranslating={loading}
          targetLang={targetLang}
          error={error}
          t={t}
        />
      </div>

      <div className="hidden md:block shrink-0">
        <Footer 
          stats={{
            in: sourceText.length,
            out: result.length,
            total: sourceText.length + result.length
          }}
          isReady={!loading}
          latency={latency}
          t={t}
        />
      </div>
    </div>
  )
}
