import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, type SafeParseFail, enum as s_enum, safeParse } from "@/index"

describe.concurrent("Enum schema", () => {
  const schema = s_enum({ john: "john", doe: "doe" })
  const schema2 = s_enum(["john", "doe"])

  it("should have correct properties", () => {
    expect(schema.type).toBe("enum")
    expect(schema.isAsync).toBe(false)
    expect(schema.record).toEqual({ john: "john", doe: "doe" })

    expect(schema2.type).toBe("enum")
    expect(schema2.isAsync).toBe(false)
    expect(schema2.record).toEqual({ john: "john", doe: "doe" })
  })

  it.each(["john", "doe"])("should parse successfully", value => {
    const result = safeParse(schema, value)
    const result2 = safeParse(schema2, value)

    expect(result.success).toBe(true)
    expect(result2.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, "john")
    const result2 = parse(schema2, "john")

    expectTypeOf(result).toEqualTypeOf<"john" | "doe">()
    expectTypeOf(result2).toEqualTypeOf<"john" | "doe">()
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
  })

  it("should return custom error message", () => {
    const customSchema = s_enum({ john: "john", doe: "doe" }, "Custom error")
    const customSchema2 = s_enum(["john", "doe"], "Custom error")
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
