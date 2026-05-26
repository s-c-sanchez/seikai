import type { Issue } from "@/types/issues"

export interface Schema<TInput, TOutput = TInput> {
  readonly "~run": (input: unknown, ctx: SchemaContext, path: ItemPath | undefined) => TOutput
  readonly "~types"?: SchemaTypes<TInput, TOutput>
  readonly type: string
  readonly isAsync: false
}

export interface AsyncSchema<TInput, TOutput = TInput>
  extends Omit<Schema<TInput, TOutput>, "~run" | "isAsync"> {
  readonly "~run": (
    input: unknown,
    ctx: SchemaContext,
    path: ItemPath | undefined,
  ) => Promise<TOutput>
  readonly isAsync: true
}

export interface SchemaContext {
  issues?: [Issue, ...Issue[]] | undefined
}

export interface ItemPath {
  key: PropertyKey
  parent?: ItemPath | undefined
}

interface SchemaTypes<TInput, TOutput> {
  readonly input: TInput
  readonly output: TOutput
}

export interface SchemaOptionalTypes<TInput extends boolean, TOutput extends boolean> {
  readonly input: TInput
  readonly output: TOutput
}

export type GenericSchema<TInput, TOutput = TInput> =
  | Schema<TInput, TOutput>
  | AsyncSchema<TInput, TOutput>

export type Input<TSchema extends GenericSchema<unknown>> = NonNullable<TSchema["~types"]>["input"]
export type Output<TSchema extends GenericSchema<unknown>> = NonNullable<
  TSchema["~types"]
>["output"]
