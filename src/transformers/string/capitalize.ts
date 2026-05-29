import type { Action } from "@/types/actions"

type CapitalizeOptions = {
  mode?: "first" | "all"
  preserveCase?: boolean
}

const DEFAULT_CONFIG: Required<CapitalizeOptions> = {
  mode: "first",
  preserveCase: false,
}

export function capitalize(options?: CapitalizeOptions): Action<string> {
  const config = { ...DEFAULT_CONFIG, ...options }

  return {
    "~run": input => {
      if (!input) return ""

      if (config.mode === "first") {
        if (config.preserveCase) return input[0]!.toUpperCase() + input.slice(1)
        return input[0]!.toUpperCase() + input.slice(1).toLowerCase()
      } else {
        return input
          .split(/\s+/)
          .map(word => {
            if (config.preserveCase) return word[0]!.toUpperCase() + word.slice(1)
            return word[0]!.toUpperCase() + word.slice(1).toLowerCase()
          })
          .join(" ")
      }
    },
    isAsync: false,
  }
}
