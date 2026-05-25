import { describe, expect, expectTypeOf, it } from "vitest"
import {
  array,
  arrayAsync,
  parse,
  parseAsync,
  type SafeParseFail,
  safeParse,
  safeParseAsync,
  string,
} from "@/index"

describe.concurrent("Array schema", () => {
  const schema = array(string())

  it("should have correct properties", () => {
    expect(schema.type).toBe("array")
    expect(schema.isAsync).toBe(false)
    expect(schema.inner.type).toBe("string")
  })

  it.each([{ input: ["john"] }, { input: [] }])("should parse successfully", value => {
    const result = safeParse(schema, value.input)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, [])

    expectTypeOf(result).toEqualTypeOf<string[]>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, [12]])("should parse with issues", value => {
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
    const customSchema = array(string(), "Custom error")
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

  it("should return correct nested issues", () => {
    const result = safeParse(schema, [12])

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: [0],
        },
      ],
    })
  })
})

describe.concurrent("Array async schema", () => {
  const schema = arrayAsync(string())

  it("should have correct properties", () => {
    expect(schema.type).toBe("array")
    expect(schema.isAsync).toBe(true)
    expect(schema.inner.type).toBe("string")
  })

  it.each([{ input: ["john"] }, { input: [] }])("should parse successfully", async value => {
    const result = await safeParseAsync(schema, value.input)

    expect(result.success).toBe(true)
  })

  it("should return correct typescript type", async () => {
    const result = parseAsync(schema, [])

    expectTypeOf(result).toEqualTypeOf<Promise<string[]>>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, [12]])("should parse with issues", async value => {
    const result = await safeParseAsync(schema, value)

    expect(result.success).toBe(false)
  })

  it("should return correct issue", async () => {
    const result = await safeParseAsync(schema, "john")

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

  it("should return custom error message", async () => {
    const customSchema = arrayAsync(string(), "Custom error")
    const result = await safeParseAsync(customSchema, "john")

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

  it("should return correct nested issues", async () => {
    const result = await safeParseAsync(schema, [12])

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: [0],
        },
      ],
    })
  })
})
