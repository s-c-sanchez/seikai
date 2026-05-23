import { describe, expect, it } from "vitest"
import { parse, string } from "@/index"

describe.concurrent("Parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    expect(parse(schema, "john")).toBe("john")
  })

  it("should throw error when fail", () => {
    expect(() => parse(schema, 12)).toThrow("Invalid input")
  })
})
