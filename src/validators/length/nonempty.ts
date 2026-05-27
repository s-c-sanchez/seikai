import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function nonempty<TType extends { length: number }>(
  issue?: IssueInput | string,
): Action<TType> {
  return {
    "~run": (input, ctx, path) => {
      if (input.length === 0) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
