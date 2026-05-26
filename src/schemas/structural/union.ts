import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"

export interface UnionSchema<TSchema extends Schema<unknown>[]>
  extends Schema<Input<TSchema[number]>, Output<TSchema[number]>> {
  readonly type: "union"
  readonly options: TSchema
}

export interface UnionAsyncSchema<TSchema extends GenericSchema<unknown>[]>
  extends AsyncSchema<Input<TSchema[number]>, Output<TSchema[number]>> {
  readonly type: "union"
  readonly options: TSchema
}

export function union<const TSchema extends Schema<unknown>[]>(
  options: TSchema,
): UnionSchema<TSchema> {
  const length = options.length

  return {
    "~run": (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0

      for (let i = 0; i < length; i++) {
        const startingIssues = ctx.issues?.length ?? 0
        const result = options[i]!["~run"](input, ctx, path)

        if (!ctx.issues || ctx.issues.length === startingIssues) {
          if (ctx.issues) {
            if (issuesBefore === 0) {
              ctx.issues = undefined
            } else {
              ctx.issues.length = issuesBefore
            }
          }

          return result
        }
      }

      return input
    },
    type: "union",
    isAsync: false,
    options,
  }
}

export function unionAsync<const TSchema extends GenericSchema<unknown>[]>(
  options: TSchema,
): UnionAsyncSchema<TSchema> {
  const length = options.length

  return {
    "~run": async (input, ctx, path) => {
      const issuesBefore = ctx.issues?.length ?? 0

      for (let i = 0; i < length; i++) {
        const startingIssues = ctx.issues?.length ?? 0
        const result = await options[i]!["~run"](input, ctx, path)

        if (!ctx.issues || ctx.issues.length === startingIssues) {
          if (ctx.issues) {
            if (issuesBefore === 0) {
              ctx.issues = undefined
            } else {
              ctx.issues.length = issuesBefore
            }
          }

          return result
        }
      }

      return input
    },
    type: "union",
    isAsync: true,
    options,
  }
}
