import { describe, expect, it } from "vitest"
import { parse, parseAsync, string } from "@/index"

describe.concurrent("Parse method", () => {
  const schema = string()

  it("should return value when success", () => {
    expect(parse(schema, "john")).toBe("john")
  })

  it("should throw error when fail", () => {
    expect(() => parse(schema, 12)).toThrow("Invalid input")
  })
})

describe.concurrent("Parse async method", () => {
  const schema = string()

  it("should return value when success", async () => {
    expect(await parseAsync(schema, "john")).toBe("john")
  })

  it("should throw error when fail", async () => {
    await expect(() => parseAsync(schema, 12)).rejects.toThrow("Invalid input")
  })
})
