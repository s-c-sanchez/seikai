import type { AsyncSchema, GenericSchema, Input, Output, Schema } from "@/types/schemas"

type IntersectionInput<TSchema extends readonly GenericSchema<unknown>[]> =
  TSchema extends readonly [
    infer Head extends GenericSchema<unknown>,
    ...infer Rest extends readonly GenericSchema<unknown>[],
  ]
    ? Input<Head> & IntersectionInput<Rest>
    : unknown

type IntersectionOutput<TSchema extends readonly GenericSchema<unknown>[]> =
  TSchema extends readonly [
    infer Head extends GenericSchema<unknown>,
    ...infer Rest extends readonly GenericSchema<unknown>[],
  ]
    ? Output<Head> & IntersectionOutput<Rest>
    : unknown

export interface IntersectionSchema<TSchema extends readonly Schema<unknown>[]>
  extends Schema<IntersectionInput<TSchema>, IntersectionOutput<TSchema>> {
  readonly type: "intersection"
  readonly schemas: TSchema
}

export interface IntersectionAsyncSchema<TSchema extends readonly GenericSchema<unknown>[]>
  extends AsyncSchema<IntersectionInput<TSchema>, IntersectionOutput<TSchema>> {
  readonly type: "intersection"
  readonly schemas: TSchema
}

export function intersection<const TSchema extends readonly Schema<unknown>[]>(
  schemas: TSchema,
): IntersectionSchema<TSchema> {
  const length = schemas.length

  return {
    "~run": (input, ctx, path) => {
      let result = input
      let isFirst = true

      for (let i = 0; i < length; i++) {
        const currentOutput = schemas[i]!["~run"](input, ctx, path)

        if (isFirst) {
          result = currentOutput
          isFirst = false
        } else {
          if (
            typeof result === "object" &&
            result !== null &&
            !Array.isArray(result) &&
            typeof currentOutput === "object" &&
            currentOutput !== null &&
            !Array.isArray(currentOutput)
          ) {
            result = { ...result, ...currentOutput }
          } else {
            result = currentOutput
          }
        }
      }

      return result as IntersectionOutput<TSchema>
    },
    type: "intersection",
    isAsync: false,
    schemas,
  }
}

export function intersectionAsync<const TSchema extends readonly GenericSchema<unknown>[]>(
  schemas: TSchema,
): IntersectionAsyncSchema<TSchema> {
  const length = schemas.length

  return {
    "~run": async (input, ctx, path) => {
      const promises: Promise<unknown>[] = new Array(length)
      for (let i = 0; i < length; i++) {
        const result = schemas[i]!["~run"](input, ctx, path)

        promises[i] = Promise.resolve(result)
      }

      const resolvedOutputs = await Promise.all(promises)
      let result = input
      let isFirst = true

      for (let i = 0; i < length; i++) {
        const currentOutput = resolvedOutputs[i]!

        if (isFirst) {
          result = currentOutput
          isFirst = false
        } else {
          if (
            typeof result === "object" &&
            result !== null &&
            !Array.isArray(result) &&
            typeof currentOutput === "object" &&
            currentOutput !== null &&
            !Array.isArray(currentOutput)
          ) {
            result = { ...result, ...currentOutput }
          } else {
            result = currentOutput
          }
        }
      }

      return result as IntersectionOutput<TSchema>
    },
    type: "intersection",
    isAsync: true,
    schemas,
  }
}
