// src/morph/splitCubicPathToCount.ts
import type { CSegment, CurveArray, PointTuple } from "../types";
import { splitCubicToCount } from "./splitCubicToCount.ts";
import { getPathSplits } from "./getPathSplits.ts";
import { error } from "../util/error.ts";

/**
 * Splits a CurveArray so that it has exactly `target` cubic segments.
 *
 * @param path - The curve array to split
 * @param target - The desired number of cubic segments
 * @returns The modified curve array with the target segment count
 */
export function splitCurvePathToCount<T extends CurveArray>(
  path: T,
  target: number,
): T {
  // istanbul ignore else
  if (path.length < 2 || target <= 1) return path;

  const splits = getPathSplits(path, target);
  let totalAdded = 0;

  const newPath = [path[0]] as unknown as T; // keep M
  const pathLen = path.length;
  let currentX = path[0][1];
  let currentY = path[0][2];

  for (let i = 1; i < pathLen; i++) {
    const seg = path[i] as CSegment /*| ZSegment*/;
    const [endX, endY] = seg.slice(-2) as PointTuple;

    const count = splits[i];

    // istanbul ignore else
    if (count >= 1) {
      const subs = splitCubicToCount(
        currentX,
        currentY,
        seg[1],
        seg[2],
        seg[3],
        seg[4],
        seg[5],
        seg[6],
        count,
      );

      for (const sub of subs) {
        newPath.push(["C", sub[2], sub[3], sub[4], sub[5], sub[6], sub[7]]);
        totalAdded++;
      }
    }
    currentX = endX;
    currentY = endY;
  }

  // Final safety: if somehow still wrong, log it
  // istanbul ignore if
  if (newPath.length !== target) {
    console.warn(
      `${error}: requested ${target} segments, got ${newPath.length}.`,
    );
  }

  return newPath;
}
