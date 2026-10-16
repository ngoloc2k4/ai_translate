"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/Toast"

interface ResultPanelProps {
  translatedText: string
  isTranslating: boolean
  error?: string | null
  t: (key: any) => string
}

export default function ResultPanel({
  translatedText,
  isTranslating,
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
      showToast(t("clipboardError"), "error")
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
    link.download = `translation-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const charCount = translatedText.length
  const wordCount = translatedText.trim() ? translatedText.trim().split(/\s+/).length : 0

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-2xl shadow-sm relative overflow-hidden transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-zinc-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {t("translated")}
          </span>
          {translatedText && (
            <span className="text-[10px] text-zinc-500 font-mono">
              • {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1">
          {translatedText && (
            <>
              {/* Text-To-Speech */}
              <button
                type="button"
                onClick={handleSpeak}
                aria-label={isSpeaking ? "Stop speaking translation" : "Speak translation"}
                title={isSpeaking ? "Stop speaking" : "Speak translation"}
                className={`p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer ${
                  isSpeaking
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
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
                aria-label="Download translation as text file"
                title="Download as text file"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied to clipboard" : "Copy translation"}
                title={copied ? "Copied!" : "Copy translation"}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer ${
                  copied
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t("copied") || "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{t("copy") || "Copy"}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div 
        className="flex-1 min-h-0 p-5 relative overflow-y-auto custom-scrollbar flex flex-col"
        aria-live="polite"
      >
        {error ? (
          <div 
            role="alert" 
            className="flex flex-col items-center justify-center my-auto p-6 bg-red-950/20 border border-red-900/40 rounded-xl text-center"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-3 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-red-300 mb-1">Translation Error</span>
            <span className="text-xs text-red-400/90 max-w-md">{error}</span>
          </div>
        ) : isTranslating && !translatedText ? (
          <div className="space-y-3.5 my-2">
            <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
            <div className="h-4 skeleton-shimmer rounded-lg w-full" />
            <div className="h-4 skeleton-shimmer rounded-lg w-5/6" />
            <div className="h-4 skeleton-shimmer rounded-lg w-2/3" />
          </div>
        ) : translatedText ? (
          <div className="flex-1 text-slate-100 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
            {translatedText}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              {t("translatedText") || "Translation Output"}
            </p>
            <p className="text-xs text-zinc-500 max-w-xs">
              Type or paste text on the left and click Translate (or press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Ctrl+↵</kbd>)
            </p>
          </div>
        )}
      </div>

      {/* Bottom Status Info */}
      {translatedText && (
        <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-900/20 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>{charCount.toLocaleString()} chars</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Completed
          </span>
        </div>
      )}
    </div>
  )
}
