import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents an undefined schema.
 */
export interface UndefinedSchema extends Schema<undefined> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "undefined"
}

/**
 * Creates an undefined schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new undefined schema.
 */
function s_undefined(message?: string): UndefinedSchema {
  return {
    "~run": (input, ctx, path) => {
      if (input !== undefined) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as undefined
    },
    type: "undefined",
    isAsync: false,
  }
}

export { s_undefined as undefined }
