import { describe, expect, it } from "vitest"
import { parse, SeikaiParseError, string } from "@/index"

describe("Parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    expect(parse(schema, "john")).toBe("john")
  })

  it("should throw error when fail", () => {
    expect(() => parse(schema, 12)).toThrow("Invalid input")
  })

  it("should expose correct issue on fail", () => {
    try {
      parse(schema, 12)
      expect.fail("Should have thrown an error")
    } catch (error) {
      expect(error).toBeInstanceOf(SeikaiParseError)

      if (error instanceof SeikaiParseError) {
        expect(error.issues.length).toBe(1)
        expect(error.issues[0].message).toBe("Invalid input")
      }
    }
  })

  it("should throw custom error message", () => {
    const customSchema = string("Custom error")

    expect(() => parse(customSchema, 12)).toThrow("Custom error")
  })
})
