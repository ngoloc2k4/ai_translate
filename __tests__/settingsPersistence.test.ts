import { describe, it, expect, beforeEach } from "bun:test"
import { useAppSettings } from "../store/useAppSettings"
import { DEFAULT_SELECTED_MODELS } from "../lib/constants/providers"

const storageMock = new Map<string, string>()
globalThis.localStorage = {
  getItem: (key: string) => storageMock.get(key) ?? null,
  setItem: (key: string, val: string) => { storageMock.set(key, val) },
  removeItem: (key: string) => { storageMock.delete(key) },
  clear: () => { storageMock.clear() },
  length: 0,
  key: () => null,
} as unknown as Storage

describe("Settings Persistence & Model Selection", () => {
  beforeEach(() => {
    storageMock.clear()
    // Reset store to initial state
    useAppSettings.setState({
      provider: "gemini",
      selectedModels: { ...DEFAULT_SELECTED_MODELS },
    })
  })

  it("should initialize with default provider and default models per provider", () => {
    const state = useAppSettings.getState()
    expect(state.provider).toBe("gemini")
    expect(state.selectedModels.gemini).toBe("gemini-2.5-flash")
    expect(state.selectedModels.groq).toBe("llama-3.3-70b-versatile")
    expect(state.selectedModels.nvidia).toBe("meta/llama-3.3-70b-instruct")
    expect(state.selectedModels.openrouter).toBe("google/gemini-2.0-flash-001")
  })

  it("should update and persist current provider", () => {
    useAppSettings.getState().setProvider("groq")
    expect(useAppSettings.getState().provider).toBe("groq")

    useAppSettings.getState().setProvider("openrouter")
    expect(useAppSettings.getState().provider).toBe("openrouter")
  })

  it("should remember chosen model independently per provider", () => {
    const store = useAppSettings.getState()

    // Select custom model for Gemini
    store.setSelectedModel("gemini", "gemini-2.5-pro")
    expect(useAppSettings.getState().selectedModels.gemini).toBe("gemini-2.5-pro")

    // Switch to Groq and select a model
    store.setProvider("groq")
    store.setSelectedModel("groq", "llama-3.1-8b-instant")
    expect(useAppSettings.getState().selectedModels.groq).toBe("llama-3.1-8b-instant")

    // Verify Gemini's model was not overwritten
    expect(useAppSettings.getState().selectedModels.gemini).toBe("gemini-2.5-pro")

    // Switch back to Gemini and verify preserved selection
    store.setProvider("gemini")
    const currentProvider = useAppSettings.getState().provider
    const currentModel = useAppSettings.getState().selectedModels[currentProvider]
    expect(currentProvider).toBe("gemini")
    expect(currentModel).toBe("gemini-2.5-pro")
  })

  it("should support custom provider models without altering other providers", () => {
    const store = useAppSettings.getState()
    store.setSelectedModel("custom", "my-local-llama3")
    
    expect(useAppSettings.getState().selectedModels.custom).toBe("my-local-llama3")
    expect(useAppSettings.getState().selectedModels.gemini).toBe("gemini-2.5-flash")
    expect(useAppSettings.getState().selectedModels.groq).toBe("llama-3.3-70b-versatile")
  })
})
