import type {
  AsyncSchema,
  GenericSchema,
  Input,
  Output,
  Schema,
  SchemaOptionalTypes,
} from "@/types/schemas"

export interface NullishSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema> | null | undefined, Output<TSchema> | null | undefined> {
  readonly "~optional"?: SchemaOptionalTypes<true, true>
  readonly type: "nullish"
  readonly inner: TSchema
}

export interface NullishAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema> | null | undefined, Output<TSchema> | null | undefined> {
  readonly "~optional"?: SchemaOptionalTypes<true, true>
  readonly type: "nullish"
  readonly inner: TSchema
}

export function nullish<TSchema extends Schema<unknown>>(inner: TSchema): NullishSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (input == null) return input
      return inner["~run"](input, ctx, path)
    },
    type: "nullish",
    isAsync: false,
    inner,
  }
}

export function nullishAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
): NullishAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (input == null) return input
      return await inner["~run"](input, ctx, path)
    },
    type: "nullish",
    isAsync: true,
    inner,
  }
}
