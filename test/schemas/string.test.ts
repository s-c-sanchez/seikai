import { describe, expect, it } from "vitest"
import { safeParse, string } from "@/index"

describe("String schema", () => {
  const schema = string()

  it("should have correct properties", () => {
    expect(schema.type).toBe("string")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, "john").success).toBeTruthy()
  })

  it("should parse with issues", () => {
    expect(safeParse(schema, 12).success).toBe(false)
    expect(safeParse(schema, true).success).toBe(false)
    expect(safeParse(schema, null).success).toBe(false)
    expect(safeParse(schema, undefined).success).toBe(false)
    expect(safeParse(schema, {}).success).toBe(false)
    expect(safeParse(schema, []).success).toBe(false)
  })

  it("should return correct issue", () => {
    const result = safeParse(schema, 12)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.length).toBe(1)
      expect(result.issues[0].message).toBe("Invalid input")
    }
  })

  it("should return custom error message", () => {
    const customSchema = string("Custom error")
    const result = safeParse(customSchema, 12)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0].message).toBe("Custom error")
    }
  })
})
