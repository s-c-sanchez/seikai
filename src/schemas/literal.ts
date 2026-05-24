import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export type LiteralValues = string | number | bigint | boolean | null | undefined | symbol

export interface LiteralSchema<T extends LiteralValues | readonly LiteralValues[]>
  extends Schema<T extends readonly LiteralValues[] ? T[number] : T> {
  readonly type: "literal"
  readonly values: T extends readonly LiteralValues[] ? T : readonly [T]
}

export function literal<const T extends LiteralValues>(value: T, message?: string): LiteralSchema<T>
export function literal<const T extends readonly LiteralValues[]>(
  values: T,
  message?: string,
): LiteralSchema<T>
export function literal<const T extends LiteralValues | readonly LiteralValues[]>(
  value: T,
  message?: string,
): LiteralSchema<T> {
  const values = (Array.isArray(value) ? value : [value]) as LiteralValues[]

  return {
    "~run": (input, ctx, path) => {
      if (!values.includes(input as any)) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as T extends readonly LiteralValues[] ? T[number] : T
    },
    type: "literal",
    isAsync: false,
    values: values as any,
  }
}
