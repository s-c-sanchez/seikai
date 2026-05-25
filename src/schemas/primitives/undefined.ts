import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface UndefinedSchema extends Schema<undefined> {
  readonly type: "undefined"
}

function s_undefined(message?: string): UndefinedSchema {
  return {
    "~run": (input, ctx, path) => {
      if (input !== undefined) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as undefined
    },
    type: "undefined",
    isAsync: false,
  }
}

export { s_undefined as undefined }
