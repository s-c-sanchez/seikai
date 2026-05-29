import type { Action } from "@/types/actions"

export function floor(): Action<number> {
  return {
    "~run": input => Math.floor(input),
    isAsync: false,
  }
}
