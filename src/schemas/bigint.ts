import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a bigint schema.
 */
export interface BigintSchema extends Schema<bigint> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "bigint"
}

/**
 * Creates a bigint schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new bigint schema.
 */
export function bigint(message?: string): BigintSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "bigint") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as bigint
    },
    type: "bigint",
    isAsync: false,
  }
}
