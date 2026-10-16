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
      console.error("Clipboard error:", err)
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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[20px] shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--panel)]/50">
        <span className="text-[0.625rem] font-bold text-zinc-500 uppercase tracking-widest">{t("translated")}</span>
        <div className="flex items-center gap-1.5">
          {translatedText && (
            <>
              {/* Text-To-Speech */}
              <button
                onClick={handleSpeak}
                title={isSpeaking ? "Stop speaking" : "Speak translation"}
                className={`p-1.5 rounded-md hover:bg-[var(--background)] transition-colors flex items-center gap-1.5 ${
                  isSpeaking ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              {/* Export/Download */}
              <button
                onClick={handleDownload}
                title="Download as text file"
                className="p-1.5 rounded-md hover:bg-[var(--background)] transition-colors text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-[var(--background)] transition-colors text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5"
              >
                <span className="text-[0.625rem] font-bold uppercase">{copied ? t("copied") : t("copy")}</span>
                {copied ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 p-6 relative overflow-y-auto custom-scrollbar">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500/80 p-4 text-center">
            <svg className="w-10 h-10 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-semibold mb-1">Error</span>
            <span className="text-xs text-red-400/80">{error}</span>
          </div>
        ) : isTranslating && !translatedText ? (
          <div className="flex flex-col gap-3">
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-3/4"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-full"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-5/6"></div>
          </div>
        ) : translatedText ? (
          <div 
            className="text-zinc-200 leading-relaxed whitespace-pre-wrap transition-all duration-300 text-[1rem]"
          >
            {translatedText}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600">
            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-xs uppercase tracking-widest font-semibold opacity-30">{t("translatedText")}</span>
          </div>
        )}
      </div>
    </div>
  )
}
