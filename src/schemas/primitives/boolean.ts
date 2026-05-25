import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface BooleanSchema extends Schema<boolean> {
  readonly type: "boolean"
}

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
