import type { Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface EnumSchema<T extends Record<string, string> | readonly string[]>
  extends Schema<T extends readonly string[] ? T[number] : T[keyof T]> {
  readonly type: "enum"
  readonly record: T extends readonly string[] ? { readonly [K in T[number]]: K } : T
}

function s_enum<const T extends Record<string, string>>(record: T, message?: string): EnumSchema<T>
function s_enum<const T extends readonly string[]>(values: T, message?: string): EnumSchema<T>
function s_enum<const T extends Record<string, string> | readonly string[]>(
  values: T,
  message?: string,
): EnumSchema<T> {
  const record = Array.isArray(values)
    ? Object.fromEntries(values.map(value => [value, value]))
    : values
  const recordValues = Object.values(record)

  return {
    "~run": (input, ctx, path) => {
      if (!recordValues.includes(input)) {
        addIssue(ctx, path, { isFatal: true, message })
      }

      return input as T extends readonly string[] ? T[number] : T[keyof T]
    },
    type: "enum",
    isAsync: false,
    record,
  }
}

export { s_enum as enum }
