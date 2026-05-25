import type { Optional } from "@/types/utils"

export interface Issue {
  readonly isFatal: boolean
  readonly message: string
  readonly path: PropertyKey[]
}

export type IssueInput = Optional<Issue>
