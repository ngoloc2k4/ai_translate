"use client"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useTranslation as useI18n } from "@/lib/i18n/useTranslation"
import { useHistory } from "@/hooks/useHistory"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "next/navigation"
import { LANGUAGES } from "@/lib/constants/languages"
import type { ApiKeys, HistoryItem } from "@/types"
import { useToast } from "@/components/ui/Toast"

export default function HistoryPage() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [apiKeys] = useLocalStorage<ApiKeys>("ai_translate_keys", {})
  const { items: historyItems, clear: clearHistory, deleteItem } = useHistory()
  const { translate, loading, result } = useTranslation()
  
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [editedText, setEditedText] = useState("")
  const [showDetail, setShowDetail] = useState(false)

  const handleReuse = (item: HistoryItem) => {
    setSelectedItem(item)
    setEditedText(item.sourceText)
    setShowDetail(true)
  }

  const handleTranslateAgain = () => {
    if (!selectedItem || !editedText.trim()) return

    const provider = selectedItem.provider as keyof ApiKeys
    const apiKey = apiKeys[provider] as string

    if (!apiKey) {
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1)
      showToast(`Please configure your ${providerName} API key in Settings first.`, "error")
      return
    }

    translate({
      text: editedText,
      sourceLang: selectedItem.sourceLang,
      targetLang: selectedItem.targetLang,
      provider: selectedItem.provider as any,
      model: selectedItem.model || "gemini-2.0-flash",
      apiKey,
      baseUrl: selectedItem.provider === "custom" ? apiKeys.customEndpoint : undefined,
      options: {
        mode: selectedItem.mode || "default",
        tone: selectedItem.tone || "default",
      },
    })
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find(l => l.code === code)?.name || code
  }

  if (showDetail && selectedItem) {
    return (
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Detail View */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{t("history")}</h2>
          <button
            onClick={() => {
              setShowDetail(false)
              setSelectedItem(null)
              setEditedText("")
            }}
            className="px-4 py-2 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
          {/* Source Input (Editable) */}
          <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[10px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--background)]/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {getLanguageName(selectedItem.sourceLang)}
                </span>
              </div>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 w-full bg-transparent p-5 text-sm leading-relaxed text-zinc-200 focus:outline-none focus:ring-0 border-none resize-none custom-scrollbar mono-font"
            />
            <div className="p-3 border-t border-[var(--border)] flex gap-2">
              <button
                onClick={handleTranslateAgain}
                disabled={loading || !editedText.trim()}
                className="flex-1 px-4 py-2 rounded-[10px] bg-[var(--primary)] text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("translating") : t("translate")}
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className="flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[10px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--background)]/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">
                  {getLanguageName(selectedItem.targetLang)}
                </span>
              </div>
            </div>
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("translating")}</span>
                </div>
              ) : result ? (
                <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {result}
                </div>
              ) : (
                <div>
                  <p className="text-zinc-500 text-sm mb-4">Original translation:</p>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">{selectedItem.translatedText}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex items-center gap-4 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-[10px]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500">Time:</span>
            <span>{selectedItem.time}</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]"></div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500">Provider:</span>
            <span className="uppercase">{selectedItem.provider}</span>
          </div>
          {selectedItem.mode && (
            <>
              <div className="w-px h-4 bg-[var(--border)]"></div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-zinc-500">Mode:</span>
                <span>{selectedItem.mode}</span>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // History List View
  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-white">{t("todaysHistory")}</h2>
      </div>
      {historyItems.length > 0 && (
        <div className="flex justify-end -mt-2 mb-4">
          <button
            onClick={clearHistory}
            className="text-xs text-red-500 hover:text-red-400 font-medium"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {historyItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No history yet</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleReuse(item)}
              className="p-4 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">{item.time}</span>
                  <span className="text-[10px] text-zinc-400 uppercase px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)]">
                    {item.provider}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(item.id)
                  }}
                  className="p-1.5 rounded-[10px] hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-zinc-300 text-sm line-clamp-2 mb-1">{item.sourceText}</p>
              <p className="text-[var(--primary)] text-sm line-clamp-2">{item.translatedText}</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                <span>{getLanguageName(item.sourceLang)}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>{getLanguageName(item.targetLang)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
