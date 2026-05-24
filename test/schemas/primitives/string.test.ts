import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, type SafeParseFail, safeParse, string } from "@/index"

describe.concurrent("String schema", () => {
  const schema = string()

  it("should have correct properties", () => {
    expect(schema.type).toBe("string")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, "john").success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, "john")
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it.each([12, 12n, true, null, undefined, {}, []])("should parse with issues", value => {
    expect(safeParse(schema, value).success).toBe(false)
  })

  it("should return correct issue", () => {
    const result = safeParse(schema, 12)

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
    const customSchema = string("Custom error")
    const result = safeParse(customSchema, 12)

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
