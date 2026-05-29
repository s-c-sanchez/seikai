import type { Action } from "@/types/actions"

export function round(): Action<number> {
  return {
    "~run": input => Math.round(input),
    isAsync: false,
  }
}
