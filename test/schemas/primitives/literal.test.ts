import { describe, expect, expectTypeOf, it } from "vitest"
import { literal, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Literal schema", () => {
  const schema = literal("john")
  const schema2 = literal(["john"])

  it("should have correct properties", () => {
    expect(schema.type).toBe("literal")
    expect(schema.isAsync).toBe(false)
    expect(schema.values).toEqual(["john"])

    expect(schema2.type).toBe("literal")
    expect(schema2.isAsync).toBe(false)
    expect(schema2.values).toEqual(["john"])
  })

  it.each(["john"])("should parse successfully", value => {
    const result1 = safeParse(schema, value)
    const result2 = safeParse(schema2, value)

    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, "john")
    const result2 = parse(schema2, "john")

    expectTypeOf(result).toEqualTypeOf<"john">()
    expectTypeOf(result2).toEqualTypeOf<"john">()
  })

  it.each(["jane", 12, 12n, true, null, undefined, {}, []])("should parse with issues", value => {
    const result = safeParse(schema, value)
    const result2 = safeParse(schema2, value)

    expect(result.success).toBe(false)
    expect(result2.success).toBe(false)
  })

  it("should return correct issue", () => {
    const result = safeParse(schema, 12)
    const result2 = safeParse(schema2, 12)

    expect(result2).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: [],
        },
      ],
    } satisfies SafeParseFail)
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
    const customSchema = literal("john", "Custom error")
    const customSchema2 = literal(["john", "doe"], "Custom error")
    const result = safeParse(customSchema, 12)
    const result2 = safeParse(customSchema2, 12)

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
    expect(result2).toEqual({
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
