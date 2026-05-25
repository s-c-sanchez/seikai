import type { Schema } from "@/types/schemas"

export interface AnySchema extends Schema<any> {
  readonly type: "any"
}

export function any(): AnySchema {
  return {
    "~run": input => input,
    type: "any",
    isAsync: false,
  }
}
