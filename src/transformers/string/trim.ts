import type { Action } from "@/types/actions"

export function trim(): Action<string> {
  return {
    "~run": input => input.trim(),
    isAsync: false,
  }
}
