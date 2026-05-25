import type { SafeParseResult } from "@/types/parsers"
import type { GenericSchema, Output, Schema, SchemaContext } from "@/types/schemas"

/**
 * Safely parses and validates unknown input data against a given synchronous schema.
 * Unlike `parse`, this method does not throw errors. Instead, it returns a discriminated union
 * indicating success or failure.
 *
 * @template TSchema - The synchronous schema type used for validation.
 *
 * @param schema - The synchronous schema instance to validate against.
 * @param input - The unknown data to be validated.
 *
 * @returns An object representing either a successful parse (`{ success: true, data: TOutput }`) or a failed parse (`{ success: false, issues: Issue[] }`).
 */
export function safeParse<TSchema extends Schema<unknown>>(
  schema: TSchema,
  input: unknown,
): SafeParseResult<Output<TSchema>> {
  const ctx: SchemaContext = {}

  const result = schema["~run"](input, ctx, undefined)

  if (ctx.issues) {
    return { success: false, issues: ctx.issues }
  }

  return { success: true, data: result }
}

/**
 * Safely parses and validates unknown input data against a given schema asynchronously.
 * Can handle both synchronous and asynchronous schemas.
 * Unlike `parseAsync`, this method does not throw errors. Instead, it returns a promise resolving
 * to a discriminated union indicating success or failure.
 *
 * @template TSchema - The generic schema type (sync or async) used for validation.
 *
 * @param schema - The schema instance to validate against.
 * @param input - The unknown data to be validated.
 *
 * @returns A promise resolving to an object representing either a successful parse (`{ success: true, data: TOutput }`) or a failed parse (`{ success: false, issues: Issue[] }`).
 */
export async function safeParseAsync<TSchema extends GenericSchema<unknown>>(
  schema: TSchema,
  input: unknown,
): Promise<SafeParseResult<Output<TSchema>>> {
  const ctx: SchemaContext = {}

  const result = await schema["~run"](input, ctx, undefined)

  if (ctx.issues) {
    return { success: false, issues: ctx.issues }
  }

  return { success: true, data: result }
}
