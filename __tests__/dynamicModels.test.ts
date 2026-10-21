import { describe, it, expect } from "bun:test"
import { GET } from "../app/api/models/route"
import { NextRequest } from "next/server"
import { resolveNvidiaEndpoint } from "../lib/ai/providers/nvidia"

describe("NVIDIA Endpoint Resolver (resolveNvidiaEndpoint)", () => {
  it("should return default endpoint when url is undefined or empty", () => {
    expect(resolveNvidiaEndpoint()).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("   ")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
  })

  it("should normalize base url to /v1/chat/completions", () => {
    expect(resolveNvidiaEndpoint("https://integrate.api.nvidia.com")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("https://integrate.api.nvidia.com/")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("https://integrate.api.nvidia.com/v1")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("https://integrate.api.nvidia.com/v1/")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
    expect(resolveNvidiaEndpoint("https://integrate.api.nvidia.com/v1/chat/completions")).toBe("https://integrate.api.nvidia.com/v1/chat/completions")
  })

  it("should support private custom NIM clusters or proxies", () => {
    expect(resolveNvidiaEndpoint("http://localhost:8000")).toBe("http://localhost:8000/v1/chat/completions")
    expect(resolveNvidiaEndpoint("http://localhost:8000/v1")).toBe("http://localhost:8000/v1/chat/completions")
    expect(resolveNvidiaEndpoint("http://my-nim.internal:8000/v1/chat/completions")).toBe("http://my-nim.internal:8000/v1/chat/completions")
  })
})

describe("Dynamic Models API (/api/models)", () => {
  it("should fetch dynamic models for openrouter publicly without api key", async () => {
    const req = new NextRequest("http://localhost:3000/api/models?provider=openrouter")
    const res = await GET(req)
    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.data).toBeDefined()
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data.length).toBeGreaterThan(50)

    // Verify free models like minimax-m3.1-flash:free are present and prioritized
    const freeModels = json.data.filter((m: { id: string }) => m.id.endsWith(":free"))
    expect(freeModels.length).toBeGreaterThan(0)
    expect(json.data[0].id).toContain(":free")
  })

  it("should fetch dynamic models for nvidia publicly without api key", async () => {
    const req = new NextRequest("http://localhost:3000/api/models?provider=nvidia")
    const res = await GET(req)
    expect(res.status).toBe(200)

    const json = await res.json()
    expect(json.data).toBeDefined()
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data.length).toBeGreaterThan(10)

    // Translation flagship model should be present
    const hasRivaTranslate = json.data.some((m: { id: string }) => m.id.includes("riva-translate"))
    expect(hasRivaTranslate).toBe(true)

    // Official docs models from docs.api.nvidia.com like meta/llama-3.3-70b-instruct should be present
    const hasLlama33 = json.data.some((m: { id: string }) => m.id === "meta/llama-3.3-70b-instruct")
    expect(hasLlama33).toBe(true)
  })

  it("should return cached models on subsequent calls for high performance", async () => {
    const req1 = new NextRequest("http://localhost:3000/api/models?provider=nvidia")
    const res1 = await GET(req1)
    const json1 = await res1.json()

    const req2 = new NextRequest("http://localhost:3000/api/models?provider=nvidia")
    const res2 = await GET(req2)
    const json2 = await res2.json()

    expect(json2.cached).toBe(true)
    expect(json2.data.length).toBe(json1.data.length)
  })

  it("should return fallback models for groq and gemini when no key is provided", async () => {
    const reqGroq = new NextRequest("http://localhost:3000/api/models?provider=groq")
    const resGroq = await GET(reqGroq)
    const jsonGroq = await resGroq.json()
    expect(jsonGroq.data.length).toBeGreaterThan(0)
    expect(jsonGroq.data.some((m: { id: string }) => m.id.includes("llama-3.3-70b"))).toBe(true)

    const reqGemini = new NextRequest("http://localhost:3000/api/models?provider=gemini")
    const resGemini = await GET(reqGemini)
    const jsonGemini = await resGemini.json()
    expect(jsonGemini.data.length).toBeGreaterThan(0)
    expect(jsonGemini.data.some((m: { id: string }) => m.id.includes("gemini-2.5-flash"))).toBe(true)
  })
})
