import { describe, expect, expectTypeOf, it } from "vitest"
import {
  object,
  objectAsync,
  parse,
  parseAsync,
  type SafeParseFail,
  safeParse,
  safeParseAsync,
  string,
} from "@/index"

describe.concurrent("Object schema", () => {
  const schema = object({ name: string() })

  it("should have correct properties", () => {
    expect(schema.type).toBe("object")
    expect(schema.isAsync).toBe(false)
    expect(schema.shape.name.type).toBe("string")
  })

  it.each([{ name: "john" }, { name: "john", age: 12 }])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, { name: "john" })

    expectTypeOf(result).toEqualTypeOf<{ name: string }>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, []])("should parse with issues", value => {
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
    const customSchema = object({ name: string() }, "Custom error")
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
    const result = safeParse(schema, { name: 12 })

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: ["name"],
        },
      ],
    })
  })
})

describe.concurrent("Object async schema", () => {
  const schema = objectAsync({ name: string() })

  it("should have correct properties", () => {
    expect(schema.type).toBe("object")
    expect(schema.isAsync).toBe(true)
    expect(schema.shape.name.type).toBe("string")
  })

  it.each([
    { name: "john" },
    { name: "john", age: 12 },
  ])("should parse successfully", async value => {
    const result = await safeParseAsync(schema, value)

    expect(result.success).toBe(true)
  })

  it("should return correct typescript type", async () => {
    const result = parseAsync(schema, { name: "john" })

    expectTypeOf(result).toEqualTypeOf<Promise<{ name: string }>>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, []])("should parse with issues", async value => {
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
    const customSchema = objectAsync({ name: string() }, "Custom error")
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
    const result = await safeParseAsync(schema, { name: 12 })

    expect(result).toEqual({
      success: false,
      issues: [
        {
          isFatal: true,
          message: "Invalid input",
          path: ["name"],
        },
      ],
    })
  })
})
