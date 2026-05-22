import { SeikaiParseError } from "@/errors"
import type { Output, Schema, SchemaContext } from "@/types/schemas"

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
