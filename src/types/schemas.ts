import type { Issue } from "@/types/issues"

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
   * @param ctx - The context object used to collect validation issues.
   * @param path - The current path within a nested structure, if applicable.
   *
   * @returns The processed output of type `TOutput`.
   *
   * @internal
   */
  readonly "~run": (input: unknown, ctx: SchemaContext, path: ItemPath | undefined) => TOutput
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
   * @param ctx - The context object used to collect validation issues.
   * @param path - The current path within a nested structure, if applicable.
   *
   * @returns A promise that resolves to the processed output of type `TOutput`.
   *
   * @internal
   */
  readonly "~run": (
    input: unknown,
    ctx: SchemaContext,
    path: ItemPath | undefined,
  ) => Promise<TOutput>
  /**
   * Indicates that this schema is asynchronous.
   */
  readonly isAsync: true
}

/**
 * Context object passed through the schema validation process.
 * Used to collect issues encountered during validation.
 *
 * @internal
 */
export interface SchemaContext {
  /**
   * Array of issues collected during validation.
   */
  issues?: [Issue, ...Issue[]] | undefined
}

/**
 * Represents the path to an item within a nested data structure.
 * Implemented as a linked list to optimize path creation during validation.
 *
 * @internal
 */
export interface ItemPath {
  /**
   * The key of the current item in the path.
   */
  key: PropertyKey
  /**
   * The parent path node, if any.
   */
  parent?: ItemPath | undefined
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
