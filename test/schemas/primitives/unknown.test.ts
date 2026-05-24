import { describe, expect, expectTypeOf, it } from "vitest"
import { parse, safeParse, unknown } from "@/index"

describe.concurrent("Unknown schema", () => {
  const schema = unknown()

  it("should have correct properties", () => {
    expect(schema.type).toBe("unknown")
    expect(schema.isAsync).toBe(false)
  })

  it.each(["john", 12, 12n, true, null, undefined, {}, []])("should parse successfully", value => {
    expect(safeParse(schema, value).success).toBe(true)
  })

  it("should return correct typescript type", () => {
    const result = parse(schema, "john")
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })
})
