import { describe, expect, it } from "vitest"
import { safeParse, string } from "@/index"

describe.concurrent("Safe parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    const result = safeParse(schema, "john")

    expect(result.success).toBe(true)
  })

  it("should return issues when fail", () => {
    const result = safeParse(schema, 12)

    expect(result.success).toBe(false)
  })
})
