import { describe, expect, expectTypeOf, it } from "vitest"
import { date, parse, type SafeParseFail, safeParse } from "@/index"

describe.concurrent("Date schema", () => {
  const schema = date()

  it("should have correct properties", () => {
    expect(schema.type).toBe("date")
    expect(schema.isAsync).toBe(false)
  })

  it.each([new Date(), new Date("2000-01-01")])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, new Date())

    expectTypeOf(result).toEqualTypeOf<Date>()
  })

  it.each([
    "john",
    12,
    12n,
    true,
    null,
    undefined,
    {},
    [],
    new Date("john"),
  ])("should parse with issues", value => {
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
    const customSchema = date("Custom error")
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
