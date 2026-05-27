import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function integer(issue?: IssueInput | string): Action<number> {
  return {
    "~run": (input, ctx, path) => {
      if (!Number.isInteger(input)) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
