import type { Action } from "@/types/actions"

type NormalizationForm = "NFC" | "NFD" | "NFKC" | "NFKD"

export function normalize(form?: NormalizationForm): Action<string> {
  return {
    "~run": input => input.normalize(form),
    isAsync: false,
  }
}
