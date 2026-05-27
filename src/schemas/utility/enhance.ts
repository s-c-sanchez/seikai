import type { Action, GenericAction } from "@/types/actions"
import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"

export interface EnhanceSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema>, Output<TSchema>> {
  readonly type: "enhance"
  readonly inner: TSchema
}

export interface EnhanceAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema>, Output<TSchema>> {
  readonly type: "enhance"
  readonly inner: TSchema
}

export function enhance<TSchema extends Schema<unknown>>(
  inner: TSchema,
  ...actions: Action<Output<TSchema>>[]
): EnhanceSchema<TSchema> {
  const length = actions.length

  return {
    "~run": (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0
      let result = inner["~run"](input, ctx, path)

      let hasFatal = false
      if (ctx.issues) {
        for (let i = issuesBefore; i < ctx.issues.length; i++) {
          if (ctx.issues[i]!.isFatal) {
            hasFatal = true
            break
          }
        }
      }

      if (hasFatal) {
        return result
      }

      for (let i = 0; i < length; i++) {
        result = actions[i]!["~run"](result, ctx, path)
      }

      return result
    },
    type: "enhance",
    isAsync: false,
    inner,
  }
}

export function enhanceAsync<TSchema extends GenericSchema<unknown>>(
  inner: TSchema,
  ...actions: GenericAction<Output<TSchema>>[]
): EnhanceAsyncSchema<TSchema> {
  const length = actions.length

  return {
    "~run": async (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0
      let result = await inner["~run"](input, ctx, path)

      let hasFatal = false
      if (ctx.issues) {
        for (let i = issuesBefore; i < ctx.issues.length; i++) {
          if (ctx.issues[i]!.isFatal) {
            hasFatal = true
            break
          }
        }
      }

      if (hasFatal) {
        return result
      }

      for (let i = 0; i < length; i++) {
        result = await actions[i]!["~run"](result, ctx, path)
      }

      return result
    },
    type: "enhance",
    isAsync: true,
    inner,
  }
}
