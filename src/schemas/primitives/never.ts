import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface NeverSchema extends Schema<never> {
  readonly type: "never"
}

export function never(message?: string): NeverSchema {
  return {
    "~run": (input, ctx, path) => {
      addIssue(ctx, path, { isFatal: true, message })
      return input as never
    },
    type: "never",
    isAsync: false,
  }
}
