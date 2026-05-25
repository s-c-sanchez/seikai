import type { Issue } from "@/types/issues"

export class SeikaiParseError extends Error {
  public issues: [Issue, ...Issue[]]

  constructor(issues: [Issue, ...Issue[]]) {
    super(issues[0]?.message ?? "Seikai parse error")
    this.name = "SeikaiParseError"
    this.issues = issues
  }
}
