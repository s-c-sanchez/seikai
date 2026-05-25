import { describe, expect, expectTypeOf, it } from "vitest"
import { bigint, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Bigint schema", () => {
  const schema = bigint()

  it("should have correct properties", () => {
    expect(schema.type).toBe("bigint")
    expect(schema.isAsync).toBe(false)
  })

  it.each([12n, 0n, -12n])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, 12n)

    expectTypeOf(result).toEqualTypeOf<bigint>()
  })

  it.each(["john", 12, true, null, undefined, {}, []])("should parse with issues", value => {
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
    const customSchema = bigint("Custom error")
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
