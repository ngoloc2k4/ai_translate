"use client"

import { useTranslation } from "@/lib/i18n/useTranslation"
import { useRouter, usePathname } from "next/navigation"

export default function MobileNav() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isHistory = pathname === "/history"

  return (
    <nav 
      aria-label="Mobile navigation" 
      className="md:hidden flex items-center justify-around px-2 py-2 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[var(--border)] bg-zinc-950/90 backdrop-blur-md"
    >
      {/* Workbench / Home */}
      <button 
        type="button"
        onClick={() => router.push('/')}
        aria-label="Navigate to Workbench"
        className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] px-3 py-1 rounded-xl transition-all cursor-pointer ${
          isHome
            ? "text-blue-400 font-bold bg-blue-500/10"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] uppercase tracking-wider">{t("workbench") || "Workbench"}</span>
      </button>

      {/* History */}
      <button
        type="button"
        onClick={() => router.push('/history')}
        aria-label="Navigate to History"
        className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] px-3 py-1 rounded-xl transition-all cursor-pointer ${
          isHistory
            ? "text-blue-400 font-bold bg-blue-500/10"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] uppercase tracking-wider">{t("history") || "History"}</span>
      </button>

      {/* Settings */}
      <button
        type="button"
        onClick={() => {
          const event = new CustomEvent("open-settings")
          window.dispatchEvent(event)
        }}
        aria-label="Open Settings"
        className="flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] px-3 py-1 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px] uppercase tracking-wider">{t("settings") || "Settings"}</span>
      </button>
    </nav>
  )
}
