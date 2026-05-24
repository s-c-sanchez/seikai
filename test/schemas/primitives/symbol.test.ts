import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, type SafeParseFail, safeParse, symbol } from "@/index"

describe.concurrent("Symbol schema", () => {
  const schema = symbol()

  it("should have correct properties", () => {
    expect(schema.type).toBe("symbol")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, Symbol()).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, Symbol())
    expectTypeOf(result).toEqualTypeOf<symbol>()
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
    const customSchema = symbol("Custom error")
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
