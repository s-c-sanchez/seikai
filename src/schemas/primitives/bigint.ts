import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface BigintSchema extends Schema<bigint> {
  readonly type: "bigint"
}

export function bigint(message?: string): BigintSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "bigint") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as bigint
    },
    type: "bigint",
    isAsync: false,
  }
}
