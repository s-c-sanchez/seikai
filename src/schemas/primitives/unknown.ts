import type { Schema } from "@/types/schemas"

/**
 * Represents an unknown schema.
 */
export interface UnknownSchema extends Schema<unknown> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "unknown"
}

/**
 * Creates an unknown schema.
 *
 * @returns A new unknown schema.
 */
export function unknown(): UnknownSchema {
  return {
    "~run": input => input,
    type: "unknown",
    isAsync: false,
  }
}
