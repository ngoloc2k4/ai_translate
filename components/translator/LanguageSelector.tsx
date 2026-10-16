"use client"

import React, { useState, useRef, useEffect } from "react"
import { LANGUAGES } from "@/lib/constants/languages"

interface LanguageSelectorProps {
  sourceLang: string
  setSourceLang: (lang: string) => void
  targetLang: string
  setTargetLang: (lang: string) => void
  onSwap: () => void
}

function LanguageCodeBadge({ code }: { code: string }) {
  if (code === "auto") {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/15 text-blue-400 font-mono text-[10px] font-bold">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      </span>
    )
  }
  const displayCode = code.toUpperCase().replace("-TW", "")
  return (
    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono text-[10px] font-bold">
      {displayCode.slice(0, 2)}
    </span>
  )
}

interface DropdownProps {
  isOpen: boolean
  onClose: () => void
  languages: typeof LANGUAGES
  selected: string
  onSelect: (code: string) => void
  title: string
}

function LanguageDropdown({ isOpen, onClose, languages, selected, onSelect, title }: DropdownProps) {
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  )

  const popularCodes = ["auto", "en", "vi", "ja", "ko", "zh"]
  const popularLanguages = languages.filter((l) => popularCodes.includes(l.code))

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-72 max-w-[90vw] z-50 bg-[var(--panel)] border border-[var(--border-highlight)] rounded-xl shadow-2xl shadow-black/70 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-3 border-b border-[var(--border)] bg-zinc-900/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close language selector"
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <svg
            className="w-4 h-4 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search language..."
            className="w-full bg-[var(--background)] pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {!search && popularLanguages.length > 0 && (
        <div className="p-2 border-b border-[var(--border)] bg-zinc-900/30">
          <div className="text-[10px] font-semibold text-zinc-500 mb-1.5 px-1 uppercase tracking-wider">Popular</div>
          <div className="flex flex-wrap gap-1">
            {popularLanguages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  onSelect(l.code)
                  onClose()
                }}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  selected === l.code
                    ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
        {filtered.length > 0 ? (
          filtered.map((l) => {
            const isSelected = selected === l.code
            return (
              <button
                key={l.code}
                onClick={() => {
                  onSelect(l.code)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? "bg-blue-600/15 text-blue-400 font-semibold"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LanguageCodeBadge code={l.code} />
                  <span>{l.name}</span>
                </div>
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })
        ) : (
          <div className="p-4 text-center text-xs text-zinc-500">No language found</div>
        )}
      </div>
    </div>
  )
}

export default function LanguageSelector({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  onSwap
}: LanguageSelectorProps) {
  const [sourceOpen, setSourceOpen] = useState(false)
  const [targetOpen, setTargetOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const currentSource = LANGUAGES.find((l) => l.code === sourceLang) || { code: sourceLang, name: sourceLang }
  const currentTarget = LANGUAGES.find((l) => l.code === targetLang) || { code: targetLang, name: targetLang }

  const handleSwapClick = () => {
    if (sourceLang === "auto") return
    setIsSwapping(true)
    onSwap()
    setTimeout(() => setIsSwapping(false), 300)
  }

  return (
    <section className="flex items-center justify-center py-2 px-2" aria-label="Language selection">
      <div className="flex items-center gap-1.5 md:gap-3 bg-[var(--panel)] border border-[var(--border)] p-1.5 rounded-2xl shadow-sm">
        {/* Source Language Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSourceOpen(!sourceOpen)
              setTargetOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={sourceOpen}
            className="flex items-center gap-2 min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--background)] hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 text-zinc-200 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer"
          >
            <LanguageCodeBadge code={sourceLang} />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{currentSource.name}</span>
            <svg
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${sourceOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <LanguageDropdown
            isOpen={sourceOpen}
            onClose={() => setSourceOpen(false)}
            languages={LANGUAGES}
            selected={sourceLang}
            onSelect={setSourceLang}
            title="Source Language"
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwapClick}
          disabled={sourceLang === "auto"}
          aria-label={sourceLang === "auto" ? "Cannot swap auto detect language" : "Swap source and target languages"}
          title={sourceLang === "auto" ? "Cannot swap with Auto Detect" : "Swap languages"}
          className={`flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] rounded-xl bg-[var(--background)] border border-[var(--border)] text-zinc-400 hover:text-white hover:border-zinc-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isSwapping ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Target Language Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setTargetOpen(!targetOpen)
              setSourceOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={targetOpen}
            className="flex items-center gap-2 min-h-[44px] md:min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[var(--background)] hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/80 text-zinc-200 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer"
          >
            <LanguageCodeBadge code={targetLang} />
            <span className="max-w-[100px] sm:max-w-[140px] truncate">{currentTarget.name}</span>
            <svg
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${targetOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <LanguageDropdown
            isOpen={targetOpen}
            onClose={() => setTargetOpen(false)}
            languages={LANGUAGES.filter((l) => l.code !== "auto")}
            selected={targetLang}
            onSelect={setTargetLang}
            title="Target Language"
          />
        </div>
      </div>
    </section>
  )
}
