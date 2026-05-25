import type { Issue, IssueInput } from "@/types/issues"
import type { ItemPath, SchemaContext } from "@/types/schemas"
import { resolvePath } from "./path"

export function addIssue(
  ctx: SchemaContext,
  path: ItemPath | undefined,
  issue: IssueInput | string | undefined,
): void {
  let newIssue: Issue

  if (typeof issue === "object") {
    newIssue = {
      isFatal: issue.isFatal ?? false,
      message: issue.message ?? "Invalid input",
      path: issue.path ? [...resolvePath(path), ...issue.path] : resolvePath(path),
    }
  } else {
    newIssue = {
      isFatal: false,
      message: issue ?? "Invalid input",
      path: resolvePath(path),
    }
  }

  if (!ctx.issues) ctx.issues = [newIssue]
  else ctx.issues.push(newIssue)
}
