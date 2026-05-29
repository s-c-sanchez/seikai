import type { Action } from "@/types/actions"

export function toLowerCase(): Action<string> {
  return {
    "~run": input => input.toLowerCase(),
    isAsync: false,
  }
}
