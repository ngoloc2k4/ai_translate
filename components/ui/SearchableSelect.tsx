"use client"

import React, { useState, useRef, useEffect } from "react"

export interface SearchableSelectOption {
  id: string
  name: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.id === value)

  const filteredOptions = options.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative min-w-[200px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) setSearch("")
        }}
        className="w-full flex items-center justify-between min-h-[44px] md:min-h-[32px] px-3 py-2 md:py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--border)] text-xs font-semibold text-zinc-200 outline-none hover:border-zinc-600 transition-colors"
      >
        <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-xl shadow-black/50 overflow-hidden flex flex-col max-h-[300px]">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--background)] px-3 py-2 rounded-md border border-[var(--border)] text-xs text-zinc-200 outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    onChange(o.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                    value === o.id
                      ? "bg-[var(--primary)] text-white font-bold"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <div className="truncate">{o.name}</div>
                  {o.name !== o.id && (
                    <div className="text-[9px] text-zinc-500 truncate mt-0.5">{o.id}</div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-zinc-500">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
