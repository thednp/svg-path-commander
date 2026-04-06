import type { NormalArray } from "../types.ts";

/**
 * Create a degenerate `PathArray` at a given coordinate
 * to serve as a pair for another `PathArray`.
 * @param param0 An [x, y] tuple for the coordinate
 * @returns A new degenerate `PathArray`
 */
export const createPlaceholder = (
  [atx, aty]: [number, number],
): NormalArray => {
  // Tiny square at point
  const r = 0.001;
  return [
    ["M", atx, aty],
    ["L", atx + r, aty],
    ["L", atx + r, aty + r],
    ["L", atx, aty + r],
    ["L", atx, aty],
    ["Z"],
  ];
};
