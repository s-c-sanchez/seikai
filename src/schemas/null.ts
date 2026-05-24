import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a null schema.
 */
export interface NullSchema extends Schema<null> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "null"
}

/**
 * Creates a null schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new null schema.
 */
function s_null(message?: string): NullSchema {
  return {
    "~run": (input, ctx, path) => {
      if (input !== null) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as null
    },
    type: "null",
    isAsync: false,
  }
}

export { s_null as null }
