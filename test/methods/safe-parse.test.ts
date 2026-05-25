import { describe, expect, expectTypeOf, it } from "vitest"
import { type SafeParseResult, safeParse, safeParseAsync, string } from "@/index"

describe.concurrent("Safe parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    const result = safeParse(schema, "john")

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = safeParse(schema, "john")

    expectTypeOf(result).toEqualTypeOf<SafeParseResult<string>>()
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

  it("should infer correct typescript type", () => {
    const result = safeParseAsync(schema, "john")

    expectTypeOf(result).toEqualTypeOf<Promise<SafeParseResult<string>>>()
  })

  it("should return issues when fail", async () => {
    const result = await safeParseAsync(schema, 12)

    expect(result.success).toBe(false)
  })
})
