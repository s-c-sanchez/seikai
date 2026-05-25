import { describe, expect, it } from "vitest"
import { safeParse, safeParseAsync, string } from "@/index"

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

describe.concurrent("Safe parse async method", () => {
  const schema = string()

  it("should return value when success", async () => {
    const result = await safeParseAsync(schema, "john")

    expect(result.success).toBe(true)
  })

  it("should return issues when fail", async () => {
    const result = await safeParseAsync(schema, 12)

    expect(result.success).toBe(false)
  })
})
