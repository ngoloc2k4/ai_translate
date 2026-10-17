"use client"

import React, { useState, useRef, useEffect } from "react"
import { LANGUAGES, getLanguageName } from "@/lib/constants/languages"
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
  align?: "left" | "right"
  searchPlaceholder?: string
}

function LanguageDropdown({ 
  isOpen, 
  onClose, 
  languages, 
  selected, 
  onSelect, 
  title,
  align = "left",
  searchPlaceholder = "Tìm kiếm ngôn ngữ..."
}: DropdownProps) {
  const { locale, t } = useTranslation()
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 50)
      // Lock body scroll on mobile
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        document.body.style.overflow = "hidden"
      }
    } else {
      if (typeof window !== "undefined") {
        document.body.style.overflow = ""
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      // On desktop, close when clicking outside container
      if (window.innerWidth >= 768 && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const query = search.trim().toLowerCase()
  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(query) ||
    l.viName.toLowerCase().includes(query) ||
    l.koName.toLowerCase().includes(query) ||
    l.code.toLowerCase().includes(query)
  )

  const popularCodes = ["auto", "vi", "en", "ko", "ja", "zh"]
  const popularLanguages = languages.filter((l) => popularCodes.includes(l.code))
  // Avoid duplicating popular languages in the list immediately below
  const otherLanguages = languages.filter((l) => !popularCodes.includes(l.code))

  const desktopAlignClass = align === "right" 
    ? "md:right-0 md:left-auto" 
    : "md:left-0 md:right-auto"

  return (
    <>
      {/* Backdrop for Mobile Bottom Sheet */}
      <div 
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container: Bottom Sheet on Mobile, Anchored Dropdown on Desktop */}
      <div
        ref={dropdownRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed inset-x-0 bottom-0 z-50 w-full max-h-[85vh] bg-[#0b1220] border-t border-slate-700/80 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200 md:fixed-none md:absolute md:inset-auto md:top-full md:mt-2 md:w-88 md:max-h-[480px] md:rounded-2xl md:border md:border-slate-700/80 md:pb-0 md:shadow-2xl md:backdrop-blur-md md:animate-in md:fade-in md:zoom-in-95 ${desktopAlignClass}`}
      >
        {/* Mobile Pull Handle */}
        <div className="md:hidden flex justify-center py-2 shrink-0">
          <div className="w-12 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex items-center justify-center min-w-[36px] min-h-[36px] p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/30 shrink-0">
          <div className="relative">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
              aria-label={searchPlaceholder}
              className="w-full bg-[#070b14] pl-9 pr-8 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  inputRef.current?.focus()
                }}
                aria-label="Xóa tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Selection Chips (When not searching) */}
        {!search && popularLanguages.length > 0 && (
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 shrink-0">
            <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              {t("popularLanguages") || "Phổ biến"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularLanguages.map((l) => {
                const isSelected = selected === l.code
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onSelect(l.code)
                      onClose()
                    }}
                    className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400"
                        : "bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {getLanguageName(l.code, locale)}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Scrollable Language List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 min-h-[160px]">
          {search ? (
            // Search Results
            filtered.length > 0 ? (
              filtered.map((l) => {
                const isSelected = selected === l.code
                const localizedName = getLanguageName(l.code, locale)
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onSelect(l.code)
                      onClose()
                    }}
                    className={`w-full flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30"
                        : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                        {l.code.toUpperCase().replace("-TW", "").slice(0, 2)}
                      </span>
                      <span className="truncate">{localizedName}</span>
                      {locale !== "en" && localizedName !== l.name && (
                        <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                          ({l.name})
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="p-6 text-center text-xs sm:text-sm text-slate-500">
                Không tìm thấy ngôn ngữ &quot;{search}&quot;
              </div>
            )
          ) : (
            // Non-search List: Display other languages without duplicate popular items
            <>
              <div className="px-2 pt-1 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("allLanguages") || "Tất cả ngôn ngữ"}
              </div>
              {otherLanguages.map((l) => {
                const isSelected = selected === l.code
                const localizedName = getLanguageName(l.code, locale)
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onSelect(l.code)
                      onClose()
                    }}
                    className={`w-full flex items-center justify-between min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30"
                        : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                        {l.code.toUpperCase().replace("-TW", "").slice(0, 2)}
                      </span>
                      <span className="truncate">{localizedName}</span>
                      {locale !== "en" && localizedName !== l.name && (
                        <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                          ({l.name})
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function LanguageSelector({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  onSwap
}: LanguageSelectorProps) {
  const { locale, t } = useTranslation()
  const [sourceOpen, setSourceOpen] = useState(false)
  const [targetOpen, setTargetOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const handleSwapClick = () => {
    if (sourceLang === "auto") return
    setIsSwapping(true)
    onSwap()
    setTimeout(() => setIsSwapping(false), 300)
  }

  const localizedSourceName = getLanguageName(sourceLang, locale)
  const localizedTargetName = getLanguageName(targetLang, locale)

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
            aria-haspopup="dialog"
            aria-expanded={sourceOpen}
            className="w-full flex items-center justify-between min-h-[44px] px-3 py-1.5 rounded-xl bg-[#070b14] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer group"
          >
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("from") || "Từ"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {localizedSourceName}
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
            align="left"
            searchPlaceholder={t("searchLanguage") || "Tìm kiếm ngôn ngữ..."}
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwapClick}
          disabled={sourceLang === "auto"}
          aria-label={t("swapLanguages") || "Đổi ngôn ngữ"}
          title={sourceLang === "auto" ? "Không thể đổi chiều khi đang Tự động phát hiện" : "Đổi chiều ngôn ngữ"}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-[#070b14] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
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
            aria-haspopup="dialog"
            aria-expanded={targetOpen}
            className="w-full flex items-center justify-between min-h-[44px] px-3 py-1.5 rounded-xl bg-[#070b14] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer group"
          >
            <div className="flex flex-col min-w-0 pr-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                {t("to") || "Sang"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {localizedTargetName}
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
            align="right"
            searchPlaceholder={t("searchLanguage") || "Tìm kiếm ngôn ngữ..."}
          />
        </div>
      </div>
    </section>
  )
}
