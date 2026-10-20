import { describe, it, expect } from "bun:test"
import { sanitizeModel, sanitizeInput, sanitizeLanguageCode } from "../lib/utils/sanitizeInput"

describe("sanitizeModel", () => {
  it("should preserve valid model names with colons like :free", () => {
    expect(sanitizeModel("minimax/minimax-m3.1-flash:free")).toBe("minimax/minimax-m3.1-flash:free")
    expect(sanitizeModel("meta-llama/llama-3.3-70b-instruct:free")).toBe("meta-llama/llama-3.3-70b-instruct:free")
    expect(sanitizeModel("google/gemini-2.0-flash-001")).toBe("google/gemini-2.0-flash-001")
    expect(sanitizeModel("nvidia/llama-3.1-nemotron-70b-instruct")).toBe("nvidia/llama-3.1-nemotron-70b-instruct")
  })

  it("should strip dangerous or invalid characters", () => {
    expect(sanitizeModel("minimax/model<tag>alert(1)</tag>")).toBe("minimax/modeltagalert1/tag")
    expect(sanitizeModel("model with spaces")).toBe("modelwithspaces")
    expect(sanitizeModel('model"name\'')).toBe("modelname")
  })

  it("should handle empty or null values gracefully", () => {
    expect(sanitizeModel("")).toBe("")
    expect(sanitizeModel(null as unknown as string)).toBe("")
  })

  it("should enforce maximum length boundary", () => {
    const longModel = "a/".repeat(100)
    expect(sanitizeModel(longModel).length).toBeLessThanOrEqual(150)
  })
})

describe("sanitizeInput and sanitizeLanguageCode", () => {
  it("should sanitize language codes properly", () => {
    expect(sanitizeLanguageCode("en")).toBe("en")
    expect(sanitizeLanguageCode("zh-CN")).toBe("zh-CN")
    expect(sanitizeLanguageCode("vi (Vietnamese)")).toBe("vi (Vietnamese)")
    expect(sanitizeLanguageCode("en!@#$%^&*")).toBe("en")
  })

  it("should sanitize user input text", () => {
    expect(sanitizeInput("Hello world")).toBe("Hello world")
    expect(sanitizeInput("<script>alert(1)</script>Hello")).toBe("Hello")
  })
})
