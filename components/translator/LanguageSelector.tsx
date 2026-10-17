"use client"

import React, { useState, useRef, useEffect } from "react"
import { LANGUAGES } from "@/lib/constants/languages"
import { useTranslation } from "@/lib/i18n/useTranslation"

interface LanguageSelectorProps {
  sourceLang: string
  setSourceLang: (lang: string) => void
  targetLang: string
  setTargetLang: (lang: string) => void
  onSwap: () => void
}

interface DropdownProps {
  isOpen: boolean
  onClose: () => void
  languages: typeof LANGUAGES
  selected: string
  onSelect: (code: string) => void
  title: string
  searchPlaceholder?: string
}

function LanguageDropdown({ 
  isOpen, 
  onClose, 
  languages, 
  selected, 
  onSelect, 
  title,
  searchPlaceholder = "Tìm kiếm ngôn ngữ..."
}: DropdownProps) {
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 40)
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

  const popularCodes = ["auto", "vi", "en", "ja", "ko", "zh"]
  const popularLanguages = languages.filter((l) => popularCodes.includes(l.code))

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 w-72 max-w-[92vw] z-50 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <svg
            className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2"
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
            placeholder={searchPlaceholder}
            className="w-full bg-[#090d16] pl-8 pr-3 py-1.5 rounded-xl border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {!search && popularLanguages.length > 0 && (
        <div className="p-2 border-b border-slate-800/80 bg-slate-900/40">
          <div className="text-[10px] font-semibold text-slate-400 mb-1.5 px-1 uppercase tracking-wider">Phổ biến</div>
          <div className="flex flex-wrap gap-1">
            {popularLanguages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  onSelect(l.code)
                  onClose()
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selected === l.code
                    ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
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
                type="button"
                onClick={() => {
                  onSelect(l.code)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/15 text-blue-400 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    {l.code.toUpperCase().replace("-TW", "").slice(0, 2)}
                  </span>
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
          <div className="p-4 text-center text-xs text-slate-500">Không tìm thấy ngôn ngữ</div>
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
  const { t } = useTranslation()
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
    <section className="w-full flex items-center justify-center py-1" aria-label="Bộ chọn ngôn ngữ">
      <div className="w-full max-w-xl flex items-center justify-between gap-1.5 sm:gap-3 bg-[#0f172a] border border-slate-800/80 p-1.5 rounded-2xl shadow-sm">
        {/* Source Language Picker */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              setSourceOpen(!sourceOpen)
              setTargetOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={sourceOpen}
            className="w-full flex items-center justify-between min-h-[44px] px-3 py-1.5 rounded-xl bg-[#090d16] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer group"
          >
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("from") || "Từ"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {currentSource.name}
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${sourceOpen ? "rotate-180" : ""}`}
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
            title={t("sourceLanguage") || "Ngôn ngữ nguồn"}
            searchPlaceholder={t("startTyping") || "Tìm ngôn ngữ..."}
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwapClick}
          disabled={sourceLang === "auto"}
          aria-label={t("swapLanguages") || "Đổi ngôn ngữ"}
          title={sourceLang === "auto" ? "Không thể đổi chiều khi đang Tự động phát hiện" : "Đổi chiều ngôn ngữ"}
          className={`flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-[#090d16] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isSwapping ? "rotate-180 text-blue-400" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Target Language Picker */}
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              setTargetOpen(!targetOpen)
              setSourceOpen(false)
            }}
            aria-haspopup="listbox"
            aria-expanded={targetOpen}
            className="w-full flex items-center justify-between min-h-[44px] px-3 py-1.5 rounded-xl bg-[#090d16] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer group"
          >
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {t("to") || "Sang"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {currentTarget.name}
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${targetOpen ? "rotate-180" : ""}`}
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
            title={t("targetLanguage") || "Ngôn ngữ đích"}
            searchPlaceholder={t("startTyping") || "Tìm ngôn ngữ..."}
          />
        </div>
      </div>
    </section>
  )
}
