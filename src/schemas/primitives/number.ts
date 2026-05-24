import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a number schema.
 */
export interface NumberSchema extends Schema<number> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "number"
}

/**
 * Creates a number schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new number schema.
 */
export function number(message?: string): NumberSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "number") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as number
    },
    type: "number",
    isAsync: false,
  }
}
