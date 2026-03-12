"use client"

import TranslatorPanel from "@/components/TranslatorPanel"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="flex items-center gap-4">
          <div className="text-[var(--primary)] flex items-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white uppercase">
            AI Translation Lab
          </h1>
          <nav className="hidden md:flex items-center gap-5 ml-8">
            <a className="text-xs font-semibold text-white border-b border-[var(--primary)] pb-0.5" href="#">
              Workbench
            </a>
            <a className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors" href="/history">
              History
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* API Key Status - Desktop */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)]">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">API Keys</span>
          </div>
          {/* Settings Button - Desktop */}
          <button
            onClick={() => {
              const event = new CustomEvent("open-settings")
              window.dispatchEvent(event)
            }}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-[10px] bg-[var(--primary)] text-white font-bold text-xs shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <TranslatorPanel />
      </main>

      {/* Footer */}
      <footer className="h-[32px] min-h-[32px] border-t border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Ready</span>
          </div>
          <div className="w-px h-2.5 bg-[var(--border)]"></div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-600">LATENCY:</span>
            <span className="text-zinc-400 font-mono">420MS</span>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-[9px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-zinc-600">IN:</span>
              <span className="text-zinc-300">0</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-600">OUT:</span>
              <span className="text-zinc-300">0</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-600">TOTAL:</span>
              <span className="text-[var(--primary)] font-bold">0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
