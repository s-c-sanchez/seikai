import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function includes(requirement: string, issue?: IssueInput | string): Action<string> {
  return {
    "~run": (input, ctx, path) => {
      if (!input.includes(requirement)) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
