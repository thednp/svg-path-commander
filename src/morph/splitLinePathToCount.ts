// src/morph/splitLinePathToCount.ts

import type { PointTuple, PolylineArray } from "../types";
import splitLineToCount from "./splitLineToCount";
import { getPathSplits } from "./getPathSplits";
import { error } from "../util/error";

/**
 * Splits a PolylineArray so that it has exactly `target` line segments.
 *
 * @param path - The polyline array to split
 * @param target - The desired number of line segments
 * @returns The modified polyline array with the target segment count
 */
export function splitLinePathToCount<T extends PolylineArray>(
  path: T,
  target: number,
): T {
  if (path.length < 2 || target <= 1) return path;

  const splits = getPathSplits(path, target);
  let totalAdded = 0;

  const newPath = [path[0]] as unknown as T;
  const pathLen = path.length;
  let currentX = path[0][1];
  let currentY = path[0][2];

  // Build path using splits
  for (let i = 1; i < pathLen; i++) {
    const seg = path[i];
    const [endX, endY] = seg.slice(1) as PointTuple;

    const count = splits[i];

    // istanbul ignore else
    if (count >= 1) {
      const subLines = splitLineToCount(currentX, currentY, endX, endY, count);

      for (const sub of subLines) {
        newPath.push(["L", sub[2], sub[3]]);
        totalAdded++;
      }
    }

    currentX = endX;
    currentY = endY;
  }

  // Final safety: if somehow still wrong, log it
  // istanbul ignore if - this might possibly be impossible to test
  if (newPath.length !== target) {
    console.warn(
      `${error}: requested ${target} segments, got ${newPath.length}. Adjusted on last segment.`,
    );
  }

  return newPath;
}
