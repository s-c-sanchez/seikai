import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface NullSchema extends Schema<null> {
  readonly type: "null"
}

function s_null(message?: string): NullSchema {
  return {
    "~run": (input, ctx, path) => {
      if (input !== null) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as null
    },
    type: "null",
    isAsync: false,
  }
}

export { s_null as null }
