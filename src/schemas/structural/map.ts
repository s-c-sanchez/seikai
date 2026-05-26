import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"
import { addIssue } from "@/utils/issue"

export interface MapSchema<TKey extends Schema<unknown>, TValue extends Schema<unknown>>
  extends Schema<Map<Input<TKey>, Input<TValue>>, Map<Output<TKey>, Output<TValue>>> {
  readonly type: "map"
  readonly keySchema: TKey
  readonly valueSchema: TValue
}

export interface MapAsyncSchema<
  TKey extends GenericSchema<unknown>,
  TValue extends GenericSchema<unknown>,
> extends AsyncSchema<Map<Input<TKey>, Input<TValue>>, Map<Output<TKey>, Output<TValue>>> {
  readonly type: "map"
  readonly keySchema: TKey
  readonly valueSchema: TValue
}

export function map<TKey extends Schema<unknown>, TValue extends Schema<unknown>>(
  keySchema: TKey,
  valueSchema: TValue,
  message?: string,
): MapSchema<TKey, TValue> {
  return {
    "~run": (input, ctx, path) => {
      if (!(input instanceof Map)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as Map<Output<TKey>, Output<TValue>>
      }

      const output = new Map<Output<TKey>, Output<TValue>>()
      for (const [key, value] of input) {
        const keyResult = keySchema["~run"](key, ctx, path)
        const valueResult = valueSchema["~run"](value, ctx, path)

        output.set(keyResult, valueResult)
      }

      return output
    },
    type: "map",
    isAsync: false,
    keySchema,
    valueSchema,
  }
}

export function mapAsync<
  TKey extends GenericSchema<unknown>,
  TValue extends GenericSchema<unknown>,
>(keySchema: TKey, valueSchema: TValue, message?: string): MapAsyncSchema<TKey, TValue> {
  return {
    "~run": async (input, ctx, path) => {
      if (!(input instanceof Map)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as Map<Output<TKey>, Output<TValue>>
      }

      const promises: Promise<[Input<TKey>, Input<TValue>]>[] = []
      for (const [key, value] of input) {
        const keyResult = keySchema["~run"](key, ctx, path)
        const valueResult = valueSchema["~run"](value, ctx, path)

        promises.push(Promise.all([keyResult, valueResult]))
      }

      const resolvedOutputs = await Promise.all(promises)
      return new Map(resolvedOutputs)
    },
    type: "map",
    isAsync: true,
    keySchema,
    valueSchema,
  }
}
