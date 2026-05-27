import type { GenericSchema, Input, Output, SchemaContext } from "@/types/schemas"

interface StandardTypedV1<Input = unknown, Output = Input> {
  readonly "~standard": StandardTypedV1.Props<Input, Output>
}

declare namespace StandardTypedV1 {
  interface Props<Input = unknown, Output = Input> {
    readonly version: 1
    readonly vendor: string
    readonly types?: Types<Input, Output> | undefined
  }

  interface Types<Input = unknown, Output = Input> {
    readonly input: Input
    readonly output: Output
  }

  type InferInput<Schema extends StandardTypedV1> = NonNullable<
    Schema["~standard"]["types"]
  >["input"]

  type InferOutput<Schema extends StandardTypedV1> = NonNullable<
    Schema["~standard"]["types"]
  >["output"]
}

interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly "~standard": StandardSchemaV1.Props<Input, Output>
}

declare namespace StandardSchemaV1 {
  interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined,
    ) => Result<Output> | Promise<Result<Output>>
  }

  type Result<Output> = SuccessResult<Output> | FailureResult

  interface SuccessResult<Output> {
    readonly value: Output
    readonly issues?: undefined
  }

  interface Options {
    readonly libraryOptions?: Record<string, unknown> | undefined
  }

  interface FailureResult {
    readonly issues: ReadonlyArray<Issue>
  }

  interface Issue {
    readonly message: string
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
  }

  interface PathSegment {
    readonly key: PropertyKey
  }

  interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {}

  type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>

  type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>
}

export function standard<TSchema extends GenericSchema<unknown>>(
  schema: TSchema,
): StandardSchemaV1<Input<TSchema>, Output<TSchema>> {
  return {
    "~standard": {
      validate: value => {
        const ctx: SchemaContext = {}
        const result = schema["~run"](value, ctx, undefined)

        if (result instanceof Promise) {
          return result.then(r => toStandard(r, ctx))
        }

        return toStandard(result, ctx)
      },
      vendor: "seikai",
      version: 1,
    },
  }
}

function toStandard<TType>(input: TType, ctx: SchemaContext): StandardSchemaV1.Result<TType> {
  if (!ctx.issues) {
    return { value: input }
  }

  return { issues: ctx.issues.map(issue => ({ message: issue.message, path: issue.path })) }
}
