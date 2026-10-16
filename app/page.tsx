"use client"

import { useState, useEffect } from "react"
import TranslatorPanel from "@/components/TranslatorPanel"
import { useAppSettings } from "@/store/useAppSettings"

export default function Home() {
  const { apiKeys, serverKeys, setServerKeys } = useAppSettings()
  const [showStatus, setShowStatus] = useState(false)
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false)

  useEffect(() => {
    async function fetchServerKeys() {
      try {
        const res = await fetch('/api/keys')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setServerKeys(json.data)
          }
        }
      } catch (err) {}
    }
    fetchServerKeys()
  }, [setServerKeys])

  // Priority: Client API key from Settings > Server-side key (requires login)
  const allProviders = ["gemini", "groq", "nvidia", "openrouter", "custom"]
  const configuredProviders = allProviders.filter(p => 
    (apiKeys as any)?.[p] || (p === "custom" && apiKeys?.customEndpoint) || !!(serverKeys && serverKeys[p])
  )
  const hasKeys = configuredProviders.length > 0

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[var(--background)]">
      {/* App Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[var(--border)] bg-zinc-950/70 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">
              AI Translation Lab
            </h1>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </div>

          {/* Navigation link: History */}
          <nav className="hidden md:flex items-center gap-4 ml-6 border-l border-[var(--border)] pl-6">
            <a 
              href="/history" 
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-zinc-800/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>History</span>
            </a>
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* API Provider Status Indicator - Mobile */}
          <button 
            type="button"
            onClick={() => setIsMobilePopupOpen(true)}
            aria-label="View API status"
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] active:scale-95 transition-all text-xs cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${hasKeys ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" : "bg-amber-500"}`} />
            <span className="text-[10px] font-bold text-zinc-300 font-mono">
              {configuredProviders.length}/5
            </span>
          </button>

          {/* API Provider Status Indicator - Desktop */}
          <div 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] relative cursor-pointer hover:border-zinc-700 transition-colors"
            onMouseEnter={() => setShowStatus(true)}
            onMouseLeave={() => setShowStatus(false)}
            onClick={() => {
              const event = new CustomEvent("open-settings")
              window.dispatchEvent(event)
            }}
          >
            <div className={`w-2 h-2 rounded-full ${hasKeys ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-amber-500"}`} />
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
              {hasKeys ? `${configuredProviders.length} Providers Ready` : "No API Keys"}
            </span>

            {/* Hover Tooltip Card */}
            {showStatus && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--panel)] border border-[var(--border-highlight)] rounded-xl shadow-2xl shadow-black/80 p-3 z-50 animate-in fade-in duration-150">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 border-b border-[var(--border)] pb-2 flex items-center justify-between">
                  <span>AI Providers</span>
                  <span className="text-blue-400">Settings ↗</span>
                </div>
                <div className="space-y-1.5">
                  {allProviders.map(p => {
                    const isConfigured = configuredProviders.includes(p)
                    return (
                      <div key={p} className="flex items-center justify-between py-0.5 text-xs">
                        <span className="text-zinc-300 capitalize">{p}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isConfigured ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {isConfigured ? 'READY' : 'OFFLINE'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent("open-settings")
              window.dispatchEvent(event)
            }}
            aria-label="Open settings"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Mobile Detailed Status Popup */}
      {isMobilePopupOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150" 
          onClick={() => setIsMobilePopupOpen(false)}
        >
          <div className="w-full max-w-xs bg-[var(--panel)] rounded-2xl border border-[var(--border-highlight)] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Providers Status</h3>
              <button 
                onClick={() => setIsMobilePopupOpen(false)} 
                aria-label="Close status"
                className="text-zinc-400 hover:text-white p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2.5">
              {allProviders.map(p => {
                const isConfigured = configuredProviders.includes(p)
                return (
                  <div key={p} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300 capitalize">{p}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isConfigured ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {isConfigured ? 'READY' : 'OFFLINE'}
                    </span>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => {
                setIsMobilePopupOpen(false)
                const event = new CustomEvent("open-settings")
                window.dispatchEvent(event)
              }}
              className="w-full mt-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 text-center"
            >
              Configure in Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 gap-3 overflow-hidden min-h-0">
        <TranslatorPanel />
      </main>
    </div>
  )
}
