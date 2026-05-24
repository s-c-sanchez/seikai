import { describe, expect, expectTypeOf, it } from "vitest"
import { never, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Never schema", () => {
  const schema = never()

  it("should have correct properties", () => {
    expect(schema.type).toBe("never")
    expect(schema.isAsync).toBe(false)
  })

  it("should return correct typescript type", () => {
    try {
      const result = parse(schema, true)
      expectTypeOf(result).toEqualTypeOf<never>()
    } catch {}
  })

  it.each(["john", 12, 12n, true, null, undefined, {}, []])("should parse with issues", value => {
    expect(safeParse(schema, value).success).toBe(false)
  })

  it("should return correct issue", () => {
    const result = safeParse(schema, "john")

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: [],
        },
      ],
    } satisfies SafeParseFail)
  })

  it("should return custom error message", () => {
    const customSchema = never("Custom error")
    const result = safeParse(customSchema, "john")

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Custom error",
          path: [],
        },
      ],
    } satisfies SafeParseFail)
  })
})
