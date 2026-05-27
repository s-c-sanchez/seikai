import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface NumberSchema extends Schema<number> {
  readonly type: "number"
}

export function number(message?: string): NumberSchema {
  return {
    "~run": (input, ctx, path) => {
      if (!Number.isFinite(input)) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as number
    },
    type: "number",
    isAsync: false,
  }
}
