import type { ItemPath, SchemaContext } from "@/types/schemas"

export interface Action<TType> {
  "~run": (input: TType, ctx: SchemaContext, path: ItemPath | undefined) => TType
  isAsync: false
}

export interface AsyncAction<TType> extends Omit<Action<TType>, "~run" | "isAsync"> {
  "~run": (input: TType, ctx: SchemaContext, path: ItemPath | undefined) => Promise<TType>
  isAsync: true
}

export type GenericAction<TType> = Action<TType> | AsyncAction<TType>
