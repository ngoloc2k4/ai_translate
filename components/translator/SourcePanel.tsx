"use client"

import { useState, useRef } from "react"

interface SourcePanelProps {
  sourceText: string
  setSourceText: (text: string) => void
  onTranslate: () => void
  onStop: () => void
  isTranslating: boolean
  t: (key: any) => string
}

export default function SourcePanel({
  sourceText,
  setSourceText,
  onTranslate,
  onStop,
  isTranslating,
  t
}: SourcePanelProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSpeak = () => {
    if (!sourceText.trim() || typeof window === "undefined" || !("speechSynthesis" in window)) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(sourceText)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setSourceText(sourceText ? `${sourceText}\n${text}` : text)
          textareaRef.current?.focus()
        }
      }
    } catch (err) {
      // Clipboard read may require user interaction / permission
    }
  }

  const charCount = sourceText.length
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0
  const isNearLimit = charCount > 4500

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-2xl shadow-sm relative group overflow-hidden focus-within:border-blue-500/50 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-zinc-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {t("source")}
          </span>
          {sourceText.trim() && (
            <span className="text-[10px] text-zinc-500 font-mono">
              • {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1">
          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors text-xs font-medium cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline text-[10px]">Paste</span>
          </button>

          {/* Text to Speech */}
          {sourceText && (
            <button
              type="button"
              onClick={handleSpeak}
              aria-label={isSpeaking ? "Stop speaking" : "Speak source text"}
              title={isSpeaking ? "Stop speaking" : "Speak source text"}
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
          )}

          {/* Clear Button */}
          {sourceText && (
            <button
              type="button"
              onClick={() => {
                setSourceText("")
                textareaRef.current?.focus()
              }}
              aria-label={t("clear") || "Clear text"}
              title={t("clear") || "Clear text"}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 relative p-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={t("startTyping") || "Enter or paste text to translate..."}
          aria-label="Source text to translate"
          className="flex-1 w-full bg-transparent border-none outline-none text-white resize-none scroll-smooth custom-scrollbar leading-relaxed placeholder-zinc-500"
        />

        {/* Footer Bar */}
        <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono ${isNearLimit ? "text-amber-400 font-bold" : "text-zinc-500"}`}>
              {charCount.toLocaleString()} / 5,000
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isTranslating && (
              <button
                type="button"
                onClick={onStop}
                aria-label={t("stop") || "Stop translation"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" strokeWidth={2} rx="2" />
                </svg>
                <span>{t("stop") || "Stop"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onTranslate}
              disabled={!sourceText.trim() || isTranslating}
              aria-label="Translate text"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              {isTranslating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t("translating")}...</span>
                </>
              ) : (
                <>
                  <span>{t("translate")}</span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-700/60 text-blue-200 border border-blue-400/30">
                    Ctrl+↵
                  </span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
