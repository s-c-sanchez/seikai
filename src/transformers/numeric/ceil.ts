import type { Action } from "@/types/actions"

export function ceil(): Action<number> {
  return {
    "~run": input => Math.ceil(input),
    isAsync: false,
  }
}
