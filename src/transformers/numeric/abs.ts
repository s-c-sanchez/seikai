import type { Action } from "@/types/actions"

export function abs(): Action<number> {
  return {
    "~run": input => Math.abs(input),
    isAsync: false,
  }
}
