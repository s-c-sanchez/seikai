import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, type SafeParseFail, null as s_null, safeParse } from "@/index"

describe.concurrent("Null schema", () => {
  const schema = s_null()

  it("should have correct properties", () => {
    expect(schema.type).toBe("null")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, null).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, null)
    expectTypeOf(result).toEqualTypeOf<null>()
  })

  it.each(["john", 12, 12n, true, undefined, {}, []])("should parse with issues", value => {
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
    const customSchema = s_null("Custom error")
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
