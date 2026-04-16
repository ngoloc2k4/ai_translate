"use client"

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
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--panel)] border border-[var(--border)] rounded-[20px] shadow-sm relative group overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--panel)]/50">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t("source")}</span>
        <button
          onClick={() => setSourceText("")}
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 min-h-0 relative p-4 flex flex-col">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={t("startTyping")}
          className="flex-1 w-full bg-transparent border-none outline-none text-white resize-none scroll-smooth custom-scrollbar leading-relaxed text-[length:var(--app-font-size,14px)]"
        />
        <div className="mt-4 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-mono text-zinc-600 uppercase">
            CHARS: {sourceText.length} / 5000
          </span>
          <div className="flex gap-2">
            {isTranslating && (
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-red-500/10 text-red-500 font-bold text-xs border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] transition-all pointer-events-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                </svg>
                {t("stop") || "Stop"}
              </button>
            )}
            <button
              onClick={onTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] bg-[var(--primary)] text-white font-bold text-xs shadow-xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale pointer-events-auto"
            >
              {isTranslating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t("translating")}...
                </>
              ) : (
                <>
                  {t("translate")}
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
