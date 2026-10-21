"use client"

import { useState } from "react"
import { useTranslation as useI18n } from "@/lib/i18n/useTranslation"
import { useHistory } from "@/hooks/useHistory"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "next/navigation"
import { LANGUAGES, getLanguageName as getLangName } from "@/lib/constants/languages"
import type { ApiKeys, HistoryItem } from "@/types"
import { useToast } from "@/components/ui/Toast"
import Footer from "@/components/translator/Footer"
import { useAppSettings } from "@/store/useAppSettings"

export default function HistoryPage() {
  const { locale, t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { apiKeys, serverKeys } = useAppSettings()
  const { items: historyItems, clear: clearHistory, deleteItem } = useHistory()
  const { translate, loading, result } = useTranslation()
  
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [editedText, setEditedText] = useState("")
  const [showDetail, setShowDetail] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all")

  // Helper to format date
  const formatRelativeDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return t("today") || "Today"
    if (date.toDateString() === yesterday.toDateString()) return t("yesterday") || "Yesterday"
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const filteredItems = historyItems.filter(item => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = !query || 
      item.sourceText.toLowerCase().includes(query) || 
      item.translatedText.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query)
      
    let matchesTime = true
    const itemDate = new Date(item.id)
    const today = new Date()
    if (timeFilter === "today") {
      matchesTime = itemDate.toDateString() === today.toDateString()
    } else if (timeFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesTime = itemDate >= weekAgo
    }
    
    return matchesSearch && matchesTime
  })

  const handleReuse = (item: HistoryItem) => {
    setSelectedItem(item)
    setEditedText(item.sourceText)
    setShowDetail(true)
  }

  const handleTranslateAgain = () => {
    if (!selectedItem || !editedText.trim()) return

    const provider = selectedItem.provider as keyof ApiKeys
    const clientKey = (apiKeys[provider] as string) || ""
    const hasServerKey = !!(serverKeys && serverKeys[provider])

    if (!clientKey && !hasServerKey) {
      const providerName = String(provider).charAt(0).toUpperCase() + String(provider).slice(1)
      showToast(`Please configure your ${providerName} API key in Settings first.`, "error")
      return
    }

    const apiKey = clientKey || ""

    translate({
      text: editedText,
      sourceLang: selectedItem.sourceLang,
      targetLang: selectedItem.targetLang,
      provider: selectedItem.provider as any,
      model: selectedItem.model || "gemini-2.5-flash",
      apiKey,
      baseUrl: selectedItem.provider === "custom" 
        ? apiKeys?.customEndpoint 
        : (selectedItem.provider === "nvidia" ? apiKeys?.nvidiaEndpoint : undefined),
      options: {
        mode: selectedItem.mode || "default",
        tone: selectedItem.tone || "default",
      },
    })
  }

  const getLanguageName = (code: string) => {
    return getLangName(code, locale)
  }

  if (showDetail && selectedItem) {
    return (
      <div className="flex-1 flex flex-col p-3 sm:p-6 gap-4 overflow-hidden bg-[var(--background)]">
        {/* Detail View Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowDetail(false)
                setSelectedItem(null)
                setEditedText("")
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to History</span>
            </button>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Translation Detail</h2>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          {/* Source Input (Editable) */}
          <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-zinc-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {getLanguageName(selectedItem.sourceLang)}
              </span>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 w-full bg-transparent p-4 text-sm leading-relaxed text-zinc-100 focus:outline-none border-none resize-none custom-scrollbar"
            />
            <div className="p-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={handleTranslateAgain}
                disabled={loading || !editedText.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? t("translating") : t("translate")}
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-zinc-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                {getLanguageName(selectedItem.targetLang)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const textToSpeak = result || selectedItem.translatedText
                    if (textToSpeak && typeof window !== "undefined" && "speechSynthesis" in window) {
                      if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel()
                      } else {
                        const utterance = new SpeechSynthesisUtterance(textToSpeak)
                        window.speechSynthesis.speak(utterance)
                      }
                    }
                  }}
                  title="Speak"
                  aria-label="Speak text"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    const textToCopy = result || selectedItem.translatedText
                    if (textToCopy) {
                      await navigator.clipboard.writeText(textToCopy)
                      showToast(t("copied") || "Copied!", "success")
                    }
                  }}
                  title="Copy"
                  aria-label="Copy translated text"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
                  <div className="h-4 skeleton-shimmer rounded-lg w-full" />
                  <div className="h-4 skeleton-shimmer rounded-lg w-5/6" />
                </div>
              ) : result ? (
                <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
              ) : (
                <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{selectedItem.translatedText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Info Bar */}
        <div className="flex flex-wrap items-center gap-4 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-xl text-xs text-zinc-400 font-mono">
          <div>
            <span className="text-zinc-500">TIME:</span> {selectedItem.time} ({formatRelativeDate(selectedItem.id)})
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div>
            <span className="text-zinc-500">PROVIDER:</span> <span className="uppercase text-blue-400">{selectedItem.provider}</span>
          </div>
          {selectedItem.mode && (
            <>
              <div className="w-px h-3 bg-zinc-800" />
              <div>
                <span className="text-zinc-500">MODE:</span> {selectedItem.mode}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // History List View
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-[env(safe-area-inset-bottom)] bg-[var(--background)]">
      <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              aria-label="Back to Workbench"
              className="p-2 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">{t("history")}</h2>
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              aria-label="Clear all history"
              className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 font-semibold transition-colors cursor-pointer"
            >
              {t("clear") || "Clear All"}
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search translation history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--panel)] border border-[var(--border)] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors"
            />
          </div>
          <div className="flex p-1 bg-[var(--panel)] border border-[var(--border)] rounded-xl overflow-x-auto custom-scrollbar gap-1">
            {(["all", "week", "today"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  timeFilter === filter 
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {filter === "all" ? "All Time" : filter === "week" ? "Last 7 Days" : "Today"}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-zinc-400 mb-1">No translation records found</p>
            <p className="text-xs text-zinc-500 max-w-xs mb-4">Translations you perform will be saved here automatically.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Start Translating
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pb-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleReuse(item)}
                className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--border)] hover:border-zinc-700/80 hover:bg-zinc-900/50 cursor-pointer transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md font-mono">
                      {formatRelativeDate(item.id)}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{item.time}</span>
                    <span className="text-[10px] font-mono text-blue-400 uppercase px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {item.provider}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        await navigator.clipboard.writeText(item.translatedText)
                        showToast(t("copied") || "Copied!", "success")
                      }}
                      title="Copy translation"
                      aria-label="Copy translation"
                      className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                      title="Delete entry"
                      aria-label="Delete entry"
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-zinc-200 text-sm line-clamp-2 mb-1.5 leading-relaxed">{item.sourceText}</p>
                <p className="text-blue-400 text-sm line-clamp-2 leading-relaxed font-medium">{item.translatedText}</p>
                <div className="flex items-center gap-2 mt-2.5 text-[10px] text-zinc-500 font-mono">
                  <span>{getLanguageName(item.sourceLang)}</span>
                  <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span>{getLanguageName(item.targetLang)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <Footer 
          stats={{
            in: 0,
            out: 0,
            total: filteredItems.length
          }}
          isReady={true}
          t={t}
        />
      </div>
    </div>
  )
}
