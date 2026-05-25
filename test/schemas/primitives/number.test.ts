import { describe, expect, expectTypeOf, it } from "vitest"
import { number, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Number schema", () => {
  const schema = number()

  it("should have correct properties", () => {
    expect(schema.type).toBe("number")
    expect(schema.isAsync).toBe(false)
  })

  it.each([12, 0, -12])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, 12)

    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it.each(["john", 12n, true, null, undefined, {}, []])("should parse with issues", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(false)
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
    const customSchema = number("Custom error")
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
