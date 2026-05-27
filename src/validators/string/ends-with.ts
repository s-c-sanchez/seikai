import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function endsWith(requirement: string, issue?: IssueInput | string): Action<string> {
  return {
    "~run": (input, ctx, path) => {
      if (!input.endsWith(requirement)) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
