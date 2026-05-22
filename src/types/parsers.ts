import type { Issue } from "@/types/issues"

export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFail

export interface SafeParseSuccess<T> {
  success: true
  data: T
}

export interface SafeParseFail {
  success: false
  issues: [Issue, ...Issue[]]
}
