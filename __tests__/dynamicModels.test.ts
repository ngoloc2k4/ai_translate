import { describe, it, expect } from "bun:test"
import { GET } from "../app/api/models/route"
import { NextRequest } from "next/server"

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

    // Flagship model should be present
    const hasNemotron = json.data.some((m: { id: string }) => m.id.includes("nemotron-70b"))
    expect(hasNemotron).toBe(true)

    // EOL models should be filtered out
    const hasLlama33Eol = json.data.some((m: { id: string }) => m.id === "meta/llama-3.3-70b-instruct")
    expect(hasLlama33Eol).toBe(false)
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
