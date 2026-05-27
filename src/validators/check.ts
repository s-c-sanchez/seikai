import type { Action, AsyncAction } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

export function check<TType>(
  validator: (input: TType) => boolean,
  issue?: IssueInput | string,
): Action<TType> {
  return {
    "~run": (input, ctx, path) => {
      if (!validator(input)) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: false,
  }
}

export function checkAsync<TType>(
  validator: (input: TType) => Promise<boolean>,
  issue?: IssueInput | string,
): AsyncAction<TType> {
  return {
    "~run": async (input, ctx, path) => {
      if (!(await validator(input))) {
        addIssue(ctx, path, issue)
      }

      return input
    },
    isAsync: true,
  }
}
