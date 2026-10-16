"use client"

import React from "react"

interface FooterProps {
  stats: {
    in: number
    out: number
    total: number
  }
  isReady?: boolean
  latency?: string
  t: (key: any) => string
}

export default function Footer({ stats, isReady = true, latency = "420MS", t }: FooterProps) {
  return (
    <footer className="h-8 border-t border-[var(--border)] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-between px-4 text-[11px] uppercase tracking-wider text-zinc-400 font-medium select-none">
      {/* Left: System Status & Latency */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-blue-500 animate-pulse'}`} />
          <span className="text-zinc-300 font-semibold">{isReady ? t("ready") || "READY" : t("translating") || "TRANSLATING..."}</span>
        </div>
        <div className="w-px h-3 bg-zinc-800" />
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-zinc-500">{t("latency") || "LATENCY"}:</span>
          <span className="text-zinc-300 font-bold px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            {latency}
          </span>
        </div>
      </div>

      {/* Right: Input / Output Statistics */}
      <div className="flex items-center gap-4 font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">{t("input") || "IN"}:</span>
          <span className="text-zinc-300 font-bold">{stats.in.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">{t("output") || "OUT"}:</span>
          <span className="text-zinc-300 font-bold">{stats.out.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">{t("total") || "TOTAL"}:</span>
          <span className="text-blue-400 font-bold">{stats.total.toLocaleString()}</span>
        </div>
      </div>
    </footer>
  )
}
