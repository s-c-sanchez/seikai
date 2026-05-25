import { describe, expect, expectTypeOf, it } from "vitest"
import { any, parse, safeParse } from "@/index"

describe.concurrent("Any schema", () => {
  const schema = any()

  it("should have correct properties", () => {
    expect(schema.type).toBe("any")
    expect(schema.isAsync).toBe(false)
  })

  it.each(["john", 12, 12n, true, null, undefined, {}, []])("should parse successfully", value => {
    const result = safeParse(schema, value)

    expect(result.success).toBe(true)
  })

  it("should infer correct typescript type", () => {
    const result = parse(schema, "john")

    expectTypeOf(result).toEqualTypeOf<any>()
  })
})
