// src/morph/getRotatedPath.ts

import {
  CSegment,
  // CurveArray,
  LSegment,
  MorphPathArray,
  MSegment,
  PointTuple,
  // PolylineArray,
  ZSegment,
} from "../types.ts";
import { error } from "../util/error.ts";

/**
 * Returns all possible rotations of a path (line or curve) by shifting the start point.
 * Each rotation is a new PathArray starting at a different original segment.
 *
 * @param path PathArray (M + L/C + optional Z) — must be single subpath, normalized
 * @returns PathArray[] — array of all possible rotations
 */
export function getRotations<T extends MorphPathArray>(a: T) {
  const pathLen = a.length;
  const pointCount = pathLen - 1;
  let path: T;
  const result = [] as T[];

  for (let idx = 0; idx < pathLen; idx++) {
    path = [] as unknown as T;
    for (let i = 0; i < pathLen; i++) {
      let oldSegIdx = idx + i;
      let seg: LSegment | CSegment | MSegment | ZSegment;

      if (i === 0 || (a[oldSegIdx] && a[oldSegIdx][0] === "M")) {
        seg = a[oldSegIdx];
        path.push(["M", ...seg.slice(-2)] as MSegment);
        continue;
      }
      if (oldSegIdx >= pathLen) {
        oldSegIdx -= pointCount;
      }
      path.push(a[oldSegIdx] as never);
    }
    result.push(path);
  }
  return result;
}

/**
 * Finds the best rotation of pathA to match pathB by minimizing sum of squared distances
 * between corresponding endpoints.
 *
 * Works with both polygon (L) and curve (C) arrays.
 *
 * @param pathA PathArray to rotate (will be modified in rotation options)
 * @param pathB PathArray reference (fixed)
 * @returns PathArray — best rotation of pathA
 */
export function getRotatedPath<T extends MorphPathArray>(
  pathA: T,
  pathB: T,
  computedRotations?: T[],
): T {
  const rotations = computedRotations || getRotations(pathA);
  const segCountA = pathA.length;
  const segCountB = pathB.length;

  if (segCountA !== segCountB) {
    throw new TypeError(
      error +
        ": paths must have the same number of segments after equalization",
    );
  }

  let bestIndex = 0;
  let minDistanceSq = Infinity;

  for (let ri = 0; ri < rotations.length; ri++) {
    const rotation = rotations[ri];
    const rLen = rotation.length;
    let sumDistSq = 0;

    // Compare endpoints of each segment (skip M, use end coords of L/C)
    for (let i = 0; i < rLen; i++) {
      const segA = rotation[i];
      const segB = pathB[i];

      const endA = segA.slice(-2) as PointTuple;
      const endB = segB.slice(-2) as PointTuple;

      const dx = endA[0] - endB[0];
      const dy = endA[1] - endB[1];
      sumDistSq += dx * dx + dy * dy;
    }

    if (sumDistSq < minDistanceSq) {
      minDistanceSq = sumDistSq;
      bestIndex = ri;
    }
  }

  return rotations[bestIndex];
}
