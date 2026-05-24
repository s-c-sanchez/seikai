import { describe, expect, expectTypeOf, it } from "vitest"
import { boolean, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Boolean schema", () => {
  const schema = boolean()

  it("should have correct properties", () => {
    expect(schema.type).toBe("boolean")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    expect(safeParse(schema, true).success).toBe(true)
    expect(safeParse(schema, false).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, []])("should parse with issues", value => {
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
    const customSchema = boolean("Custom error")
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
