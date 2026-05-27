import type { GenericSchema } from "@/types/schemas"

export type Optional<T> = { [K in keyof T]?: T[K] | undefined }

export type ValueOrFactory<T> = T | (() => T)

export type IsInputOptional<TSchema extends GenericSchema<unknown>> = TSchema extends {
  "~optional"?: { input: true }
}
  ? true
  : false
export type IsOutputOptional<TSchema extends GenericSchema<unknown>> = TSchema extends {
  "~optional"?: { output: true }
}
  ? true
  : false

export type Pretty<T> = { [K in keyof T]: T[K] } & {}
