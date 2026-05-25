import type { AsyncSchema, GenericSchema, Input, ItemPath, Output, Schema } from "@/types/schemas"
import type { Pretty } from "@/types/utils"
import { addIssue } from "@/utils/issue"

export type Shape = Record<string, Schema<unknown>>
export type GenericShape = Record<string, GenericSchema<unknown>>

export type ShapeInput<TShape extends GenericShape> = Pretty<{
  [K in keyof TShape]: Input<TShape[K]>
}>
export type ShapeOutput<TShape extends GenericShape> = Pretty<{
  [K in keyof TShape]: Output<TShape[K]>
}>

export interface ObjectSchema<TShape extends Shape>
  extends Schema<ShapeInput<TShape>, ShapeOutput<TShape>> {
  readonly type: "object"
  readonly shape: TShape
}

export interface ObjectAsyncSchema<TShape extends GenericShape>
  extends AsyncSchema<ShapeInput<TShape>, ShapeOutput<TShape>> {
  readonly type: "object"
  readonly shape: TShape
}

export function object<TShape extends Shape>(
  shape: TShape,
  message?: string,
): ObjectSchema<TShape> {
  const keys = Object.keys(shape)
  const length = keys.length

  return {
    "~run": (input, ctx, path) => {
      if (typeof input !== "object" || input === null || Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })
        return input as ShapeOutput<TShape>
      }

      const output = {} as ShapeOutput<TShape>
      const innerPath: ItemPath = { key: 0, parent: path }

      for (let i = 0; i < length; i++) {
        const key = keys[i]!
        const inputValue = input[key as keyof typeof input]
        innerPath.key = key
        const result = shape[key]!["~run"](inputValue, ctx, innerPath)

        output[key as keyof ShapeOutput<TShape>] = result
      }

      return output
    },
    type: "object",
    isAsync: false,
    shape,
  }
}

export function objectAsync<TShape extends GenericShape>(
  shape: TShape,
  message?: string,
): ObjectAsyncSchema<TShape> {
  const keys = Object.keys(shape)
  const length = keys.length

  return {
    "~run": async (input, ctx, path) => {
      if (typeof input !== "object" || input === null || Array.isArray(input)) {
        addIssue(ctx, path, { isFatal: true, message })
        return input as ShapeOutput<TShape>
      }

      const promises: Promise<unknown>[] = new Array(length)

      for (let i = 0; i < length; i++) {
        const key = keys[i]!
        const inputValue = input[key as keyof typeof input]
        const innerPath: ItemPath = { key, parent: path }

        promises[i] = Promise.resolve(shape[key]!["~run"](inputValue, ctx, innerPath))
      }

      const resolvedOutputs = await Promise.all(promises)
      const output = {} as ShapeOutput<TShape>

      for (let i = 0; i < length; i++) {
        output[keys[i] as keyof ShapeOutput<TShape>] = resolvedOutputs[i]
      }

      return output
    },
    type: "object",
    isAsync: true,
    shape,
  }
}
