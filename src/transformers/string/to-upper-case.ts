import type { Action } from "@/types/actions"

export function toUpperCase(): Action<string> {
  return {
    "~run": input => input.toUpperCase(),
    isAsync: false,
  }
}
