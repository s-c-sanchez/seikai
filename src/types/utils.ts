/**
 * Utility type that makes all properties of a given type `T` optional,
 * but explicitly allows them to be `undefined`.
 *
 * @template T - The type to make optional.
 */
export type Optional<T> = { [K in keyof T]?: T[K] | undefined }

export type Pretty<T> = { [K in keyof T]: T[K] } & {}
