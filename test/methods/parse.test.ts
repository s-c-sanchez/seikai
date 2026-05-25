import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, parseAsync, string } from "@/index"

describe.concurrent("Parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    const result = parse(schema, "john")

    expect(result).toBe("john")
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, "john")

    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it("should throw error when fail", () => {
    expect(() => parse(schema, 12)).toThrow("Invalid input")
  })
})

describe.concurrent("Parse async method", () => {
  const schema = string()

  it("should return value when success", async () => {
    const result = parseAsync(schema, "john")

    await expect(result).resolves.toBe("john")
  })

  it("should infer correct typescript type", async () => {
    const result = parseAsync(schema, "john")

    expectTypeOf(result).toEqualTypeOf<Promise<string>>()
  })

  it("should throw error when fail", async () => {
    await expect(() => parseAsync(schema, 12)).rejects.toThrow("Invalid input")
  })
})
