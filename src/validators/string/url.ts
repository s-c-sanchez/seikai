import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function url(issue?: IssueInput | string): Action<string> {
  return {
    "~run": (input, ctx, path) => {
      try {
        new URL(input)
      } catch {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
