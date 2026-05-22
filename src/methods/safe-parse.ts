import type { SafeParseResult } from "@/types/parsers"
import type { Output, Schema, SchemaContext } from "@/types/schemas"

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
