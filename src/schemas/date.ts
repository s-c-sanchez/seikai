import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface DateSchema extends Schema<Date> {
  readonly type: "date"
}

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
