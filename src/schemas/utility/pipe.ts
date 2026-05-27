import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"
import type { MaybePromise } from "@/types/utils"

export interface PipeSchema<TFrom extends Schema<unknown>, TTo extends Schema<unknown>>
  extends Schema<Input<TFrom>, Output<TTo>> {
  readonly type: "pipe"
  readonly fromSchema: TFrom
  readonly toSchema: TTo
}

export interface PipeAsyncSchema<
  TFrom extends GenericSchema<unknown>,
  TTo extends GenericSchema<unknown>,
> extends AsyncSchema<Input<TFrom>, Output<TTo>> {
  readonly type: "pipe"
  readonly fromSchema: TFrom
  readonly toSchema: TTo
}

export function pipe<TFrom extends Schema<unknown, Input<TTo>>, TTo extends Schema<unknown>>(
  fromSchema: TFrom,
  toSchema: TTo,
): PipeSchema<TFrom, TTo>
export function pipe<TFrom extends Schema<unknown>, TTo extends Schema<unknown>>(
  fromSchema: TFrom,
  toSchema: TTo,
  transformer: (input: Output<TFrom>) => Input<TTo>,
): PipeSchema<TFrom, TTo>
export function pipe<TFrom extends Schema<unknown>, TTo extends Schema<unknown>>(
  fromSchema: TFrom,
  toSchema: TTo,
  transformer?: (input: Output<TFrom>) => Input<TTo>,
): PipeSchema<TFrom, TTo> {
  return {
    "~run": (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0
      const result = fromSchema["~run"](input, ctx, path)

      if (ctx.issues && ctx.issues.length > issuesBefore) {
        return result
      }

      const transformed = transformer ? transformer(result) : result

      return toSchema["~run"](transformed, ctx, path)
    },
    type: "pipe",
    isAsync: false,
    fromSchema,
    toSchema,
  }
}

export function pipeAsync<
  TFrom extends GenericSchema<unknown, Input<TTo>>,
  TTo extends GenericSchema<unknown>,
>(fromSchema: TFrom, toSchema: TTo): PipeAsyncSchema<TFrom, TTo>
export function pipeAsync<TFrom extends GenericSchema<unknown>, TTo extends GenericSchema<unknown>>(
  fromSchema: TFrom,
  toSchema: TTo,
  transformer: (input: Output<TFrom>) => MaybePromise<Input<TTo>>,
): PipeAsyncSchema<TFrom, TTo>
export function pipeAsync<TFrom extends GenericSchema<unknown>, TTo extends GenericSchema<unknown>>(
  fromSchema: TFrom,
  toSchema: TTo,
  transformer?: (input: Output<TFrom>) => MaybePromise<Input<TTo>>,
): PipeAsyncSchema<TFrom, TTo> {
  return {
    "~run": async (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0
      const result = await fromSchema["~run"](input, ctx, path)

      if (ctx.issues && ctx.issues.length > issuesBefore) {
        return result
      }

      const transformed = transformer ? await transformer(result) : result

      return await toSchema["~run"](transformed, ctx, path)
    },
    type: "pipe",
    isAsync: true,
    fromSchema,
    toSchema,
  }
}
