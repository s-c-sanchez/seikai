import type { GenericSchema, SchemaOptionalTypes } from "@/types/schemas"

export type Optional<T> = { [K in keyof T]?: T[K] | undefined }

export type ValueOrFactory<T> = T | (() => T)

export type MaybePromise<T> = T | Promise<T>

export type IsInputOptional<TSchema extends GenericSchema<unknown>> = TSchema extends {
  "~optional"?: SchemaOptionalTypes<true, boolean>
}
  ? true
  : false
export type IsOutputOptional<TSchema extends GenericSchema<unknown>> = TSchema extends {
  "~optional"?: SchemaOptionalTypes<boolean, true>
}
  ? true
  : false

export type Pretty<T> = { [K in keyof T]: T[K] } & {}
