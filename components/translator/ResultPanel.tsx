"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/Toast"

interface ResultPanelProps {
  translatedText: string
  isTranslating: boolean
  fontSize: number
  t: (key: any) => string
}

export default function ResultPanel({
  translatedText,
  isTranslating,
  fontSize,
  t
}: ResultPanelProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[20px] shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--panel)]/50">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t("translated")}</span>
        <div className="flex items-center gap-1.5">
          {translatedText && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-[var(--background)] transition-colors text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5"
            >
              <span className="text-[10px] font-bold uppercase">{copied ? t("copied") : t("copy")}</span>
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
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 p-6 relative overflow-y-auto custom-scrollbar">
        {isTranslating && !translatedText ? (
          <div className="flex flex-col gap-3">
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-3/4"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-full"></div>
            <div className="h-4 bg-zinc-800/50 rounded-md animate-pulse w-5/6"></div>
          </div>
        ) : translatedText ? (
          <div 
            className="text-zinc-200 leading-relaxed whitespace-pre-wrap transition-all duration-300"
            style={{ fontSize: `${fontSize}px` }}
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
