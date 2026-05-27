import type { Action } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function multipleOf<TType extends number | bigint>(
  value: NoInfer<TType>,
  issue?: IssueInput | string,
): Action<TType> {
  return {
    "~run": (input, ctx, path) => {
      if (input % value > 0) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}
