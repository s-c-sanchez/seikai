import { SeikaiParseError } from "@/errors"
import type { GenericSchema, Output, Schema, SchemaContext } from "@/types/schemas"

/**
 * Parses and validates unknown input data against a given synchronous schema.
 * If validation fails, it throws a `SeikaiParseError` containing the issues.
 *
 * @template TSchema - The synchronous schema type used for validation.
 *
 * @param schema - The synchronous schema instance to validate against.
 * @param input - The unknown data to be validated.
 *
 * @returns The parsed and typed data.
 *
 * @throws {SeikaiParseError} If the validation fails.
 */
export function parse<TSchema extends Schema<unknown>>(
  schema: TSchema,
  input: unknown,
): Output<TSchema> {
  const ctx: SchemaContext = {}

  const result = schema["~run"](input, ctx, undefined)

  if (ctx.issues) {
    throw new SeikaiParseError(ctx.issues)
  }

  return result
}

/**
 * Parses and validates unknown input data against a given schema asynchronously.
 * Can handle both synchronous and asynchronous schemas.
 * If validation fails, it throws a `SeikaiParseError` containing the issues.
 *
 * @template TSchema - The generic schema type (sync or async) used for validation.
 *
 * @param schema - The schema instance to validate against.
 * @param input - The unknown data to be validated.
 *
 * @returns A promise that resolves to the parsed and typed data.
 *
 * @throws {SeikaiParseError} If the validation fails.
 */
export async function parseAsync<TSchema extends GenericSchema<unknown>>(
  schema: TSchema,
  input: unknown,
): Promise<Output<TSchema>> {
  const ctx: SchemaContext = {}

  const result = await schema["~run"](input, ctx, undefined)

  if (ctx.issues) {
    throw new SeikaiParseError(ctx.issues)
  }

  return result
}
