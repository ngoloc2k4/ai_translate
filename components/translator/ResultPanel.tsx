"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/Toast"
import { VOICE_LANGUAGE_MAP } from "@/lib/constants/languages"

interface ResultPanelProps {
  translatedText: string
  isTranslating: boolean
  targetLang?: string
  error?: string | null
  t: (key: any, fallback?: string) => string
}

export default function ResultPanel({
  translatedText,
  isTranslating,
  targetLang = "en",
  error,
  t
}: ResultPanelProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleCopy = async () => {
    if (!translatedText) return
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showToast(t("clipboardError") || "Không thể sao chép vào bộ nhớ tạm", "error")
    }
  }

  const handleSpeak = () => {
    if (!translatedText || typeof window === "undefined" || !("speechSynthesis" in window)) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(translatedText)
    utterance.lang = VOICE_LANGUAGE_MAP[targetLang] || "en-US"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleDownload = () => {
    if (!translatedText) return
    const blob = new Blob([translatedText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ban-dich-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const charCount = translatedText.length
  const wordCount = translatedText.trim() ? translatedText.trim().split(/\s+/).length : 0

  return (
    <div className="flex-1 min-h-[160px] sm:min-h-0 flex flex-col bg-[#0f172a] border border-slate-800 rounded-2xl shadow-sm relative overflow-hidden transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-slate-800/80 bg-slate-900/50 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-slate-300 truncate">
            {t("resultTitle") || "Bản dịch"}
          </span>
          {translatedText && (
            <span className="text-[11px] text-slate-500 font-mono hidden xs:inline shrink-0">
              • {wordCount} {t("words") || "từ"}
            </span>
          )}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1.5">
          {translatedText && (
            <>
              {/* Text-To-Speech */}
              <button
                type="button"
                onClick={handleSpeak}
                aria-label={isSpeaking ? "Dừng đọc" : "Nghe phát âm bản dịch"}
                title={isSpeaking ? "Dừng đọc" : "Nghe phát âm bản dịch"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSpeaking
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Tải về file văn bản"
                title="Tải về file .txt"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Copy Button with confirmation feedback */}
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Đã sao chép" : "Sao chép bản dịch"}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("copied") || "Đã chép!"}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{t("copy") || "Sao chép"}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div 
        className="flex-1 min-h-[90px] sm:min-h-0 p-3 sm:p-5 relative overflow-y-auto custom-scrollbar flex flex-col"
        aria-live="polite"
      >
        {error ? (
          <div 
            role="alert" 
            className="flex flex-col items-center justify-center my-auto p-4 sm:p-6 bg-red-950/20 border border-red-900/40 rounded-2xl text-center"
          >
            <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center mb-2.5 text-red-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-red-300 mb-1">{t("translationError") || "Lỗi dịch thuật"}</span>
            <span className="text-xs text-red-400/90 max-w-md">{error}</span>
          </div>
        ) : isTranslating && !translatedText ? (
          <div className="space-y-3 my-auto w-full py-4">
            <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
            <div className="h-4 skeleton-shimmer rounded-lg w-full" />
            <div className="h-4 skeleton-shimmer rounded-lg w-5/6" />
            <div className="h-4 skeleton-shimmer rounded-lg w-2/3" />
          </div>
        ) : translatedText ? (
          <div className="flex-1 text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
            {translatedText}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-3 sm:p-6 my-auto">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
              {t("emptyStateTitle") || "Bản dịch sẽ xuất hiện ở đây"}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs leading-relaxed">
              {t("emptyStateDesc") || "Nhập hoặc dán văn bản phía trên rồi nhấn nút Dịch để bắt đầu."}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Status Info */}
      {translatedText && (
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <span>{charCount.toLocaleString()} {t("chars") || "ký tự"}</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("ready") || "Hoàn thành"}
          </span>
        </div>
      )}
    </div>
  )
}
