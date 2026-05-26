import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface SetSchema<TSchema extends Schema<unknown>>
  extends Schema<Set<Input<TSchema>>, Set<Output<TSchema>>> {
  readonly type: "set"
  readonly inner: TSchema
}

export interface SetAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Set<Input<TSchema>>, Set<Output<TSchema>>> {
  readonly type: "set"
  readonly inner: TSchema
}

export function set<TSchema extends Schema<unknown>>(
  inner: TSchema,
  message?: string,
): SetSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (!(input instanceof Set)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as Set<Output<TSchema>>
      }

      const output = new Set<Output<TSchema>>()
      for (const value of input) {
        const result = inner["~run"](value, ctx, path)

        output.add(result)
      }

      return output
    },
    type: "set",
    isAsync: false,
    inner,
  }
}

export function setAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
  message?: string,
): SetAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (!(input instanceof Set)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as Set<Output<TSchema>>
      }

      const promises: Promise<Output<TSchema>>[] = []
      for (const value of input) {
        const result = inner["~run"](value, ctx, path)

        promises.push(Promise.resolve(result))
      }

      const resolvedValues = await Promise.all(promises)
      return new Set(resolvedValues)
    },
    type: "set",
    isAsync: true,
    inner,
  }
}
