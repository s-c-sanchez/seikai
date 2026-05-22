import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a string schema.
 */
export interface StringSchema extends Schema<string> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "string"
}

/**
 * Creates a string schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new string schema.
 */
export function string(message?: string): StringSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "string") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as string
    },
    type: "string",
    isAsync: false,
  }
}
