import type { ItemPath, SchemaContext } from "@/types/schemas"

export type Action<TType> = (input: TType, ctx: SchemaContext, path: ItemPath | undefined) => TType

export type AsyncAction<TType> = (
  input: TType,
  ctx: SchemaContext,
  path: ItemPath | undefined,
) => Promise<TType>

export type GenericAction<TType> = Action<TType> | AsyncAction<TType>
