import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"
import type { ValueOrFactory } from "@/types/utils"

export interface CatchSchema<TSchema extends Schema<unknown>>
  extends Schema<Input<TSchema>, Output<TSchema>> {
  readonly type: "catch"
  readonly inner: TSchema
}

export interface CatchAsyncSchema<TSchema extends GenericSchema<unknown>>
  extends AsyncSchema<Input<TSchema>, Output<TSchema>> {
  readonly type: "catch"
  readonly inner: TSchema
}

function s_catch<TSchema extends Schema<unknown>>(
  inner: TSchema,
  catchValue: ValueOrFactory<Output<TSchema>>,
): CatchSchema<TSchema> {
  return {
    "~run": (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0
      const result = inner["~run"](input, ctx, path)

      if (ctx.issues && ctx.issues.length > issuesBefore) {
        if (issuesBefore === 0) {
          ctx.issues = undefined
        } else {
          ctx.issues.length = issuesBefore
        }

        return typeof catchValue === "function"
          ? (catchValue as () => Output<TSchema>)()
          : catchValue
      }

      return result
    },
    type: "catch",
    isAsync: false,
    inner,
  }
}

export { s_catch as catch }
