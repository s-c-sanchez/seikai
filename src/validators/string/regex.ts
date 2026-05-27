import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function regex(pattern: RegExp, issue?: IssueInput | string): Action<string> {
  return {
    "~run": (input, ctx, path) => {
      if (!pattern.test(input)) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
