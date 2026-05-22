import type { Issue, IssueInput } from "@/types/issues"
import type { ItemPath, SchemaContext } from "@/types/schemas"
import { resolvePath } from "./path"

/**
 * Helper function to add an issue to the validation context.
 *
 * @param ctx - The schema validation context where issues are collected.
 * @param path - The current path in the data structure where the validation is happening.
 * @param issue - The issue details or a simple error message string.
 *
 * @internal
 */
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
      message: issue || "Invalid input",
      path: resolvePath(path),
    }
  }

  if (!ctx.issues) ctx.issues = [newIssue]
  else ctx.issues.push(newIssue)
}
