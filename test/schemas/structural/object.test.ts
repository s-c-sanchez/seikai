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

  it("should parse successfully", () => {
    expect(safeParse(schema, { name: "john" }).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, { name: "john" })
    expectTypeOf(result).toEqualTypeOf<{ name: string }>()
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
})

describe.concurrent("Object async schema", () => {
  const schema = objectAsync({ name: string() })

  it("should have correct properties", () => {
    expect(schema.type).toBe("object")
    expect(schema.isAsync).toBe(true)
    expect(schema.shape.name.type).toBe("string")
  })

  it("should parse successfully", async () => {
    expect((await safeParseAsync(schema, { name: "john" })).success).toBe(true)
  })

  it("should return correct typescript type", async () => {
    const result = await parseAsync(schema, { name: "john" })
    expectTypeOf(result).toEqualTypeOf<{ name: string }>()
  })

  it.each(["john", 12, 12n, null, undefined, {}, []])("should parse with issues", async value => {
    expect((await safeParseAsync(schema, value)).success).toBe(false)
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
})
