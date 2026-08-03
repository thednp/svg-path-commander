import type { PathArray } from "../types.ts";

/**
 * Check if a PathArray is closed, which means its last segment is a Z.
 * @param path
 * @returns true if the path is closed
 */
export const isClosedPath = <T extends PathArray>(path: T): boolean => {
  return path[path.length - 1][0].toUpperCase() === "Z";
};
