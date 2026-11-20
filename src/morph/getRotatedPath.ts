// src/morph/getRotatedPath.ts

import type {
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
 * Returns a single rotation of a path (line or curve) by shifting the start point.
 * The rotation starts at the end of the segment at `idx` and continues with the
 * following segments, wrapping around the end of the path.
 *
 * @param a PathArray (M + L/C + optional Z) — must be single subpath, normalized
 * @param idx the index of the segment the rotation starts at
 * @returns PathArray — the rotation of the path
 */
export function getRotation<T extends MorphPathArray>(a: T, idx: number): T {
  const pathLen = a.length;
  const pointCount = pathLen - 1;
  const path = [] as unknown as T;

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
  return path;
}

/**
 * Returns all possible rotations of a path (line or curve) by shifting the start point.
 * Each rotation is a new PathArray starting at a different original segment.
 *
 * @param path PathArray (M + L/C + optional Z) — must be single subpath, normalized
 * @returns PathArray[] — array of all possible rotations
 */
export function getRotations<T extends MorphPathArray>(a: T): T[] {
  const pathLen = a.length;
  const result = [] as T[];

  for (let idx = 0; idx < pathLen; idx++) {
    result.push(getRotation(a, idx));
  }
  return result;
}

/**
 * Returns the end coordinates of every segment of a path, flattened.
 *
 * @param path the path to read
 * @returns the end coordinates, two per segment
 */
const getEndCoordinates = (path: MorphPathArray): number[] => {
  const ends: number[] = [];
  for (const segment of path) {
    const end = segment.slice(-2) as PointTuple;
    ends.push(end[0], end[1]);
  }
  return ends;
};

/**
 * Finds the rotation of `pathA` that matches `pathB` best by minimizing the sum
 * of squared distances between corresponding endpoints.
 *
 * The rotations are not materialized: the endpoint of the segment at index `j` of
 * the rotation that starts at `idx` is the endpoint of the segment at index
 * `1 + ((idx + i - 1) mod pointCount)` of the source path, so the sum can be
 * computed from the source path alone.
 *
 * A rotation whose running sum is already worse than the best rotation found so
 * far cannot become the best one — the terms of the sum are squared distances,
 * so the sum only grows — and the rotation is dropped right there.
 *
 * The rotations are checked in the order of their first term, the distance
 * between the start of the rotation and the start of the reference path: the
 * rotation that matches best is usually the one that starts closest, so it is
 * usually found early and the rest of the rotations are dropped right away.
 *
 * @param pathA the path to rotate
 * @param pathB the reference path
 * @returns the index of the best rotation
 */
const getBestRotationIndex = <T extends MorphPathArray>(pathA: T, pathB: T): number => {
  const pathLen = pathA.length;
  const pointCount = pathLen - 1;
  const endsA = getEndCoordinates(pathA);
  const endsB = getEndCoordinates(pathB);

  // the first term of the sum of every rotation
  const firstTerms: number[] = [];
  const order: number[] = [];
  for (let idx = 0; idx < pathLen; idx++) {
    const dx = endsA[idx * 2] - endsB[0];
    const dy = endsA[idx * 2 + 1] - endsB[1];
    firstTerms.push(dx * dx + dy * dy);
    order.push(idx);
  }
  order.sort((a, b) => {
    const first = firstTerms[a];
    const second = firstTerms[b];
    if (first < second) return -1;
    if (first > second) return 1;
    return a - b;
  });

  let bestIndex = 0;
  let minDistanceSq = Infinity;

  for (const idx of order) {
    let sumDistSq = firstTerms[idx];
    // the start of the rotation is already worse than the best rotation
    if (sumDistSq > minDistanceSq) continue;

    for (let i = 1; i < pathLen; i++) {
      // the rotation starts at the end of the segment `idx` and continues with
      // the segments that follow it, wrapping around the end of the path
      const j = 1 + ((idx + i - 1) % pointCount);
      const dx = endsA[j * 2] - endsB[i * 2];
      const dy = endsA[j * 2 + 1] - endsB[i * 2 + 1];
      sumDistSq += dx * dx + dy * dy;
      // the sum only grows, so this rotation cannot beat the best one
      if (sumDistSq > minDistanceSq) break;
    }

    if (sumDistSq < minDistanceSq || (sumDistSq === minDistanceSq && idx < bestIndex)) {
      minDistanceSq = sumDistSq;
      bestIndex = idx;
    }
  }

  return bestIndex;
};

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
  const segCountA = pathA.length;
  const segCountB = pathB.length;

  if (segCountA !== segCountB) {
    throw new TypeError(error + ": paths must have the same number of segments after equalization");
  }

  if (computedRotations) {
    let bestIndex = 0;
    let minDistanceSq = Infinity;

    for (let ri = 0; ri < computedRotations.length; ri++) {
      const rotation = computedRotations[ri];
      let sumDistSq = 0;

      // Compare endpoints of each segment (skip M, use end coords of L/C)
      for (let i = 0; i < rotation.length; i++) {
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

    return computedRotations[bestIndex];
  }

  return getRotation(pathA, getBestRotationIndex(pathA, pathB));
}
