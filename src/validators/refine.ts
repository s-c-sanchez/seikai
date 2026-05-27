import type { Action, AsyncAction } from "@/types/actions"
import type { IssueInput } from "@/types/issues"
import { addIssue } from "@/utils/issue"

interface RefinementContext<TType> {
  readonly input: TType
  readonly addIssue: (issue: IssueInput | string) => void
}

export function refine<TType>(refinement: (ctx: RefinementContext<TType>) => void): Action<TType> {
  return {
    "~run": (input, ctx, path) => {
      const ctxAddIssue = (issue: IssueInput | string) => {
        addIssue(ctx, path, issue)
      }

      refinement({ input, addIssue: ctxAddIssue })
      return input
    },
    isAsync: false,
  }
}

export function refineAsync<TType>(
  refinement: (ctx: RefinementContext<TType>) => Promise<void>,
): AsyncAction<TType> {
  return {
    "~run": async (input, ctx, path) => {
      const ctxAddIssue = (issue: IssueInput | string) => {
        addIssue(ctx, path, issue)
      }

      await refinement({ input, addIssue: ctxAddIssue })
      return input
    },
    isAsync: true,
  }
}
