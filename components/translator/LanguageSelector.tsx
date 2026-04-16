"use client"

import { LANGUAGES } from "@/lib/constants/languages"
import { LANGUAGE_FLAGS } from "@/lib/i18n/translations"

interface LanguageSelectorProps {
  sourceLang: string
  setSourceLang: (lang: string) => void
  targetLang: string
  setTargetLang: (lang: string) => void
  onSwap: () => void
}

export default function LanguageSelector({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  onSwap
}: LanguageSelectorProps) {
  const getFlag = (code: string) => LANGUAGE_FLAGS[code] || "🌐"

  return (
    <section className="flex items-center justify-center gap-4 py-2">
      <div className="flex items-center gap-2">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="px-4 py-2 min-h-[44px] md:min-h-[36px] rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-sm font-semibold text-zinc-200 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {getFlag(l.code)} {l.name}
            </option>
          ))}
        </select>

        <button
          onClick={onSwap}
          disabled={sourceLang === "auto"}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="px-4 py-2 min-h-[44px] md:min-h-[36px] rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-sm font-semibold text-zinc-200 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors"
        >
          {LANGUAGES.filter((l) => l.code !== "auto").map((l) => (
            <option key={l.code} value={l.code}>
              {getFlag(l.code)} {l.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
