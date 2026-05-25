import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface StringSchema extends Schema<string> {
  readonly type: "string"
}

export function string(message?: string): StringSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "string") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as string
    },
    type: "string",
    isAsync: false,
  }
}
