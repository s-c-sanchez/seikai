import { describe, expect, expectTypeOf, it } from "vitest"
import { number, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Number schema", () => {
  const schema = number()

  it("should have correct properties", () => {
    expect(schema.type).toBe("number")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, 12).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, 12)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it.each(["john", true, null, undefined, {}, []])("should parse with issues", value => {
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
