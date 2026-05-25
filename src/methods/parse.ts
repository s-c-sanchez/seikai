import { SeikaiParseError } from "@/errors"
import type { GenericSchema, Output, Schema, SchemaContext } from "@/types/schemas"

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
