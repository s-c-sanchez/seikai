import type {
  AsyncSchema,
  GenericSchema,
  Input,
  Output,
  Schema,
  SchemaOptionalTypes,
} from "@/types/schemas"
import type { MaybePromise, ValueOrFactory } from "@/types/utils"

export interface FallbackSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema> | undefined, Output<TSchema>> {
  readonly "~optional"?: SchemaOptionalTypes<true, false>
  readonly type: "fallback"
  readonly inner: TSchema
}

export interface FallbackAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema> | undefined, Output<TSchema>> {
  readonly "~optional"?: SchemaOptionalTypes<true, false>
  readonly type: "fallback"
  readonly inner: TSchema
}

export function fallback<TSchema extends Schema<unknown>>(
  inner: TSchema,
  fallbackValue: ValueOrFactory<Output<TSchema>>,
): FallbackSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      if (input === undefined) {
        return typeof fallbackValue === "function"
          ? (fallbackValue as () => Output<TSchema>)()
          : fallbackValue
      }

      return inner["~run"](input, ctx, path)
    },
    type: "fallback",
    isAsync: false,
    inner,
  }
}

export function fallbackAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
  fallbackValue: ValueOrFactory<MaybePromise<Output<TSchema>>>,
): FallbackAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      if (input === undefined) {
        return typeof fallbackValue === "function"
          ? await (fallbackValue as () => MaybePromise<Output<TSchema>>)()
          : await fallbackValue
      }

      return await inner["~run"](input, ctx, path)
    },
    type: "fallback",
    isAsync: true,
    inner,
  }
}
