import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function nonnegative<TType extends number | bigint>(
  issue?: IssueInput | string,
): Action<TType> {
  return {
    "~run": (input, ctx, path) => {
      if (input < 0) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
