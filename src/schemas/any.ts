import type { Schema } from "@/types/schemas"

/**
 * Represents an any schema.
 */
export interface AnySchema extends Schema<any> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "any"
}

/**
 * Creates an any schema.
 *
 * @returns A new any schema.
 */
export function any(): AnySchema {
  return {
    "~run": input => input,
    type: "any",
    isAsync: false,
  }
}
