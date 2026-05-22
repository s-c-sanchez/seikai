import { describe, expect, it } from "vitest"
import { safeParse, string } from "@/index"

describe("Safe parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    const result = safeParse(schema, "john")

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe("john")
    }
  })

  it("should return issues when fail", () => {
    const result = safeParse(schema, 12)

    expect(result.success).toBe(false)
  })

  it("should return correct issue on fail", () => {
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
