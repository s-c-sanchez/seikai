import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a boolean schema.
 */
export interface BooleanSchema extends Schema<boolean> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "boolean"
}

/**
 * Creates a boolean schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new boolean schema.
 */
export function boolean(message?: string): BooleanSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "boolean") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as boolean
    },
    type: "boolean",
    isAsync: false,
  }
}
