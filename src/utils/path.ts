import type { ItemPath } from "@/types/schemas"

const EMPTY_PATH: PropertyKey[] = []

export function resolvePath(path: ItemPath | undefined): PropertyKey[] {
  if (!path) return EMPTY_PATH

  const resolved: PropertyKey[] = []
  let current: ItemPath | undefined = path

  while (current) {
    resolved.push(current.key)
    current = current.parent
  }

  return resolved.reverse()
}
