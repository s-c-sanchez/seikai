import type { ItemPath } from "@/types/schemas"

/**
 * A shared empty array reference used to avoid unnecessary array allocations
 * when returning empty paths.
 *
 * @internal
 */
const EMPTY_PATH: PropertyKey[] = []

/**
 * Resolves a linked list `ItemPath` into a flat array of keys.
 *
 * @param path - The linked list path node to resolve, or `undefined`.
 *
 * @returns An array of keys representing the path.
 *
 * @internal
 */
export function resolvePath(path: ItemPath | undefined): PropertyKey[] {
  if (!path) return EMPTY_PATH

  const resolved: PropertyKey[] = []
  let current: ItemPath | undefined = path

  while (current) {
    resolved.unshift(current.key)
    current = current.parent
  }

  return resolved
}
