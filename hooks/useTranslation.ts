"use client"

import { useState, useCallback, useRef } from "react"
import { saveHistory } from "@/lib/storage/storage"
import { logInfo, logError } from "@/lib/utils/logger"
import type { HistoryItem } from "@/types"
import type { TranslationOutput } from "@/lib/ai/prompt/jsonOutputSchema"

interface UseTranslationOptions {
  text: string
  sourceLang?: string
  targetLang: string
  provider: "gemini" | "groq" | "nvidia" | "openrouter" | "custom"
  model: string
  apiKey: string
  baseUrl?: string
  options?: {
    tone?: string
    mode?: string
    temperature?: number
    creativity?: "low" | "default" | "high"
  }
  onHistoryUpdate?: () => void
}

export function useTranslation() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latency, setLatency] = useState<string>("0MS")
  const abortControllerRef = useRef<AbortController | null>(null)

  const translate = useCallback(async (params: UseTranslationOptions) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    setResult("")
    const startTime = Date.now()

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(params.apiKey ? { "x-api-key": params.apiKey } : {}),
        },
        body: JSON.stringify(params),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        let errorMessage = "API error"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          const text = await response.text().catch(() => "")
          errorMessage = text || `Request failed with status ${response.status}`
        }
        setError(errorMessage)
        logError("Translation API Error", { provider: params.provider, error: errorMessage })
        throw new Error(errorMessage)
      }
      
      logInfo("Translation Started", { provider: params.provider, model: params.model })

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let finalText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          finalText += chunk
          setResult((prev) => prev + chunk)
        }
      } else {
        finalText = await response.text()
        setResult(finalText)
      }

      // In case an older model or custom prompt returned raw JSON, clean it up gracefully
      if (finalText.trim().startsWith('{') && finalText.trim().endsWith('}')) {
        try {
          const parsed = JSON.parse(finalText.trim()) as TranslationOutput
          if (parsed && typeof parsed.result === "string") {
            finalText = parsed.result
            setResult(parsed.result)
          }
        } catch {
          // If not valid JSON, leave finalText as-is
        }
      }

      const elapsed = Date.now() - startTime
      setLatency(`${elapsed}MS`)
      logInfo("Translation Completed", { length: finalText.length, elapsedMs: elapsed })

      // Save history
      saveHistory({
        sourceText: params.text,
        translatedText: finalText,
        sourceLang: params.sourceLang || "auto",
        targetLang: params.targetLang,
        provider: params.provider,
        model: params.model,
      })

      // Trigger history update callback
      if (params.onHistoryUpdate) {
        params.onHistoryUpdate()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Translation cancelled")
        } else {
          setError(err.message)
        }
      } else {
        setError("Translation failed")
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setLoading(false)
  }, [])

  const reset = useCallback(() => {
    setResult("")
    setError(null)
    setLatency("0MS")
  }, [])

  return {
    result,
    loading,
    error,
    latency,
    setError,
    translate,
    stop,
    reset,
  }
}
