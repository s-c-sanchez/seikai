import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a symbol schema.
 */
export interface SymbolSchema extends Schema<symbol> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "symbol"
}

/**
 * Creates a symbol schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new symbol schema.
 */
export function symbol(message?: string): SymbolSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "symbol") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as symbol
    },
    type: "symbol",
    isAsync: false,
  }
}
