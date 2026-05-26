import type {
  AsyncSchema,
  GenericSchema,
  Input,
  Output,
  Schema,
  SchemaOptionalTypes,
} from "@/types/schemas"

export interface OptionalSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema> | undefined, Output<TSchema> | undefined> {
  readonly "~optional"?: SchemaOptionalTypes<true, true>
  readonly type: "optional"
  readonly inner: TSchema
}

export interface OptionalAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema> | undefined, Output<TSchema> | undefined> {
  readonly "~optional"?: SchemaOptionalTypes<true, true>
  readonly type: "optional"
  readonly inner: TSchema
}

export function optional<TSchema extends Schema<unknown>>(inner: TSchema): OptionalSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (input === undefined) return undefined
      return inner["~run"](input, ctx, path)
    },
    type: "optional",
    isAsync: false,
    inner,
  }
}

export function optionalAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
): OptionalAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (input === undefined) return undefined
      return await inner["~run"](input, ctx, path)
    },
    type: "optional",
    isAsync: true,
    inner,
  }
}
