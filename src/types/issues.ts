import type { Optional } from "@/types/utils"

/**
 * Represents an issue encountered during schema validation.
 */
export interface Issue {
  /**
   * Indicates if the issue prevents further validation.
   */
  readonly isFatal: boolean
  /**
   * A descriptive message about the validation error.
   */
  readonly message: string
  /**
   * The path in the input data where the issue occurred.
   */
  readonly path: PropertyKey[]
}

/**
 * Partial input for creating an issue, where all fields are optional.
 */
export type IssueInput = Optional<Issue>
