"use client"

import { useState, useEffect } from "react"
import TranslatorPanel from "@/components/TranslatorPanel"
import { useAppSettings } from "@/store/useAppSettings"

export default function Home() {
  const { apiKeys, serverKeys, setServerKeys } = useAppSettings()
  const [showStatus, setShowStatus] = useState(false)

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
  }, [])

  const allProviders = ["gemini", "groq", "nvidia", "openrouter", "custom"]
  const configuredProviders = allProviders.filter(p => 
    serverKeys[p] || (apiKeys as any)[p] || (p === "custom" && apiKeys.customEndpoint)
  )
  const hasKeys = configuredProviders.length > 0
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
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
          {/* Mobile API Status Indicator */}
          <div className="md:hidden flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--panel)] border border-[var(--border)]">
            <div className={`w-1.5 h-1.5 rounded-full ${hasKeys ? "bg-emerald-500" : "bg-amber-500"}`}></div>
          </div>
          <nav className="hidden md:flex items-center gap-5 ml-8">
            <a className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors" href="/history">
              History
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* API Key Status - Desktop */}
          <div 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[var(--panel)] border border-[var(--border)] relative cursor-help"
            onMouseEnter={() => setShowStatus(true)}
            onMouseLeave={() => setShowStatus(false)}
          >
            <div className={`w-2 h-2 rounded-full ${hasKeys ? "bg-emerald-500" : "bg-amber-500"}`}></div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase">
              API Keys {hasKeys && `(${configuredProviders.length})`}
            </span>
            
            {/* Tooltip */}
            {showStatus && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-xl shadow-black/50 p-3 z-50">
                <div className="text-[10px] font-bold text-white uppercase mb-2 border-b border-[var(--border)] pb-2">Configured Keys</div>
                {allProviders.map(p => {
                  const isConfigured = configuredProviders.includes(p)
                  return (
                    <div key={p} className="flex items-center justify-between py-1">
                      <span className="text-xs text-zinc-400 capitalize">{p}</span>
                      <span className={`text-[10px] font-bold ${isConfigured ? 'text-emerald-500' : 'text-zinc-600'}`}>
                        {isConfigured ? 'READY' : 'MISSING'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
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
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden min-h-0">
        <TranslatorPanel />
      </main>
    </div>
  )
}
