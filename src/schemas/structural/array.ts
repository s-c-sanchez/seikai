import type { AsyncSchema, GenericSchema, Input, ItemPath, Output, Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface ArraySchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema>[], Output<TSchema>[]> {
  readonly type: "array"
  readonly inner: TSchema
}

export interface ArrayAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema>[], Output<TSchema>[]> {
  readonly type: "array"
  readonly inner: TSchema
}

export function array<TSchema extends Schema<unknown>>(
  inner: TSchema,
  message?: string,
): ArraySchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (!Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as Output<TSchema>[]
      }

      const length = input.length
      const output: Output<TSchema>[] = new Array(length)
      const innerPath: ItemPath = { key: 0, parent: path }
      for (let i = 0; i < length; i++) {
        innerPath.key = i
        const result = inner["~run"](input[i], ctx, innerPath)

        output[i] = result
      }

      return output
    },
    type: "array",
    isAsync: false,
    inner,
  }
}

export function arrayAsync<TSchema extends Schema<unknown>>(
  inner: TSchema,
  message?: string,
): ArrayAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (!Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })
        return input as Output<TSchema>[]
      }

      const length = input.length
      const promises: Promise<unknown>[] = new Array(length)
      for (let i = 0; i < length; i++) {
        const innerPath: ItemPath = { key: i, parent: path }
        const result = inner["~run"](input[i], ctx, innerPath)

        promises[i] = Promise.resolve(result)
      }

      return promises
    },
    type: "array",
    isAsync: true,
    inner,
  }
}
