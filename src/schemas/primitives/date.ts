import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

/**
 * Represents a date schema.
 */
export interface DateSchema extends Schema<Date> {
  /**
   * The specific schema type identifier.
   */
  readonly type: "date"
}

/**
 * Creates a date schema.
 *
 * @param message - An optional custom error message to use when validation fails.
 *
 * @returns A new date schema.
 */
export function date(message?: string): DateSchema {
  return {
    "~run": (input, ctx, path) => {
      if (!(input instanceof Date) || Number.isNaN(input.getTime())) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as Date
    },
    type: "date",
    isAsync: false,
  }
}
