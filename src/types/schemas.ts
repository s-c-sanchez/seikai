/**
 * Represents a base synchronous schema.
 *
 * @template TInput - The input type of the schema.
 * @template TOutput - The output type of the schema. Defaults to `TInput`.
 */
export interface Schema<TInput, TOutput = TInput> {
  /**
   * Parses and validates the input synchronously.
   *
   * @param input - The unknown data to be processed.
   *
   * @returns The processed output of type `TOutput`.
   *
   * @internal
   */
  readonly "~run": (input: unknown) => TOutput
  /**
   * Optional property used for type inference of input and output types.
   *
   * @internal
   */
  readonly "~types"?: SchemaTypes<TInput, TOutput>
  /**
   * The schema type identifier.
   */
  readonly type: string
  /**
   * Indicates that this schema is synchronous.
   */
  readonly isAsync: false
}

/**
 * Represents an asynchronous schema.
 *
 * @template TInput - The input type of the schema.
 * @template TOutput - The output type of the schema. Defaults to `TInput`.
 */
export interface AsyncSchema<TInput, TOutput = TInput>
  extends Omit<Schema<TInput, TOutput>, "~run" | "isAsync"> {
  /**
   * Parses and validates the input asynchronously.
   *
   * @param input - The unknown data to be processed.
   *
   * @returns A promise that resolves to the processed output of type `TOutput`.
   *
   * @internal
   */
  readonly "~run": (input: unknown) => Promise<TOutput>
  /**
   * Indicates that this schema is asynchronous.
   */
  readonly isAsync: true
}

/**
 * Utility interface for storing input and output types for inference.
 *
 * @template TInput - The input type.
 * @template TOutput - The output type.
 */
interface SchemaTypes<TInput, TOutput> {
  /**
   * The input type.
   */
  readonly input: TInput
  /**
   * The output type.
   */
  readonly output: TOutput
}

/**
 * A generic schema type that can be either synchronous or asynchronous.
 *
 * @template TInput - The input type of the schema.
 * @template TOutput - The output type of the schema. Defaults to `TInput`.
 */
export type GenericSchema<TInput, TOutput = TInput> =
  | Schema<TInput, TOutput>
  | AsyncSchema<TInput, TOutput>

/**
 * Extracts the input type from a given schema type.
 *
 * @template TSchema - The schema type to extract the input type from.
 */
export type Input<TSchema extends GenericSchema<unknown>> = NonNullable<TSchema["~types"]>["input"]

/**
 * Extracts the output type from a given schema type.
 *
 * @template TSchema - The schema type to extract the output type from.
 */
export type Output<TSchema extends GenericSchema<unknown>> = NonNullable<
  TSchema["~types"]
>["output"]
