import type { AsyncSchema, GenericSchema, Input, ItemPath, Output, Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

type TupleInput<TSchema extends readonly GenericSchema<unknown>[]> = TSchema extends readonly [
  infer Head extends GenericSchema<unknown>,
  ...infer Rest extends readonly GenericSchema<unknown>[],
]
  ? [Input<Head>, ...TupleInput<Rest>]
  : []

type TupleOutput<TSchema extends readonly GenericSchema<unknown>[]> = TSchema extends readonly [
  infer Head extends GenericSchema<unknown>,
  ...infer Rest extends readonly GenericSchema<unknown>[],
]
  ? [Output<Head>, ...TupleOutput<Rest>]
  : []

export interface TupleSchema<TSchema extends readonly Schema<unknown>[]>
  extends Schema<TupleInput<TSchema>, TupleOutput<TSchema>> {
  readonly type: "tuple"
  readonly items: TSchema
}

export interface TupleAsyncSchema<TSchema extends readonly GenericSchema<unknown>[]>
  extends AsyncSchema<TupleInput<TSchema>, TupleOutput<TSchema>> {
  readonly type: "tuple"
  readonly items: TSchema
}

export function tuple<const TSchema extends readonly Schema<unknown>[]>(
  items: TSchema,
  message?: string,
): TupleSchema<TSchema> {
  const length = items.length

  return {
    "~run": (input, ctx, path) => {
      if (!Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as TupleOutput<TSchema>
      }

      const output = new Array(length) as TupleOutput<TSchema>
      const innerPath: ItemPath = { key: 0, parent: path }
      for (let i = 0; i < length; i++) {
        innerPath.key = i
        const result = items[i]!["~run"](input[i], ctx, innerPath)

        output[i] = result as TupleOutput<TSchema>[number]
      }

      return output
    },
    type: "tuple",
    isAsync: false,
    items,
  }
}

export function tupleAsync<const TSchema extends readonly GenericSchema<unknown>[]>(
  items: TSchema,
  message?: string,
): TupleAsyncSchema<TSchema> {
  const length = items.length

  return {
    "~run": async (input, ctx, path) => {
      if (!Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as TupleOutput<TSchema>
      }

      const promises: Promise<unknown>[] = new Array(length)
      for (let i = 0; i < length; i++) {
        const innerPath: ItemPath = { key: i, parent: path }
        const result = items[i]!["~run"](input[i], ctx, innerPath)

        promises[i] = Promise.resolve(result)
      }

      return (await Promise.all(promises)) as TupleOutput<TSchema>
    },
    type: "tuple",
    isAsync: true,
    items,
  }
}
