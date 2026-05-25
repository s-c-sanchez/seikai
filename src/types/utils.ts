export type Optional<T> = { [K in keyof T]?: T[K] | undefined }

export type Pretty<T> = { [K in keyof T]: T[K] } & {}
