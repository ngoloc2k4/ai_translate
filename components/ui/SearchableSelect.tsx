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
  searchPlaceholder = "Search models...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.id === value)

  const filteredOptions = options.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      setIsOpen(false)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev < filteredOptions.length - 1 ? prev + 1 : 0
        scrollOptionIntoView(next)
        return next
      })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : filteredOptions.length - 1
        scrollOptionIntoView(next)
        return next
      })
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        onChange(filteredOptions[highlightedIndex].id)
        setIsOpen(false)
      }
    }
  }

  const scrollOptionIntoView = (index: number) => {
    if (!listRef.current) return
    const buttons = listRef.current.querySelectorAll("button[role='option']")
    if (buttons[index]) {
      buttons[index].scrollIntoView({ block: "nearest" })
    }
  }

  return (
    <div className="relative min-w-[210px]" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Model selector"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) setSearch("")
        }}
        className="w-full flex items-center justify-between min-h-[44px] md:min-h-[36px] px-3 py-2 md:py-1.5 rounded-xl bg-[var(--panel)] border border-[var(--border)] text-xs font-semibold text-zinc-200 hover:border-zinc-700/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="truncate">{selectedOption ? selectedOption.name : placeholder}</span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 top-full left-0 mt-1.5 w-full min-w-[260px] bg-[var(--panel)] border border-[var(--border-highlight)] rounded-xl shadow-2xl shadow-black/70 overflow-hidden flex flex-col max-h-[320px] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="p-2 border-b border-[var(--border)] bg-zinc-900/60">
            <div className="relative">
              <svg
                className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setHighlightedIndex(0)
                }}
                className="w-full bg-[var(--background)] pl-8 pr-7 py-1.5 rounded-lg border border-[var(--border)] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o, idx) => {
                const isSelected = value === o.id
                const isHighlighted = idx === highlightedIndex

                return (
                  <button
                    key={o.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(o.id)
                      setIsOpen(false)
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/15 text-blue-400 font-semibold"
                        : isHighlighted
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{o.name}</div>
                      {o.name !== o.id && (
                        <div className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{o.id}</div>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-6 text-center text-xs text-zinc-500">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
