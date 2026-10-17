"use client"

import { useEffect } from "react"
import TranslatorPanel from "@/components/TranslatorPanel"
import { useAppSettings } from "@/store/useAppSettings"

export default function Home() {
  const { setServerKeys } = useAppSettings()

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

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#090d16]">
      {/* Streamlined App Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Logo Badge */}
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Translation Lab
            </h1>
          </div>

          {/* Navigation link: History */}
          <nav className="hidden md:flex items-center gap-4 ml-4 border-l border-slate-800 pl-4">
            <a 
              href="/history" 
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Lịch sử</span>
            </a>
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent("open-settings")
              window.dispatchEvent(event)
            }}
            aria-label="Cài đặt"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/70 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Cài đặt</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 gap-2 overflow-hidden min-h-0">
        <TranslatorPanel />
      </main>
    </div>
  )
}
