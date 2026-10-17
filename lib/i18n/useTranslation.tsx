"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { translations, Locale } from "@/lib/i18n/translations"

export type TranslationKey = keyof typeof translations.en

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, fallback?: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_translate_locale") as Locale
      if (saved && (saved === "vi" || saved === "en" || saved === "ko")) {
        setLocaleState(saved)
      } else {
        const navLang = typeof navigator !== "undefined" ? navigator.language : "vi"
        if (navLang.startsWith("vi")) setLocaleState("vi")
        else if (navLang.startsWith("ko")) setLocaleState("ko")
        else setLocaleState("en")
      }
    } catch (e) {}
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem("ai_translate_locale", newLocale)
    } catch (e) {}
  }

  const t = (key: string, fallback?: string): string => {
    const currentDict = (translations as any)[locale] || translations.vi
    const englishDict = translations.en
    return currentDict[key] || englishDict[key as keyof typeof englishDict] || fallback || key
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
