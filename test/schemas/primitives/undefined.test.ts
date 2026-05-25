import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, type SafeParseFail, undefined as s_undefined, safeParse } from "@/index"

describe.concurrent("Undefined schema", () => {
  const schema = s_undefined()

  it("should have correct properties", () => {
    expect(schema.type).toBe("undefined")
    expect(schema.isAsync).toBe(false)
  })

  it("should parse successfully", () => {
    const result = safeParse(schema, undefined)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, undefined)

    expectTypeOf(result).toEqualTypeOf<undefined>()
  })

  it.each(["john", 12, 12n, true, null, {}, []])("should parse with issues", value => {
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
    const customSchema = s_undefined("Custom error")
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
