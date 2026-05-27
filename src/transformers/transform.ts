import type { Action, AsyncAction } from "@/types/actions"

export function transform<TType>(transformer: (input: TType) => TType): Action<TType> {
  return {
    "~run": input => transformer(input),
    isAsync: false,
  }
}

export function transformAsync<TType>(
  transformer: (input: TType) => Promise<TType>,
): AsyncAction<TType> {
  return {
    "~run": async input => await transformer(input),
    isAsync: true,
  }
}
