import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface SymbolSchema extends Schema<symbol> {
  readonly type: "symbol"
}

export function symbol(message?: string): SymbolSchema {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "symbol") {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as symbol
    },
    type: "symbol",
    isAsync: false,
  }
}
