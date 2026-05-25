import type { Schema } from "@/types/schemas"

export interface UnknownSchema extends Schema<unknown> {
  readonly type: "unknown"
}

export function unknown(): UnknownSchema {
  return {
    "~run": input => input,
    type: "unknown",
    isAsync: false,
  }
}
