import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"
import type { MaybePromise } from "@/types/utils"

export interface LazySchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema>, Output<TSchema>> {
  readonly type: "lazy"
  readonly getter: () => TSchema
}

export interface LazyAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema>, Output<TSchema>> {
  readonly type: "lazy"
  readonly getter: () => MaybePromise<TSchema>
}

export function lazy<TSchema extends Schema<unknown>>(getter: () => TSchema): LazySchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      return getter()["~run"](input, ctx, path)
    },
    type: "lazy",
    isAsync: false,
    getter,
  }
}

export function lazyAsync<TSchema extends GenericSchema<unknown>>(
  getter: () => MaybePromise<TSchema>,
): LazyAsyncSchema<TSchema> {
  return {
    "~run": async (input, ctx, path) => {
      return await (await getter())["~run"](input, ctx, path)
    },
    type: "lazy",
    isAsync: true,
    getter,
  }
}
