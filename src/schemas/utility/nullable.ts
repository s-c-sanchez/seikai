import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"

export interface NullableSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema> | null, Output<TSchema> | null> {
  readonly type: "nullable"
  readonly inner: TSchema
}

export interface NullableAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema> | null, Output<TSchema> | null> {
  readonly type: "nullable"
  readonly inner: TSchema
}

export function nullable<TSchema extends Schema<unknown>>(inner: TSchema): NullableSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (input === null) return null
      return inner["~run"](input, ctx, path)
    },
    type: "nullable",
    isAsync: false,
    inner,
  }
}

export function nullableAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
): NullableAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (input === null) return null
      return await inner["~run"](input, ctx, path)
    },
    type: "nullable",
    isAsync: true,
    inner,
  }
}
