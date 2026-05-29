import type { Action } from "@/types/actions"

export function clamp(min: number, max: number): Action<number> {
  return {
    "~run": input => Math.min(Math.max(input, min), max),
    isAsync: false,
  }
}
