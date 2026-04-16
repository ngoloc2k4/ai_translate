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
    <footer className="min-h-[2rem] border-t border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4 text-[0.625rem] uppercase tracking-wider text-zinc-500 font-medium overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
          <span>{isReady ? t("ready") : t("translating")}</span>
        </div>
        <div className="w-px h-2.5 bg-[var(--border)]"></div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-600">{t("latency")}:</span>
          <span className="text-zinc-400 font-mono">{latency}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 font-mono text-[0.5625rem]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-zinc-600">{t("input")}:</span>
            <span className="text-zinc-300">{stats.in}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-600">{t("output")}:</span>
            <span className="text-zinc-300">{stats.out}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-600">{t("total")}:</span>
            <span className="text-[var(--primary)] font-bold">{stats.total}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
