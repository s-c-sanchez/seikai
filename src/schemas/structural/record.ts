import type { AsyncSchema, GenericSchema, Input, ItemPath, Output, Schema } from "@/types/schemas"
import type { Pretty } from "@/types/utils"
import { addIssue } from "@/utils/issue"

type MarkOptional<T extends Record<PropertyKey, unknown>, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

type WithOptional<T extends Record<PropertyKey, unknown>> = MarkOptional<T, OptionalKeys<T>>

type OptionalKeys<T extends Record<PropertyKey, unknown>> = {
  [K in keyof T]: IsOptionalKey<K> extends true ? K : never
}[keyof T]

type IsOptionalKey<K extends PropertyKey> = string extends K
  ? false
  : number extends K
    ? false
    : symbol extends K
      ? false
      : true

type DynamicRecord<TKey extends PropertyKey, TValue> = Pretty<WithOptional<Record<TKey, TValue>>>

export interface RecordSchema<
  TKey extends Schema<string, PropertyKey>,
  TValue extends Schema<unknown>,
> extends Schema<
    DynamicRecord<Input<TKey>, Input<TValue>>,
    DynamicRecord<Output<TKey>, Output<TValue>>
  > {
  readonly type: "record"
  readonly keySchema: TKey
  readonly valueSchema: TValue
}

export interface RecordAsyncSchema<
  TKey extends GenericSchema<string, PropertyKey>,
  TValue extends GenericSchema<unknown>,
> extends AsyncSchema<
    DynamicRecord<Input<TKey>, Input<TValue>>,
    DynamicRecord<Output<TKey>, Output<TValue>>
  > {
  readonly type: "record"
  readonly keySchema: TKey
  readonly valueSchema: TValue
}

export function record<TKey extends Schema<string, PropertyKey>, TValue extends Schema<unknown>>(
  keySchema: TKey,
  valueSchema: TValue,
  message?: string,
): RecordSchema<TKey, TValue> {
  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "object" || input === null || Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as DynamicRecord<Output<TKey>, Output<TValue>>
      }

      const output = {} as Record<Output<TKey>, Output<TValue>>
      const keys = Object.keys(input)
      const length = keys.length
      const innerPath: ItemPath = { key: 0, parent: path }
      for (let i = 0; i < length; i++) {
        const key = keys[i]!
        if (key === "__proto__") continue
        const inputValue = input[key as keyof typeof input]
        innerPath.key = key

        const keyResult = keySchema["~run"](key, ctx, innerPath)
        const valueResult = valueSchema["~run"](inputValue, ctx, innerPath)

        output[keyResult as Output<TKey>] = valueResult
      }

      return output as unknown as DynamicRecord<Output<TKey>, Output<TValue>>
    },
    type: "record",
    isAsync: false,
    keySchema,
    valueSchema,
  }
}

export function recordAsync<
  TKey extends GenericSchema<string, PropertyKey>,
  TValue extends GenericSchema<unknown>,
>(keySchema: TKey, valueSchema: TValue, message?: string): RecordAsyncSchema<TKey, TValue> {
  return {
    "~run": async (input, ctx, path) => {
      if (typeof input !== "object" || input === null || Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })

        return input as DynamicRecord<Output<TKey>, Output<TValue>>
      }

      const keys = Object.keys(input)
      const length = keys.length
      const promises: Promise<[PropertyKey, unknown]>[] = new Array(length)
      for (let i = 0; i < length; i++) {
        const key = keys[i]!
        if (key === "__proto__") continue
        const inputValue = input[key as keyof typeof input]
        const innerPath: ItemPath = { key, parent: path }

        const keyResult = keySchema["~run"](key, ctx, innerPath)
        const valueResult = valueSchema["~run"](inputValue, ctx, innerPath)

        promises[i] = Promise.all([keyResult, valueResult])
      }

      const resolvedOutputs = await Promise.all(promises)
      const output = {} as Record<Output<TKey>, Output<TValue>>
      for (let i = 0; i < length; i++) {
        if (keys[i] === "__proto__") continue
        const [keyResult, valueResult] = resolvedOutputs[i]!
        output[keyResult as Output<TKey>] = valueResult
      }

      return output as unknown as DynamicRecord<Output<TKey>, Output<TValue>>
    },
    type: "record",
    isAsync: true,
    keySchema,
    valueSchema,
  }
}
