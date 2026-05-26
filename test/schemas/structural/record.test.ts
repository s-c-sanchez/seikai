import { describe, expect, expectTypeOf, it } from "vitest"
import {
  type Input,
  literal,
  number,
  parse,
  parseAsync,
  record,
  recordAsync,
  type SafeParseFail,
  safeParse,
  safeParseAsync,
  string,
} from "@/index"

const _schema = record(literal("asd"), number())

type A = Input<typeof _schema>

describe.concurrent("Record schema", () => {
  const schema = record(string(), number())

  it("should have correct properties", () => {
    expect(schema.type).toBe("record")
    expect(schema.isAsync).toBe(false)
    expect(schema.keySchema.type).toBe("string")
    expect(schema.valueSchema.type).toBe("number")
  })

  it.each([{ a: 1 }, {}, { a: 1, b: 2 }])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, {})

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>()
  })

  it.each(["john", 12, 12n, null, undefined, []])("should parse with issues", value => {
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
    const customSchema = record(string(), number(), "Custom error")
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
    const result = safeParse(schema, { a: "12" })

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: ["a"],
        },
      ],
    })
  })
})

describe.concurrent("Record async schema", () => {
  const schema = recordAsync(string(), number())

  it("should have correct properties", () => {
    expect(schema.type).toBe("record")
    expect(schema.isAsync).toBe(true)
    expect(schema.keySchema.type).toBe("string")
    expect(schema.valueSchema.type).toBe("number")
  })

  it.each([{ a: 1 }, {}, { a: 1, b: 2 }])("should parse successfully", async value => {
    const result = await safeParseAsync(schema, value)

    expect(result.success).toBe(true)
  })

  it("should return correct typescript type", async () => {
    const result = parseAsync(schema, {})

    expectTypeOf(result).toEqualTypeOf<Promise<Record<string, number>>>()
  })

  it.each(["john", 12, 12n, null, undefined, []])("should parse with issues", async value => {
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
    const customSchema = recordAsync(string(), number(), "Custom error")
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
    const result = await safeParseAsync(schema, { a: "12" })

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: ["a"],
        },
      ],
    })
  })
})
